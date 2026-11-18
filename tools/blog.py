"""Bộ công cụ quản lý Blog Hugo (cmduyeen.github.io) trực tiếp từ Obsidian (D:\\Brain2nd)."""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import datetime as dt
from dataclasses import dataclass
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
import urllib.parse
import webbrowser

for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, 'reconfigure'):
        stream.reconfigure(encoding='utf-8')

SYS_DIR = Path(r'D:\Brain2nd\.system')
if str(SYS_DIR) not in sys.path:
    sys.path.insert(0, str(SYS_DIR))
from security_guard import assert_repo_staged_safe
from blogger_aff import run_blogger_channel_cli

ROOT = Path(__file__).resolve().parent.parent
VAULT_DIR = Path(os.environ.get('DYN_VAULT_DIR', r'D:\Brain2nd')).expanduser().resolve()
VAULT_BLOG = VAULT_DIR / '04-Content' / 'GitHub-Page'
VAULT_NOTES = VAULT_DIR / '02-Notes'
VAULT_ATTACHMENTS = VAULT_DIR / '10-Attachments'
LOCAL = ROOT / '.blog-local'
BLOG_DIR = Path(os.environ.get('DYN_BLOG_DIR', str(LOCAL))).expanduser().resolve()
BLOG_POSTS = BLOG_DIR / 'Posts'

IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'}

ACTION_ALIASES = {
    # Tạo bài mới
    'new': 'new', 'post': 'new', 'add': 'new', 'create': 'new', 'n': 'new',
    # Sửa bài
    'edit': 'edit', 'open': 'edit', 'e': 'edit',
    # Đăng bài (hỗ trợ cả gõ nhầm pulish)
    'publish': 'publish', 'pulish': 'publish', 'pub': 'publish', 'push': 'publish', 'p': 'publish',
    # Xóa / Gỡ bài
    'del': 'del', 'delete': 'del', 'rm': 'del', 'remove': 'del', 'unpublish': 'del', 'd': 'del',
    # Sắp xếp & Làm sạch kho bài viết Obsidian
    'sort': 'sort', 'clean': 'sort', 'organize': 'sort', 'tidy': 'sort', 's': 'sort',
    # Danh sách & trạng thái
    'list': 'list', 'ls': 'list', 'l': 'list', 'manage': 'manage', 'posts': 'manage',
    # Xem trước & khác
    'preview': 'preview', 'prev': 'preview', 'dev': 'preview', 'serve': 'preview',
    'image': 'image', 'img': 'image',
    'read': 'read',
    'sync': 'sync',
    'pages': 'pages',
    'publish-settings': 'publish-settings',
    'status': 'status', 'st': 'status',
    # Web Dashboard (Blog Studio)
    'studio': 'studio', 'ui': 'studio', 'web': 'studio', 'dashboard': 'studio', 'dash': 'studio',
}


@dataclass
class UnifiedPost:
    slug: str
    title: str
    obs_path: Path | None = None
    local_path: Path | None = None
    repo_path: Path | None = None
    is_published: bool = False
    category: str = ''
    pub_date: str = ''
    mtime: float = 0.0

    @property
    def primary_path(self) -> Path:
        return self.obs_path or self.local_path or self.repo_path

    @property
    def status_badge(self) -> str:
        return 'Đã đăng' if self.is_published else 'Nháp'

    @property
    def short_location(self) -> str:
        if self.obs_path:
            return self.obs_path.relative_to(VAULT_DIR).as_posix()
        if self.local_path:
            return self.local_path.parent.relative_to(BLOG_DIR).as_posix()
        if self.repo_path:
            return self.repo_path.relative_to(ROOT).as_posix()
        return self.slug


def ask_choice(prompt, choices):
    options = ', '.join(choices)
    while True:
        answer = input(f'{prompt} [{options}]: ').strip()
        if answer in choices:
            return answer
        print(f'Chọn một giá trị: {options}.')


def confirm(prompt, default=False):
    suffix = 'Y/n' if default else 'y/N'
    while True:
        answer = input(f'{prompt} [{suffix}]: ').strip().casefold()
        if not answer:
            return default
        if answer in {'y', 'yes', 'c', 'co'}:
            return True
        if answer in {'n', 'no', 'k', 'khong', 'không'}:
            return False
        print('Nhập y hoặc n.')


def run(*args, capture=False, timeout=None, check=True):
    return subprocess.run(list(map(str, args)), cwd=ROOT, check=check,
                          text=True, encoding='utf-8', capture_output=capture,
                          timeout=timeout)


def run_step(label, *args, timeout=None):
    print(label)
    started = time.perf_counter()
    try:
        return run(*args, timeout=timeout)
    finally:
        print(f'  ⏱️ {time.perf_counter() - started:.1f} giây.')


def git(*args, check=True):
    return run('git', *args, capture=True, check=check).stdout.strip()


def slugify(value: str) -> str:
    value = unicodedata.normalize('NFKD', value.lower().replace('đ', 'd'))
    value = value.encode('ascii', 'ignore').decode()
    value = re.sub(r'[^a-z0-9]+', '-', value).strip('-')
    if not value:
        raise ValueError('Tên cần có chữ cái hoặc chữ số.')
    return value


def safe(path: Path, base=ROOT) -> Path:
    path = path.resolve()
    if not path.is_relative_to(base.resolve()):
        raise ValueError('Đường dẫn nằm ngoài thư mục được phép.')
    return path


def parse_frontmatter(text: str) -> tuple[str, str]:
    match = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    if not match:
        return '', text
    return match.group(1), text[match.end():]


def extract_yaml_scalar(header: str, keys: list[str]) -> str:
    lines = header.splitlines()
    for key in keys:
        for line in lines:
            m = re.match(rf'^{re.escape(key)}[ \t]*:[ \t]*(.*)$', line)
            if m:
                val = m.group(1).strip()
                if val and not val.startswith('['):
                    cleaned = val.strip('"\'').strip()
                    if cleaned:
                        return cleaned
    return ''


def extract_yaml_list(header: str, keys: list[str]) -> list[str]:
    result = []
    lines = header.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        for key in keys:
            m = re.match(rf'^{re.escape(key)}[ \t]*:[ \t]*(.*)$', line)
            if m:
                rest = m.group(1).strip()
                if rest.startswith('[') and rest.endswith(']'):
                    inner = rest[1:-1].strip()
                    if inner:
                        for item in inner.split(','):
                            cleaned = item.strip().strip('"\'')
                            if cleaned:
                                result.append(cleaned)
                elif rest and rest != '[]':
                    result.append(rest.strip('"\''))
                else:
                    i += 1
                    while i < len(lines):
                        sub = re.match(r'^\s*-\s+(.+?)\s*$', lines[i])
                        if not sub:
                            i -= 1
                            break
                        cleaned = sub.group(1).strip().strip('"\'')
                        if cleaned:
                            result.append(cleaned)
                        i += 1
                break
        i += 1
    return result


def is_obsidian_blog_note(path: Path) -> bool:
    # Internal writing rules live beside posts but must never be published or sorted.
    if path.is_relative_to(VAULT_BLOG / 'luật'):
        return False
    if path.is_relative_to(VAULT_BLOG):
        return True
    try:
        text = path.read_text(encoding='utf-8-sig')
    except OSError:
        return False
    header, _ = parse_frontmatter(text)
    if not header:
        return False
    categories = extract_yaml_list(header, ['Danh mục', 'category', 'categories'])
    tags = extract_yaml_list(header, ['tags'])
    for c in categories:
        if 'Bài viết' in c or 'Blog' in c:
            return True
    for t in tags:
        if t.lower() in {'blog', 'bai-viet'}:
            return True
    return False


def obsidian_posts() -> list[Path]:
    found = []
    for folder in (VAULT_BLOG, VAULT_NOTES):
        if not folder.exists():
            continue
        for p in sorted(folder.rglob('*.md')):
            if p.is_file() and not p.is_symlink() and is_obsidian_blog_note(p):
                found.append(p)
    return found


def local_bundle_posts() -> list[Path]:
    if not BLOG_POSTS.exists():
        return []
    return sorted(
        p for p in BLOG_POSTS.rglob('index.md')
        if p.is_file() and not p.is_symlink()
    )


def repo_markdown_posts() -> list[Path]:
    posts_root = ROOT / 'content' / 'posts'
    if not posts_root.exists():
        return []
    return sorted(
        p for p in posts_root.rglob('*.md')
        if p.is_file() and not p.is_symlink() and not p.name.endswith('.en.md')
    )


def is_draft(text: str) -> bool:
    header, _ = parse_frontmatter(text)
    return bool(header and re.search(r'^draft:\s*true\s*$', header, re.M))


def title(path: Path) -> str:
    text = path.read_text(encoding='utf-8-sig')
    header, _ = parse_frontmatter(text)
    val = extract_yaml_scalar(header, ['title', 'Tiêu đề'])
    if val:
        return val
    return path.parent.name if path.name == 'index.md' else path.stem


def get_post_slug(path: Path) -> str:
    text = path.read_text(encoding='utf-8-sig')
    header, _ = parse_frontmatter(text)
    explicit = extract_yaml_scalar(header, ['Slug', 'slug'])
    if explicit:
        return slugify(explicit)
    if path.name == 'index.md':
        return slugify(path.parent.name)
    # Nếu là file phẳng trong content/posts/<slug>.md thì lấy đúng tên file làm slug chuẩn của Hugo
    if path.is_relative_to(ROOT / 'content' / 'posts'):
        return slugify(path.stem)
    return slugify(title(path))


def infer_category(title_str: str, slug_str: str, header: str) -> str:
    existing = extract_yaml_scalar(header, ['Chuyên mục', 'category'])
    if existing:
        return existing
    combined = (title_str + ' ' + slug_str).lower()
    if 'serein' in combined:
        return 'Serein Theme'
    if 'obsidian' in combined or 'hugo' in combined or 'github-pages' in combined:
        return 'Obsidian & Hugo'
    if 'test' in combined:
        return 'Thử nghiệm'
    return 'Công nghệ & Năng suất'


def collect_all_posts(writable_first: bool = True) -> list[UnifiedPost]:
    by_slug: dict[str, UnifiedPost] = {}

    for p in obsidian_posts():
        s = get_post_slug(p)
        st = p.stat().st_mtime
        h, _ = parse_frontmatter(p.read_text(encoding='utf-8-sig'))
        cat = infer_category(title(p), s, h)
        pdate = extract_yaml_scalar(h, ['Ngày xuất bản', 'Ngày tạo', 'date'])[:10]
        by_slug[s] = UnifiedPost(
            slug=s, title=title(p), obs_path=p, category=cat, pub_date=pdate, mtime=st
        )

    for p in local_bundle_posts():
        s = get_post_slug(p)
        st = p.stat().st_mtime
        if s in by_slug:
            by_slug[s].local_path = p
            by_slug[s].mtime = max(by_slug[s].mtime, st)
        else:
            by_slug[s] = UnifiedPost(slug=s, title=title(p), local_path=p, mtime=st)

    for p in repo_markdown_posts():
        s = get_post_slug(p)
        st = p.stat().st_mtime
        raw = p.read_text(encoding='utf-8-sig')
        h, _ = parse_frontmatter(raw)
        published = not is_draft(raw)
        pdate = extract_yaml_scalar(h, ['date'])[:10]
        cat = infer_category(title(p), s, h)
        if s in by_slug:
            by_slug[s].repo_path = p
            by_slug[s].is_published = published
            if pdate and not by_slug[s].pub_date:
                by_slug[s].pub_date = pdate
        else:
            by_slug[s] = UnifiedPost(
                slug=s, title=title(p), repo_path=p, is_published=published,
                category=cat, pub_date=pdate, mtime=st
            )

    items = list(by_slug.values())
    if writable_first:
        # Ưu tiên: Bài nháp chưa đăng lên đầu -> Ngày xuất bản mới nhất -> Sửa gần nhất
        items.sort(key=lambda x: (x.is_published, x.obs_path is None, x.pub_date or '0000', x.mtime), reverse=False)
        # Tinh chỉnh lại thứ tự: Nháp trước, trong Nháp thì mới nhất trước; Đã đăng sau, trong Đã đăng thì mới nhất trước
        drafts = [it for it in items if not it.is_published]
        drafts.sort(key=lambda x: (-x.mtime, x.title.lower()))
        published = [it for it in items if it.is_published]
        published.sort(key=lambda x: (x.pub_date or '0000-00-00', x.mtime), reverse=True)
        return drafts + published
    else:
        items.sort(key=lambda x: (x.pub_date or '0000-00-00', x.mtime), reverse=True)
    return items


def select_posts_interactive(
    items: list[UnifiedPost],
    prompt_label: str,
    query: str | None = None,
    multi: bool = False,
) -> list[UnifiedPost]:
    if not items:
        raise ValueError('Chưa có bài viết nào. Gõ `blog new "Tiêu đề"` để tạo mới.')

    if query:
        q = query.casefold().strip()
        exact = [
            it for it in items
            if q in {it.title.casefold(), it.slug.casefold()}
            or (it.obs_path and q == it.obs_path.stem.casefold())
        ]
        if len(exact) == 1:
            return exact
        partial = [
            it for it in items
            if q in it.title.casefold() or q in it.slug.casefold()
        ]
        if len(partial) == 1:
            return partial
        if partial:
            items = partial
        else:
            raise ValueError(f'Không tìm thấy bài viết nào khớp với "{query}".')

    print(f'\n{prompt_label}')
    for idx, it in enumerate(items, 1):
        date_part = f' · {it.pub_date}' if it.pub_date else ''
        print(f'  {idx}. [{it.status_badge}] {it.title}{date_part}')

    hint = 'Chọn (vd: 1 hoặc 1,2 · 0 hủy): ' if multi else 'Chọn (0 hủy): '
    while True:
        raw = input(hint).strip()
        if raw in {'0', 'q', 'quit', 'exit', ''}:
            return []
        parts = [p.strip() for p in raw.split(',') if p.strip()] if multi else [raw]
        chosen: list[UnifiedPost] = []
        valid = True
        for part in parts:
            if not part.isdigit() or not (1 <= int(part) <= len(items)):
                valid = False
                break
            item = items[int(part) - 1]
            if item not in chosen:
                chosen.append(item)
        if valid and chosen:
            return chosen
        print(f'Nhập số từ 1 đến {len(items)} (hoặc 0).')


def open_in_obsidian(path: Path):
    rel = path.relative_to(VAULT_DIR).as_posix()
    uri = f'obsidian://open?vault=Brain2nd&file={urllib.parse.quote(rel)}'
    print(f'📓 Đang mở trong Obsidian: {path}')
    webbrowser.open(uri)


def open_in_vscode(path: Path):
    command = shutil.which('code') or shutil.which('Code.exe')
    if os.name == 'nt':
        for variable in ('LOCALAPPDATA', 'ProgramFiles', 'ProgramFiles(x86)'):
            root = os.environ.get(variable)
            if root:
                cand = Path(root) / 'Programs' / 'Microsoft VS Code' / 'Code.exe'
                if cand.is_file():
                    command = str(cand)
                    break
                cand2 = Path(root) / 'Microsoft VS Code' / 'Code.exe'
                if cand2.is_file():
                    command = str(cand2)
                    break
    if not command:
        raise ValueError('Không tìm thấy VS Code.')
    print(f'🖥️ Đang mở trong VS Code: {path}')
    subprocess.Popen([command, str(path)])


def clean_wikilink(value: str) -> str:
    m = re.match(r'^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$', value.strip())
    if m:
        return (m.group(2) or m.group(1)).strip()
    return value.strip()


def normalize_obsidian_post_file(
    note_path: Path,
    slug: str,
    post_title: str,
    is_published: bool,
    target_dir: Path = VAULT_BLOG,
) -> Path:
    """Chuẩn hóa thứ tự thuộc tính YAML tiếng Việt và chuyển bài viết về đúng thư mục Bài viết/."""
    target_dir.mkdir(parents=True, exist_ok=True)
    text = note_path.read_text(encoding='utf-8-sig')
    header, body = parse_frontmatter(text)

    category = infer_category(post_title, slug, header)
    pinned_raw = extract_yaml_scalar(header, ['Ghim', 'pinned']).lower()
    pinned = 'true' if pinned_raw == 'true' else 'false'
    lang = extract_yaml_scalar(header, ['Ngôn ngữ', 'lang']) or 'vi'
    desc = extract_yaml_scalar(header, ['Mô tả', 'description'])

    raw_created = extract_yaml_scalar(header, ['Ngày tạo', 'date'])[:10]
    created_date = raw_created if re.match(r'^\d{4}-\d{2}-\d{2}', raw_created) else dt.date.today().isoformat()

    raw_pub = extract_yaml_scalar(header, ['Ngày xuất bản', 'date'])[:10]
    pub_date = raw_pub if (is_published and re.match(r'^\d{4}-\d{2}-\d{2}', raw_pub)) else (created_date if is_published else '')

    status_str = 'Đã đăng' if is_published else (extract_yaml_scalar(header, ['Trạng thái']) or 'Nháp')
    if not is_published and status_str == 'Đã đăng':
        status_str = 'Nháp'

    url_str = f'https://cmduyeen.github.io/posts/{slug}/' if is_published else ''

    topics = [clean_wikilink(t) for t in extract_yaml_list(header, ['Chủ đề']) if clean_wikilink(t)]
    raw_tags = [clean_wikilink(t) for t in extract_yaml_list(header, ['tags']) if clean_wikilink(t)]
    if not topics and raw_tags:
        topics = [t for t in raw_tags if t.lower() not in {'blog', 'bai-viet'}][:4]

    tags = ['blog']
    for t in raw_tags:
        slug_t = slugify(t)
        if slug_t and slug_t not in tags:
            tags.append(slug_t)

    topics_yaml = '\n'.join(f'  - "{t}"' for t in topics) if topics else ' []'
    if topics:
        topics_block = f'Chủ đề:\n{topics_yaml}'
    else:
        topics_block = 'Chủ đề: []'

    tags_yaml = '\n'.join(f'  - {t}' for t in tags)

    new_fm = f"""---
Danh mục:
  - "[[Bài viết]]"
Chuyên mục: {json.dumps(category, ensure_ascii=False)}
Trạng thái: {status_str}
Ghim: {pinned}
Ngôn ngữ: {lang}
Tác giả:
  - "[[Dyn]]"
{topics_block}
Mô tả: {json.dumps(desc, ensure_ascii=False)}
Slug: {json.dumps(slug, ensure_ascii=False)}
Ngày tạo: {created_date}
Ngày xuất bản: {pub_date}
Đường dẫn: {json.dumps(url_str, ensure_ascii=False)}
tags:
{tags_yaml}
---"""

    safe_name = re.sub(r'[<>:"/\\|?*]', ' -', post_title).strip()
    dest_path = target_dir / f'{safe_name}.md'

    final_content = new_fm + '\n\n' + body.lstrip()
    dest_path.write_text(final_content, encoding='utf-8')
    if note_path.resolve() != dest_path.resolve() and note_path.exists():
        note_path.unlink()
    return dest_path


def import_repo_post_to_obsidian(item: UnifiedPost) -> Path:
    """Đồng bộ bài viết từ Hugo Repo về D:\\Brain2nd\\Bài viết\\ và chuẩn hóa YAML."""
    if item.obs_path and item.obs_path.exists():
        return normalize_obsidian_post_file(
            item.obs_path, item.slug, item.title, item.is_published, VAULT_BLOG
        )
    src = item.local_path or item.repo_path
    if not src or not src.exists():
        raise ValueError('Không tìm thấy file nguồn của bài viết.')

    if src.name == 'index.md':
        VAULT_ATTACHMENTS.mkdir(parents=True, exist_ok=True)
        for asset in src.parent.iterdir():
            if asset.is_file() and asset.suffix.lower() in IMAGE_EXTS:
                dest_img = VAULT_ATTACHMENTS / asset.name
                if not dest_img.exists():
                    shutil.copy2(asset, dest_img)

    VAULT_BLOG.mkdir(parents=True, exist_ok=True)
    safe_name = re.sub(r'[<>:"/\\|?*]', ' -', item.title).strip()
    temp_obs = VAULT_BLOG / f'{safe_name}.md'
    shutil.copy2(src, temp_obs)
    normalized = normalize_obsidian_post_file(
        temp_obs, item.slug, item.title, item.is_published, VAULT_BLOG
    )
    item.obs_path = normalized
    return normalized


def sort_and_clean_obsidian_blog():
    """Gom toàn bộ bài viết Blog về D:\\Brain2nd\\Bài viết\\, đồng bộ bài từ Web và chuẩn hóa YAML."""
    VAULT_BLOG.mkdir(parents=True, exist_ok=True)
    items = collect_all_posts(writable_first=False)
    moved_count = 0
    imported_count = 0
    normalized_count = 0

    for item in items:
        if item.obs_path and item.obs_path.exists():
            was_outside = not item.obs_path.is_relative_to(VAULT_BLOG)
            new_path = normalize_obsidian_post_file(
                item.obs_path, item.slug, item.title, item.is_published, VAULT_BLOG
            )
            item.obs_path = new_path
            if was_outside:
                moved_count += 1
            normalized_count += 1
        elif item.repo_path and item.repo_path.exists():
            import_repo_post_to_obsidian(item)
            imported_count += 1
            normalized_count += 1

    print('\n✨ ĐÃ SẮP XẾP & CHUẨN HÓA KHO BÀI VIẾT OBSIDIAN (`D:\\Brain2nd\\Bài viết`):')
    print(f'   • Thư mục lưu trữ riêng : {VAULT_BLOG}')
    print(f'   • Đã chuyển từ Ghi chú/ : {moved_count} bài')
    print(f'   • Đã đồng bộ từ Web về  : {imported_count} bài')
    print(f'   • Tổng số bài chuẩn hóa : {normalized_count} bài')
    listing()


def create_new_post(name: str, use_vscode: bool = False) -> Path:
    name = name.strip()
    if not name:
        raise ValueError('Cần nhập tiêu đề bài viết.')
    VAULT_BLOG.mkdir(parents=True, exist_ok=True)
    slug = slugify(name)
    safe_filename = re.sub(r'[<>:"/\\|?*]', '-', name).strip()
    path = VAULT_BLOG / f'{safe_filename}.md'
    if path.exists():
        print(f'ℹ️ Bài viết đã tồn tại, đang mở file: {path}')
        if use_vscode:
            open_in_vscode(path)
        else:
            open_in_obsidian(path)
        return path

    today = dt.date.today().isoformat()
    category = infer_category(name, slug, '')
    text = f"""---
Danh mục:
  - "[[Bài viết]]"
Chuyên mục: {json.dumps(category, ensure_ascii=False)}
Trạng thái: Nháp
Ghim: false
Ngôn ngữ: vi
Tác giả:
  - "[[Dyn]]"
Chủ đề: []
Mô tả: ""
Slug: "{slug}"
Ngày tạo: {today}
Ngày xuất bản:
Đường dẫn: ""
tags:
  - blog
---

"""
    path.write_text(text, encoding='utf-8')
    print(f'✨ Đã tạo bài viết mới tại: {path}')
    print('💡 Viết xong trong Obsidian, gõ `blog publish` để đăng lên web!')
    if use_vscode:
        open_in_vscode(path)
    else:
        open_in_obsidian(path)
    return path


def edit_post_action(query: str | None = None, use_vscode: bool = False):
    items = collect_all_posts(writable_first=True)
    selected = select_posts_interactive(items, 'Chọn bài viết muốn sửa (blog edit)', query=query, multi=False)
    if not selected:
        return
    item = selected[0]
    obs_file = import_repo_post_to_obsidian(item)
    if use_vscode:
        open_in_vscode(obs_file)
    else:
        open_in_obsidian(obs_file)


def convert_obsidian_to_hugo(note_path: Path, dest_bundle: Path, draft_override: bool | None = False) -> Path:
    dest_bundle.mkdir(parents=True, exist_ok=True)
    text = note_path.read_text(encoding='utf-8-sig')
    header, body = parse_frontmatter(text)
    if not header:
        raise ValueError(f'Ghi chú {note_path.name} cần có YAML properties (---) ở đầu file.')

    post_title = title(note_path)
    slug = get_post_slug(note_path)
    raw_date = clean_wikilink(extract_yaml_scalar(header, ['Ngày xuất bản', 'Ngày tạo', 'date']))
    date_match = re.search(r'(\d{4}-\d{2}-\d{2})', raw_date)
    pub_date = date_match.group(1) if date_match else dt.date.today().isoformat()
    desc = extract_yaml_scalar(header, ['Mô tả', 'description'])
    category = extract_yaml_scalar(header, ['Chuyên mục', 'category'])
    series_val = extract_yaml_scalar(header, ['Series', 'series'])
    raw_topics = extract_yaml_list(header, ['Chủ đề', 'tags'])
    clean_tags = []
    for t in raw_topics:
        cleaned = clean_wikilink(t)
        if cleaned and cleaned.lower() not in {'blog', 'bai-viet', 'bài viết'} and cleaned not in clean_tags:
            clean_tags.append(cleaned)

    status_val = extract_yaml_scalar(header, ['Trạng thái', 'status']).lower()
    if draft_override is not None:
        is_draft_val = draft_override
    else:
        is_draft_val = status_val in {'nháp', 'nhap', 'draft'}

    def resolve_attachment(img_ref: str) -> Path | None:
        decoded = urllib.parse.unquote(img_ref).strip()
        name_only = Path(decoded).name
        candidates = [
            note_path.parent / decoded,
            VAULT_DIR / decoded,
            VAULT_ATTACHMENTS / name_only,
            VAULT_DIR / name_only,
        ]
        for cand in candidates:
            if cand.is_file() and cand.suffix.lower() in IMAGE_EXTS:
                return cand
        return None

    def replace_wiki_embed(match: re.Match) -> str:
        inner = match.group(1)
        parts = inner.split('|', 1)
        target_ref = parts[0].strip()
        alt = parts[1].strip() if len(parts) > 1 else Path(target_ref).stem
        src_img = resolve_attachment(target_ref)
        if src_img:
            safe_img_name = slugify(src_img.stem) + src_img.suffix.lower()
            shutil.copy2(src_img, dest_bundle / safe_img_name)
            return f'![{alt}]({safe_img_name})'
        return match.group(0)

    body = re.sub(r'!\[\[([^\]]+)\]\]', replace_wiki_embed, body)

    def replace_md_image(match: re.Match) -> str:
        alt = match.group(1)
        url = match.group(2).strip()
        if url.startswith(('http://', 'https://', '/')):
            return match.group(0)
        src_img = resolve_attachment(url)
        if src_img:
            safe_img_name = slugify(src_img.stem) + src_img.suffix.lower()
            shutil.copy2(src_img, dest_bundle / safe_img_name)
            return f'![{alt}]({safe_img_name})'
        return match.group(0)

    body = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace_md_image, body)
    body = re.sub(r'\[\[([^\]|]+)\|([^\]]+)\]\]', r'\2', body)
    body = re.sub(r'\[\[([^\]]+)\]\]', r'\1', body)

    body_stripped = body.lstrip()
    h1_match = re.match(r'^#\s+(.+?)\r?\n+', body_stripped)
    if h1_match and h1_match.group(1).strip().casefold() == post_title.strip().casefold():
        body = body_stripped[h1_match.end():]

    hugo_fm_lines = [
        '---',
        f'title: {json.dumps(post_title, ensure_ascii=False)}',
        f'date: {json.dumps(pub_date, ensure_ascii=False)}',
        'author: "Dyn"',
        f'slug: {json.dumps(slug, ensure_ascii=False)}',
    ]
    if category:
        hugo_fm_lines.append(f'category: {json.dumps(category, ensure_ascii=False)}')
    if series_val:
        hugo_fm_lines.append(f'series: {json.dumps(series_val, ensure_ascii=False)}')
    if desc:
        hugo_fm_lines.append(f'description: {json.dumps(desc, ensure_ascii=False)}')
    if clean_tags:
        hugo_fm_lines.append(f'tags: {json.dumps(clean_tags, ensure_ascii=False)}')
    else:
        hugo_fm_lines.append('tags: []')
    hugo_fm_lines.append(f'draft: {"true" if is_draft_val else "false"}')
    hugo_fm_lines.append('---')

    lang = extract_yaml_scalar(header, ['Ngôn ngữ', 'lang']).lower()
    out_name = 'index.en.md' if lang == 'en' else 'index.md'
    out_path = dest_bundle / out_name
    out_path.write_text('\n'.join(hugo_fm_lines) + '\n\n' + body.lstrip(), encoding='utf-8')
    return out_path


def prepare_git_clean_index():
    if git('branch', '--show-current') != 'main':
        raise ValueError('Repo Hugo cần ở nhánh main.')
    git('reset', check=False)
    run_step('🔄 Đang đồng bộ trạng thái với GitHub...', 'git', 'fetch', 'origin', 'main')
    behind = int(git('rev-list', '--count', 'HEAD..origin/main') or '0')
    if behind > 0:
        run_step(f'⬇️ Đang kéo {behind} cập nhật mới từ GitHub...', 'git', 'pull', '--rebase', '--autostash', 'origin', 'main')


def publish_action(query: str | None = None):
    all_items = [it for it in collect_all_posts(writable_first=True) if it.obs_path or it.local_path]
    selected = select_posts_interactive(all_items, 'Chọn bài viết để ĐĂNG LÊN WEB (blog publish)', query=query, multi=False)
    if not selected:
        return
    item = selected[0]
    src_path = item.obs_path or item.local_path
    is_from_obsidian = item.obs_path is not None

    print(f'\n🚀 Chuẩn bị xuất bản: {item.title}')
    print(f'   • Nguồn       : {src_path}')
    print(f'   • URL đích    : https://cmduyeen.github.io/posts/{item.slug}/')
    if not confirm('Xác nhận đăng bài này lên GitHub Pages?', default=True):
        print('Đã hủy.')
        return

    prepare_git_clean_index()

    posts_dir = ROOT / 'content' / 'posts'
    posts_dir.mkdir(parents=True, exist_ok=True)
    target_bundle = posts_dir / item.slug
    old_flat = posts_dir / f'{item.slug}.md'

    with tempfile.TemporaryDirectory(prefix='.blog-publish-', dir=posts_dir) as tmp:
        staged = Path(tmp) / 'staged'
        backup = Path(tmp) / 'backup'
        had_target = target_bundle.exists()
        if had_target:
            shutil.copytree(target_bundle, backup)
        try:
            if is_from_obsidian:
                convert_obsidian_to_hugo(src_path, staged, draft_override=False)
            else:
                shutil.copytree(src_path.parent, staged)
                (staged / src_path.name).write_text(published_text(src_path), encoding='utf-8')

            if target_bundle.exists():
                shutil.rmtree(target_bundle)
            os.replace(staged, target_bundle)

            if old_flat.exists():
                old_flat.unlink()

            with site_snapshot() as (source, destination):
                run_step('🔨 Đang kiểm tra build Hugo...', 'hugo', '--source', source, '--gc', '--minify', '--destination', destination)
        except BaseException:
            if target_bundle.exists():
                shutil.rmtree(target_bundle)
            if had_target and backup.exists():
                shutil.copytree(backup, target_bundle)
            raise

    paths_to_stage = [target_bundle.relative_to(ROOT).as_posix()]
    git('add', '--all', '--', *paths_to_stage)
    assert_repo_staged_safe(ROOT)

    staged_files = git('diff', '--cached', '--name-only')
    if not staged_files and git('rev-list', '--count', 'origin/main..HEAD') == '0':
        print('✨ Nội dung bài viết trên web đã ở bản mới nhất!')
        if is_from_obsidian:
            item.obs_path = normalize_obsidian_post_file(item.obs_path, item.slug, item.title, True, VAULT_BLOG)
        return

    if staged_files:
        msg = ('Update: ' if item.is_published else 'Publish: ') + item.title
        run_step('📦 Đang đóng gói commit...', 'git', 'commit', '-m', msg)

    run_step('☁️ Đang đẩy lên GitHub Pages...', 'git', 'push', 'origin', 'main')

    if is_from_obsidian:
        item.obs_path = normalize_obsidian_post_file(item.obs_path, item.slug, item.title, True, VAULT_BLOG)

    print(f'\n✅ ĐÃ ĐĂNG THÀNH CÔNG: {item.title}')
    print(f'🌐 Link bài viết: https://cmduyeen.github.io/posts/{item.slug}/')


def delete_action(query: str | None = None):
    all_items = collect_all_posts(writable_first=True)
    selected = select_posts_interactive(
        all_items,
        'Chọn bài viết muốn XÓA / GỠ KHỎI WEB (blog del)',
        query=query,
        multi=True,
    )
    if not selected:
        return

    need_web_unpublish: list[UnifiedPost] = []
    need_local_delete: list[UnifiedPost] = []

    for item in selected:
        has_obs = bool(item.obs_path and item.obs_path.exists())
        has_legacy_local = bool(item.local_path and item.local_path.exists())
        has_web = bool(item.repo_path and item.repo_path.exists())

        if has_obs and has_web:
            print(f'\n🗑️ Bài viết "{item.title}" đang có cả trong Obsidian lẫn trên Website:')
            print('  [1] Xóa hoàn toàn (Gỡ khỏi Website + Xóa luôn file trong Obsidian)')
            print('  [2] Chỉ gỡ khỏi Website (Giữ lại bài viết trong Obsidian làm bản Nháp)')
            print('  [3] Chỉ xóa file trong Obsidian (Giữ nguyên bài trên Website)')
            print('  [0] Bỏ qua bài này')
            ch = ask_choice('Chọn cách xóa', ['0', '1', '2', '3'])
            if ch == '1':
                need_web_unpublish.append(item)
                need_local_delete.append(item)
            elif ch == '2':
                need_web_unpublish.append(item)
            elif ch == '3':
                need_local_delete.append(item)
        elif has_web:
            if confirm(f'🌐 Xóa hoàn toàn bài "{item.title}" khỏi Website GitHub Pages?', default=True):
                need_web_unpublish.append(item)
                if has_legacy_local:
                    need_local_delete.append(item)
        elif has_obs or has_legacy_local:
            if confirm(f'📝 Xóa bản nháp "{item.title}" khỏi máy ({item.short_location})?', default=True):
                need_local_delete.append(item)

    if need_web_unpublish:
        prepare_git_clean_index()
        removed_rels = []
        titles_removed = []
        for item in need_web_unpublish:
            rp = item.repo_path
            if rp and rp.exists():
                target_to_rm = rp.parent if rp.name == 'index.md' else rp
                rel = target_to_rm.relative_to(ROOT).as_posix()
                if target_to_rm.is_dir():
                    shutil.rmtree(target_to_rm)
                else:
                    target_to_rm.unlink()
                removed_rels.append(rel)
                titles_removed.append(item.title)
                en_twin = rp.with_name(rp.stem + '.en.md')
                if en_twin.exists():
                    en_rel = en_twin.relative_to(ROOT).as_posix()
                    en_twin.unlink()
                    removed_rels.append(en_rel)
            if item.local_path and item.local_path.exists():
                shutil.rmtree(item.local_path.parent, ignore_errors=True)
            if item not in need_local_delete and item.obs_path and item.obs_path.exists():
                normalize_obsidian_post_file(item.obs_path, item.slug, item.title, False, VAULT_BLOG)

        if removed_rels:
            try:
                with site_snapshot() as (source, destination):
                    run_step('🔨 Đang kiểm tra build Hugo sau khi gỡ bài...', 'hugo', '--source', source, '--gc', '--minify', '--destination', destination)
                git('add', '--all', '--', *removed_rels)
                if git('diff', '--cached', '--name-only'):
                    msg = 'Unpublish: ' + ', '.join(titles_removed)
                    run_step('📦 Đang tạo commit gỡ bài...', 'git', 'commit', '-m', msg)
                    run_step('☁️ Đang cập nhật lên GitHub Pages...', 'git', 'push', 'origin', 'main')
                    print(f'✅ Đã gỡ khỏi Website: {", ".join(titles_removed)}')
            except BaseException:
                git('reset', '--', *removed_rels, check=False)
                git('checkout', '--', *removed_rels, check=False)
                raise

    for item in need_local_delete:
        if item.obs_path and item.obs_path.exists():
            item.obs_path.unlink()
            print(f'🗑️ Đã xóa file trong Obsidian: {item.obs_path.name}')
        if item.local_path and item.local_path.exists():
            shutil.rmtree(item.local_path.parent, ignore_errors=True)
            print(f'🗑️ Đã xóa thư mục nháp: {item.local_path.parent.name}')


def published_text(path: Path) -> str:
    text = path.read_text(encoding='utf-8-sig')
    front = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    if not front:
        raise ValueError('Bài cần YAML front matter bắt đầu bằng ---.')
    header = re.sub(r'^draft\s*:.*$', 'draft: false', front[1], flags=re.M)
    if not re.search(r'^draft\s*:', header, re.M):
        header += '\ndraft: false'
    return '---\n' + header + '\n---\n' + text[front.end():]


def listing():
    items = collect_all_posts(writable_first=True)
    print('\nBLOG · Danh sách bài viết')
    if not items:
        print('  Chưa có bài viết.')
        return []
    for idx, it in enumerate(items, 1):
        date_str = f' · {it.pub_date}' if it.pub_date else ''
        cat_str = f' · {it.category}' if it.category else ''
        print(f'  {idx:2d}. [{it.status_badge}] {it.title}{cat_str}{date_str}')
    print('')
    return items


@contextmanager
def site_snapshot(drafts=False):
    with tempfile.TemporaryDirectory(prefix='blog-preview-') as tmp:
        source = Path(tmp) / 'source'
        shutil.copytree(ROOT, source, ignore=shutil.ignore_patterns(
            '.git', '.blog-local', 'public', 'resources',
            '.hugo_build.lock', '__pycache__', 'node_modules',
            '.blog-publish-*', '.blog-unpublish-*'))
        if drafts:
            for obs_note in obsidian_posts():
                slug = get_post_slug(obs_note)
                bundle_dest = source / 'content' / 'posts' / slug
                convert_obsidian_to_hugo(obs_note, bundle_dest, draft_override=True)
        yield source, Path(tmp) / 'public'


def preview():
    with site_snapshot(drafts=True) as (source, destination):
        print('👀 Xem trước Blog (gồm cả bài Nháp trong Obsidian): http://127.0.0.1:1313 · Bấm Ctrl+C để dừng')
        webbrowser.open('http://127.0.0.1:1313')
        try:
            run('hugo', 'server', '--bind', '127.0.0.1', '--buildDrafts',
                '--source', source, '--destination', destination, '--disableFastRender')
        except KeyboardInterrupt:
            pass


def add_image_action(query: str | None = None):
    items = [it for it in collect_all_posts(writable_first=True) if it.obs_path]
    selected = select_posts_interactive(items, 'Chọn bài viết trong Obsidian để chèn ảnh', query=query, multi=False)
    if not selected:
        return
    note_path = selected[0].obs_path
    source = Path(input('Đường dẫn file ảnh cần thêm: ').strip().strip('"')).expanduser().resolve()
    if not source.is_file() or source.suffix.lower() not in IMAGE_EXTS:
        raise ValueError('Hãy chọn một file ảnh hợp lệ (.png, .jpg, .webp, .gif, .svg).')
    VAULT_ATTACHMENTS.mkdir(parents=True, exist_ok=True)
    name = slugify(source.stem) + source.suffix.lower()
    dest = VAULT_ATTACHMENTS / name
    shutil.copy2(source, dest)
    with note_path.open('a', encoding='utf-8') as handle:
        handle.write(f'\n![[{name}]]\n')
    print(f'✅ Đã lưu ảnh vào {dest} và chèn ![[{name}]] vào bài viết.')


def sync():
    prepare_git_clean_index()
    ahead = int(git('rev-list', '--count', 'origin/main..HEAD') or '0')
    if ahead > 0:
        if confirm(f'Máy đang có {ahead} commit chưa đẩy lên GitHub. Push ngay?', default=True):
            run_step('☁️ Đang đẩy lên GitHub...', 'git', 'push', 'origin', 'main')
    sort_and_clean_obsidian_blog()


def status_action():
    items = collect_all_posts()
    obs_count = sum(1 for it in items if it.obs_path)
    pub_count = sum(1 for it in items if it.is_published)
    draft_count = sum(1 for it in items if not it.is_published)
    print(f'📊 Tổng số bài: {len(items)}  (🌐 Đã đăng: {pub_count} · 📝 Bản nháp: {draft_count} · 📓 Có trong Obsidian: {obs_count})')
    print(f'📂 Thư mục bài viết Obsidian: {VAULT_BLOG}')


def hugo_dashboard():
    while True:
        print('\nBLOG · [Kênh 1] Hugo Cá nhân (cmduyeen.github.io)')
        print('1 New   2 Edit   3 Publish   4 Del   5 Sort   6 Preview   7 List   8 Web   9 Đổi sang Blogger Aff   0 Thoát')
        choice = ask_choice('Chọn', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
        if choice == '0':
            return
        if choice == '9':
            run_blogger_channel_cli()
            return
        try:
            if choice == '1':
                t = input('Tiêu đề: ').strip()
                if t:
                    create_new_post(t)
            elif choice == '2':
                edit_post_action()
            elif choice == '3':
                publish_action()
            elif choice == '4':
                delete_action()
            elif choice == '5':
                sort_and_clean_obsidian_blog()
            elif choice == '6':
                preview()
            elif choice == '7':
                listing()
            elif choice == '8':
                webbrowser.open('https://cmduyeen.github.io/')
        except (ValueError, OSError, subprocess.CalledProcessError) as error:
            print('Lỗi: ' + str(error))


def interactive_dashboard():
    print('\nBLOG · Chọn kênh quản lý')
    print('1 Hugo Cá nhân (cmduyeen.github.io)   2 Blogger Affiliate (Multi-Blog)   0 Thoát')
    ch = input('Chọn kênh [Enter=1]: ').strip() or '1'
    if ch == '1':
        hugo_dashboard()
    elif ch == '2':
        run_blogger_channel_cli()


def main():
    parser = argparse.ArgumentParser(
        description='Quản lý Blog (Kênh 1: Hugo cmduyeen.github.io · Kênh 2: Blogger Affiliate)'
    )
    parser.add_argument('action', nargs='?', help='hugo | aff (blogger) | new | edit | publish | del | sort | list | preview')
    parser.add_argument('title', nargs='*', help='Tiêu đề, lệnh con của kênh hoặc từ khóa tìm bài viết')
    parser.add_argument('--code', action='store_true', help='Mở bài viết bằng VS Code thay vì Obsidian')
    parser.add_argument('--dry-run', action='store_true', help='Kiểm tra an toàn trước khi đăng')
    args = parser.parse_args()

    if not args.action:
        interactive_dashboard()
        return

    raw_action = args.action.lower().strip()

    # Nếu chọn trực tiếp kênh Blogger Affiliate (`blog aff ...` hoặc `blog blogger ...`)
    if raw_action in {'aff', 'blogger', 'blogspot', '2'}:
        sub_act = args.title[0] if args.title else None
        sub_query = ' '.join(args.title[1:]).strip() if len(args.title) > 1 else None
        run_blogger_channel_cli(
            action=sub_act,
            query=sub_query,
            dry_run=args.dry_run,
            use_vscode=args.code,
        )
        return

    # Nếu chọn trực tiếp kênh Hugo (`blog hugo ...` hoặc `blog 1`)
    if raw_action in {'hugo', '1'}:
        if not args.title:
            hugo_dashboard()
            return
        raw_action = args.title[0].lower().strip()
        args.title = args.title[1:]

    action = ACTION_ALIASES.get(raw_action)
    query_str = ' '.join(args.title).strip() if args.title else None

    if not action:
        raise ValueError(
            f'Lệnh "{args.action}" không hợp lệ. Các lệnh hỗ trợ: '
            'blog new, blog edit, blog publish, blog del, blog sort, blog list, blog preview.'
        )

    if action == 'new':
        title_input = query_str or input('Nhập tiêu đề bài viết mới: ').strip()
        create_new_post(title_input, use_vscode=args.code)
    elif action == 'edit':
        edit_post_action(query=query_str, use_vscode=args.code)
    elif action == 'publish':
        publish_action(query=query_str)
    elif action == 'del':
        delete_action(query=query_str)
    elif action == 'sort':
        sort_and_clean_obsidian_blog()
    elif action in {'list', 'manage'}:
        listing()
    elif action == 'preview':
        preview()
    elif action == 'image':
        add_image_action(query=query_str)
    elif action == 'sync':
        sync()
    elif action == 'status':
        status_action()
    elif action == 'studio':
        studio_dir = Path(r'D:\Brain2nd\Code\my-tools\blog-studio')
        if str(studio_dir) not in sys.path:
            sys.path.insert(0, str(studio_dir))
        from server import serve
        serve()
    elif action == 'pages':
        open_in_vscode(ROOT / 'hugo.toml')
    elif action == 'publish-settings':
        prepare_git_clean_index()
        git('add', '--', 'hugo.toml')
        if git('diff', '--cached', '--name-only'):
            git('commit', '-m', 'Update blog settings')
            git('push', 'origin', 'main')
            print('✅ Đã cập nhật cấu hình hugo.toml lên GitHub.')
        else:
            print('Không có thay đổi trong hugo.toml.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print('❌ Lỗi: ' + str(error))
        sys.exit(1)
    except (KeyboardInterrupt, EOFError):
        print('\nĐã dừng.')
