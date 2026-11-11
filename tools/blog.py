"""Manage Hugo posts written as Markdown in a dedicated folder."""
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
import webbrowser

for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, 'reconfigure'):
        stream.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent
LOCAL = ROOT / '.blog-local'
BLOG_DIR = Path(os.environ.get(
    'DYN_BLOG_DIR', str(ROOT / '.blog-local'))).expanduser().resolve()
BLOG_POSTS = BLOG_DIR / 'Posts'


@dataclass(frozen=True)
class ManagedPost:
    path: Path
    source: str
    status: str


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


def run(*args, capture=False, timeout=None):
    return subprocess.run(list(map(str, args)), cwd=ROOT, check=True,
                          text=True, encoding='utf-8', capture_output=capture,
                          timeout=timeout)


def run_step(label, *args, timeout=None):
    print(label)
    started = time.perf_counter()
    try:
        return run(*args, timeout=timeout)
    finally:
        print(f'  Thời gian bước: {time.perf_counter() - started:.1f} giây.')


def git(*args):
    return run('git', *args, capture=True).stdout.strip()


def slugify(value):
    value = unicodedata.normalize('NFKD', value.lower().replace('đ', 'd'))
    value = value.encode('ascii', 'ignore').decode()
    value = re.sub(r'[^a-z0-9]+', '-', value).strip('-')
    if not value:
        raise ValueError('Tên cần có chữ hoặc số.')
    return value


def safe(path, base=ROOT):
    path = path.resolve()
    if not path.is_relative_to(base.resolve()):
        raise ValueError('Đường dẫn nằm ngoài thư mục được phép.')
    return path


def posts():
    if not BLOG_POSTS.exists():
        return []
    return sorted(path for path in BLOG_POSTS.rglob('index.md')
                  if path.is_file() and not path.is_symlink())


def is_draft(text):
    match = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    return bool(match and re.search(r'^draft:\s*true\s*$', match[1], re.M))


def title(path):
    text = path.read_text(encoding='utf-8-sig')
    found = re.search(r'^title:\s*(.+)$', text, re.M)
    return found[1].strip('"\'') if found else path.stem


def post_target(path):
    path = safe(path, BLOG_POSTS)
    if path.name != 'index.md' or path.parent == BLOG_POSTS:
        raise ValueError('Bài viết phải nằm trong thư mục riêng dưới Posts.')
    relative = path.parent.relative_to(BLOG_POSTS)
    return ROOT / 'content' / 'posts' / relative / 'index.md'


def listing(writing_only=False):
    items = posts()
    repo_posts = [] if writing_only else sorted(
        path for path in (ROOT / 'content' / 'posts').rglob('*.md')
        if path.is_file() and not path.is_symlink())
    rows = []
    for path in repo_posts:
        content = path.read_text(encoding='utf-8-sig')
        state = 'Nháp · Hugo' if is_draft(content) else 'Đã đăng · Hugo'
        rows.append((title(path), state, 'Repo Hugo',
                     path.relative_to(ROOT).as_posix()))
    for path in items:
        target = post_target(path)
        target_exists = target.exists()
        published = target_exists and not is_draft(
            target.read_text(encoding='utf-8-sig'))
        state = 'Đã đăng · Thư mục viết' if published else 'Chưa đăng · Thư mục viết'
        rows.append((title(path), state, 'Markdown',
                     path.parent.relative_to(BLOG_DIR).as_posix()))
    heading = 'Bài trong thư mục viết' if writing_only else 'Tất cả bài viết'
    print(heading)
    for i, row in enumerate(rows, 1):
        print(f'{i}. {row[0]} · {row[1]} · {row[2]} · {row[3]}')
    if not rows:
        print(f'Chưa có bài. Tạo bằng: blog post "Tiêu đề" · Thư mục: {BLOG_POSTS}')
    elif not items and repo_posts and not writing_only:
        print('Để viết bài mới hoặc sửa bài, dùng blog post "Tiêu đề".')
    if writing_only and not items:
        print('Danh sách đăng chỉ gồm bài trong thư mục viết.')
    return items


def choose(query=None):
    items = listing(writing_only=True)
    if not items:
        raise ValueError('Chưa có bài trong thư mục viết. Tạo bằng: blog post "Tiêu đề"')
    if query:
        matches = [path for path in items
                   if query.casefold() in {title(path).casefold(),
                                           path.parent.name.casefold()}]
        if len(matches) == 1:
            return matches[0]
        if not matches:
            raise ValueError(f'Không tìm thấy bài "{query}" trong thư mục viết.')
        raise ValueError(f'Tên "{query}" khớp nhiều bài; hãy chọn bằng số trong blog publish.')
    choice = ask_choice('Chọn số', [str(i) for i in range(1, len(items) + 1)])
    return items[int(choice) - 1]


def delete_draft(path):
    path = safe(path, BLOG_POSTS)
    if path.name != 'index.md' or path.parent == BLOG_POSTS:
        raise ValueError('Chỉ xóa được bài nằm trong thư mục viết.')
    target = post_target(path)
    if target.exists() and not is_draft(target.read_text(encoding='utf-8-sig')):
        raise ValueError('Bài này đã đăng. Dùng blog unpublish để gỡ khỏi website.')
    bundle = path.parent
    files = sorted(entry for entry in bundle.rglob('*') if entry.is_file())
    size = sum(entry.stat().st_size for entry in files)
    print('Sẽ xóa nháp: ' + title(path))
    for entry in files:
        print('  ' + entry.relative_to(BLOG_DIR).as_posix())
    print(f'Tổng {len(files)} file, {size / 1024 / 1024:.2f} MiB.')
    if not confirm('Xóa nháp và toàn bộ file trong thư mục này?'):
        print('Đã hủy; không thay đổi file.')
        return
    shutil.rmtree(bundle)
    print('Đã xóa nháp.')


def unpublish_post(path):
    if git('branch', '--show-current') != 'main':
        raise ValueError('Chỉ gỡ bài khi đang ở nhánh main.')
    if git('diff', '--cached', '--name-only'):
        raise ValueError('Đã có file staged. Hãy xử lý chúng trước để tránh commit nhầm.')
    if path.is_relative_to(BLOG_POSTS):
        source = safe(path, BLOG_POSTS)
        target = post_target(source)
    else:
        source = None
        target = safe(path, ROOT / 'content' / 'posts')
        if target.suffix.lower() != '.md':
            raise ValueError('Chỉ gỡ được file bài Markdown trong content/posts.')
    if not target.is_file():
        raise ValueError('Không tìm thấy bài trên blog.')
    is_bundle = target.name == 'index.md'
    delete_path = target.parent if is_bundle else target
    bundle = target.parent if is_bundle else None
    draft = is_draft(target.read_text(encoding='utf-8-sig'))
    if bundle:
        validate_bundle(bundle)
    elif target.is_symlink():
        raise ValueError('Bài có symbolic link; không thể gỡ an toàn.')
    relative = delete_path.relative_to(ROOT).as_posix()
    if git('status', '--porcelain', '--', relative):
        raise ValueError('File bài trên blog có thay đổi chưa commit; hãy xử lý trước.')
    if not git('ls-files', '--', target.relative_to(ROOT).as_posix()):
        raise ValueError('Bài này không được Git theo dõi; không thể gỡ an toàn.')

    run_step('Đang kiểm tra cập nhật từ GitHub...', 'git', 'fetch', '--progress',
             'origin', 'main')
    if git('rev-list', '--count', 'HEAD..origin/main') != '0':
        raise ValueError('Máy đang thiếu commit từ GitHub. Chạy blog sync rồi thử lại.')
    if git('rev-list', '--count', 'origin/main..HEAD') != '0':
        raise ValueError('Có commit chưa push. Đồng bộ Git riêng trước khi gỡ bài.')

    files = (sorted(entry for entry in bundle.rglob('*') if entry.is_file())
             if bundle else [target])
    size = sum(entry.stat().st_size for entry in files)
    print(('Sẽ xóa nháp khỏi repo: ' if draft else 'Sẽ gỡ khỏi website: ')
                  + title(target))
    for entry in files:
        print('  ' + entry.relative_to(ROOT).as_posix())
    print(f'Tổng {len(files)} file, {size / 1024 / 1024:.2f} MiB.')
    if source:
        print('Bài nguồn trong thư mục viết sẽ được giữ nguyên.')
    prompt = 'Xóa nháp khỏi repo và push thay đổi?' if draft else (
        'Gỡ bài khỏi website và push thay đổi?')
    if not confirm(prompt):
        print('Đã hủy; không thay đổi file.')
        return

    parent = bundle.parent if bundle else target.parent
    committed = False
    with tempfile.TemporaryDirectory(prefix='.blog-unpublish-', dir=parent) as tmp:
        backup = Path(tmp) / 'backup'
        if bundle:
            shutil.copytree(bundle, backup)
        else:
            shutil.copy2(target, backup)
        try:
            if bundle:
                shutil.rmtree(bundle)
            else:
                target.unlink()
            print('Đang build Hugo sau khi gỡ bài...')
            started = time.perf_counter()
            with site_snapshot() as (source, destination):
                run('hugo', '--source', source, '--gc', '--minify',
                    '--destination', destination)
            print(f'  Build hoàn tất sau {time.perf_counter() - started:.1f} giây.')
            git('add', '--all', '--', relative)
            staged = git('diff', '--cached', '--name-only', '--', relative)
            if not staged:
                if bundle:
                    shutil.copytree(backup, bundle)
                else:
                    shutil.copy2(backup, target)
                print('Không có thay đổi cần gỡ.')
                return
            print(staged)
            run_step('Đang tạo commit...', 'git', 'commit', '-m',
                     ('Delete draft: ' if draft else 'Unpublish: ') + title(target))
            committed = True
            run_step('Đang cập nhật GitHub...', 'git', 'push', '--progress',
                     'origin', 'main')
        except BaseException:
            if not committed:
                git('reset', '--', relative)
                if bundle:
                    if bundle.exists():
                        shutil.rmtree(bundle)
                    shutil.copytree(backup, bundle)
                else:
                    shutil.copy2(backup, target)
            else:
                print('Commit đã lưu trên máy; push chưa thành công. Chạy blog status rồi git push origin main.')
            raise
    if draft:
        print('Đã xóa nháp khỏi repo.')
    else:
        print('Đã gỡ bài khỏi website.')
    if source:
        print('Bản nguồn trong thư mục viết vẫn được giữ.')
    print('Theo dõi: https://github.com/cmduyeen/cmduyeen.github.io/actions')


def editor(path):
    command = shutil.which('code') or shutil.which('Code.exe')
    if os.name == 'nt':
        candidates = []
        if command and Path(command).suffix.lower() in {'.cmd', '.bat'}:
            candidates.append(Path(command).resolve().parent.parent / 'Code.exe')
        for variable in ('LOCALAPPDATA', 'ProgramFiles', 'ProgramFiles(x86)'):
            root = os.environ.get(variable)
            if root:
                candidates.append(Path(root) / 'Microsoft VS Code' / 'Code.exe')
        executable = next((candidate for candidate in candidates if candidate.is_file()), None)
        if executable:
            command = str(executable)
        elif command and Path(command).suffix.lower() not in {'.cmd', '.bat'}:
            executable = Path(command)
            if executable.is_file():
                command = str(executable)
            else:
                command = None
        else:
            command = None
    if not command:
        raise ValueError('Không tìm thấy VS Code. Cài VS Code và bật lệnh `code` trong PATH.')
    print('Đang mở bài trong VS Code. Lưu và đóng file để quay lại blog.')
    run(command, '--wait', path)


def create(kind, name):
    if kind != 'post':
        raise ValueError('Chỉ tạo bài viết trong thư mục Blog.')
    slug = slugify(name)
    path = safe(BLOG_POSTS / slug / 'index.md', BLOG_POSTS)
    target = ROOT / 'content' / 'posts' / slug / 'index.md'
    if path.exists() or target.exists() or target.parent.with_suffix('.md').exists():
        raise ValueError('Tên đường dẫn đã tồn tại.')
    path.parent.mkdir(parents=True, exist_ok=True)
    text = ('---\ntitle: ' + json.dumps(name, ensure_ascii=False) + '\n'
            + 'date: ' + dt.datetime.now().astimezone().isoformat(timespec='seconds')
            + '\ntags: []\ndraft: true\n---\n\n')
    path.write_text(text, encoding='utf-8')
    print('Đang mở bài trong VS Code...')
    editor(path)
    print('Đã lưu bài: ' + str(path))
    return path


def validate_bundle(bundle):
    if not bundle.is_dir():
        raise ValueError('Không tìm thấy thư mục bài viết.')
    for entry in bundle.rglob('*'):
        if entry.is_symlink():
            raise ValueError('Thư mục bài có symbolic link; hãy bỏ link trước khi xuất bản.')
        safe(entry, bundle)


def published_text(path):
    text = path.read_text(encoding='utf-8-sig')
    front = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    if not front:
        raise ValueError('Bài cần YAML front matter bắt đầu bằng ---; chưa sửa file.')
    header = re.sub(r'^draft\s*:.*$', 'draft: false', front[1], flags=re.M)
    if not re.search(r'^draft\s*:', header, re.M):
        header += '\ndraft: false'
    return '---\n' + header + '\n---\n' + text[front.end():]


def publish_post(path):
    if git('branch', '--show-current') != 'main':
        raise ValueError('Chỉ đăng khi đang ở nhánh main.')
    if git('diff', '--cached', '--name-only'):
        raise ValueError('Đã có file staged. Hãy xử lý chúng trước để tránh commit nhầm.')
    run_step('Đang kiểm tra cập nhật từ GitHub...', 'git', 'fetch', '--progress',
             'origin', 'main')
    if git('rev-list', '--count', 'HEAD..origin/main') != '0':
        raise ValueError('Máy đang thiếu commit từ GitHub. Chạy blog sync rồi thử lại.')
    if git('rev-list', '--count', 'origin/main..HEAD') != '0':
        raise ValueError('Có commit chưa push. Đồng bộ Git riêng trước khi đăng bài mới.')

    path = safe(path, BLOG_POSTS)
    target = post_target(path)
    bundle = path.parent
    validate_bundle(bundle)
    bundle_files = [entry for entry in bundle.rglob('*') if entry.is_file()]
    bundle_size = sum(entry.stat().st_size for entry in bundle_files)
    if git('status', '--porcelain', '--', target.parent.relative_to(ROOT).as_posix()):
        raise ValueError('Thư mục bài trên blog có thay đổi chưa commit; hãy xử lý trước.')
    is_update = target.parent.exists()
    print(('Sẽ cập nhật: ' if is_update else 'Sẽ đăng: ') + title(path))
    for entry in sorted(bundle.rglob('*')):
        if entry.is_file():
            destination = target.parent / entry.relative_to(bundle)
            print('  ' + destination.relative_to(ROOT).as_posix())
    print(f'Tổng {len(bundle_files)} file, {bundle_size / 1024 / 1024:.2f} MiB.')
    print('Bài Markdown gốc sẽ được giữ nguyên.')
    if not confirm('Tiếp tục xuất bản?'):
        return

    target.parent.parent.mkdir(parents=True, exist_ok=True)
    committed = False
    with tempfile.TemporaryDirectory(prefix='.blog-publish-', dir=target.parent.parent) as tmp:
        temp = Path(tmp)
        staged = temp / 'staged'
        backup = temp / 'backup'
        had_target = target.parent.exists()
        try:
            copy_started = time.perf_counter()
            print('Đang sao chép bài và ảnh...')
            if had_target:
                shutil.copytree(target.parent, backup)
            shutil.copytree(bundle, staged)
            (staged / path.name).write_text(published_text(path), encoding='utf-8')
            if had_target:
                shutil.rmtree(target.parent)
            os.replace(staged, target.parent)
            print(f'  Sao chép hoàn tất sau {time.perf_counter() - copy_started:.1f} giây.')
            print('Đang tạo bản sao tạm và build Hugo...')
            started = time.perf_counter()
            with site_snapshot() as (source, destination):
                run('hugo', '--source', source, '--gc', '--minify',
                    '--destination', destination)
            print(f'  Build hoàn tất sau {time.perf_counter() - started:.1f} giây.')
            relative = target.parent.relative_to(ROOT).as_posix()
            git('add', '--', relative)
            if not git('diff', '--cached', '--name-only'):
                print('Không có thay đổi cần đăng.')
                return
            print(git('diff', '--cached', '--stat'))
            message = ('Update: ' if is_update else 'Publish: ') + title(path)
            run_step('Đang tạo commit...', 'git', 'commit', '-m', message)
            committed = True
            run_step('Đang tải bài và ảnh lên GitHub...', 'git', 'push', '--progress',
                     'origin', 'main')
        except BaseException:
            if not committed:
                git('reset', '--', target.parent.relative_to(ROOT).as_posix())
                if target.parent.exists():
                    shutil.rmtree(target.parent)
                if had_target:
                    shutil.copytree(backup, target.parent)
            else:
                print('Commit đã lưu trên máy; push chưa thành công. Chạy blog status rồi git push origin main.')
            raise
    print('Đã push. GitHub Actions đang triển khai; đây chưa phải xác nhận blog đã cập nhật.')
    if shutil.which('gh'):
        try:
            run_step('Đang kiểm tra GitHub Actions (tối đa 15 giây)...',
                     'gh', 'run', 'list', '--commit', git('rev-parse', 'HEAD'),
                     '--limit', '3', timeout=15)
        except subprocess.TimeoutExpired:
            print('GitHub Actions chưa phản hồi kịp. Bài đã push; xem trạng thái tại liên kết bên dưới.')
    print('Theo dõi: https://github.com/cmduyeen/cmduyeen.github.io/actions')


def add_image(path):
    source = Path(input('Đường dẫn ảnh: ').strip().strip('"')).expanduser().resolve()
    if not source.is_file() or source.suffix.lower() not in {'.png','.jpg','.jpeg','.webp','.gif','.svg','.avif'}:
        raise ValueError('Hãy chọn một file ảnh hợp lệ.')
    bundled = path.name in {'index.md', '_index.md'}
    folder = path.parent if bundled else ROOT / 'static' / 'images' / path.stem
    folder.mkdir(parents=True, exist_ok=True)
    name = slugify(source.stem) + source.suffix.lower()
    dest = safe(folder / name, path.parent)
    if dest.exists():
        raise ValueError('Ảnh trùng tên; đổi tên ảnh nguồn trước khi thêm.')
    shutil.copy2(source, dest)
    url = name if bundled else '/images/' + path.stem + '/' + name
    alt = input(f'Mô tả ảnh [{source.stem}]: ').strip() or source.stem
    alt = alt.replace(']', r'\]')
    with path.open('a', encoding='utf-8') as handle:
        handle.write('\n![' + alt + '](' + url + ')\n')
    print('Đã thêm ảnh và chèn Markdown vào cuối bài.')


@contextmanager
def site_snapshot(drafts=False):
    # Hugo cannot read some source paths directly on this Windows setup.
    # Python can read them: build an isolated copy without altering source ACLs.
    with tempfile.TemporaryDirectory(prefix='blog-preview-') as tmp:
        source = Path(tmp) / 'source'
        shutil.copytree(ROOT, source, ignore=shutil.ignore_patterns(
            '.git', '.blog-local', 'public', 'resources',
            '.hugo_build.lock', '__pycache__', 'node_modules',
            '.blog-publish-*', '.blog-unpublish-*'))
        if drafts and (LOCAL / 'content').exists():
            shutil.copytree(LOCAL / 'content', source / 'content', dirs_exist_ok=True)
        if drafts and BLOG_POSTS.exists():
            for post in posts():
                bundle = post.parent
                validate_bundle(bundle)
                relative = bundle.relative_to(BLOG_POSTS)
                shutil.copytree(bundle, source / 'content' / 'posts' / relative,
                                dirs_exist_ok=True)
        yield source, Path(tmp) / 'public'


def preview():
    with site_snapshot(drafts=True) as (source, destination):
        print('Xem trước: http://127.0.0.1:1313 · Ctrl+C để dừng')
        webbrowser.open('http://127.0.0.1:1313')
        try:
            run('hugo', 'server', '--bind', '127.0.0.1', '--buildDrafts',
                '--source', source, '--destination', destination, '--disableFastRender')
        except KeyboardInterrupt:
            pass


def publish(path):
    if git('branch', '--show-current') != 'main':
        raise ValueError('Chỉ đăng khi đang ở nhánh main.')
    if git('diff', '--cached', '--name-only'):
        raise ValueError('Đã có file staged. Hãy xử lý chúng trước để tránh commit nhầm.')
    if git('ls-files', '--others', '--exclude-standard', '--', '.blog-local'):
        raise ValueError('.blog-local chưa được Git bỏ qua. Dừng để bảo vệ nháp.')
    run_step('Đang kiểm tra cập nhật từ GitHub...', 'git', 'fetch', '--progress',
             'origin', 'main')
    if git('rev-list', '--count', 'HEAD..origin/main') != '0':
        raise ValueError('Máy đang thiếu commit từ GitHub. Đồng bộ Git trước rồi thử lại.')
    # Stop if earlier unpushed commits would be uploaded along with this publication.
    if git('rev-list', '--count', 'origin/main..HEAD') != '0':
        raise ValueError('Có commit chưa push. Kiểm tra và đồng bộ riêng trước khi đăng bài mới.')
    private = path.resolve().is_relative_to(LOCAL.resolve())
    path = safe(path, LOCAL if private else ROOT)
    target = ROOT / path.relative_to(LOCAL) if private else path
    if private and (target.exists() or target.parent.with_suffix('.md').exists()):
        raise ValueError('Đường dẫn xuất bản trùng nội dung hiện có.')
    original = path.read_bytes()
    text = original.decode('utf-8-sig')
    front = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)', text, re.S)
    config = path == ROOT / 'hugo.toml'
    if not front and not config:
        raise ValueError('Cần YAML front matter bắt đầu bằng ---; chưa sửa file.')
    published = text
    if front and not config:
        header = re.sub(r'^draft:.*$', 'draft: false', front[1], flags=re.M)
        if not re.search(r'^draft:', header, re.M):
            header += '\ndraft: false'
        published = '---\n' + header + '\n---\n' + text[front.end():]
    bundled = target.name in {'index.md', '_index.md'}
    scope = [target.parent if bundled else target]
    if not bundled and (ROOT / 'static' / 'images' / target.stem).exists():
        scope.append(ROOT / 'static' / 'images' / target.stem)
    relative = [item.relative_to(ROOT).as_posix() for item in scope]
    if git('status', '--porcelain', '--', *relative):
        raise ValueError('Nội dung bài trên blog có thay đổi chưa commit; hãy xử lý trước.')
    print('Sẽ đăng: ' + title(path))
    for item in scope:
        for entry in sorted(item.rglob('*')) if item.is_dir() else [item]:
            if entry.is_file() or entry == target:
                print('  ' + entry.relative_to(ROOT).as_posix())
    if private:
        print('Bài và toàn bộ file trong thư mục bản nháp sẽ được đưa lên repo công khai.')
        for entry in sorted(path.parent.iterdir()):
            print('  ' + entry.name)
    if not confirm('Đăng nội dung này?'):
        return
    committed = False
    try:
        if private:
            shutil.copytree(path.parent, target.parent)
        target.write_text(published, encoding='utf-8')
        with site_snapshot() as (source, destination):
            run('hugo', '--source', source, '--gc', '--minify', '--destination', destination)
        git('add', '--', *relative)
        if not git('diff', '--cached', '--name-only'):
            print('Không có thay đổi cần đăng.')
            return
        # Final file list is Git's actual staged set; no unrelated files are added.
        print(git('diff', '--cached', '--stat'))
        git('commit', '-m', 'Publish: ' + title(target))
        committed = True
        if private:
            shutil.rmtree(path.parent)
        git('push', 'origin', 'main')
    except BaseException:
        if not committed:
            git('reset', '--', *[p.relative_to(ROOT).as_posix() for p in scope])
            if private and target.parent.exists():
                shutil.rmtree(target.parent)
            elif not private:
                path.write_bytes(original)
        else:
            print('Commit đã lưu trên máy; push chưa thành công. Kiểm tra blog status, rồi git push origin main.')
        raise
    print('Đã push. GitHub Actions đang triển khai; đây chưa phải xác nhận blog đã cập nhật.')
    if shutil.which('gh'):
        run('gh', 'run', 'list', '--commit', git('rev-parse', 'HEAD'), '--limit', '3')
    print('Theo dõi: https://github.com/cmduyeen/cmduyeen.github.io/actions')


def sync():
    if git('branch', '--show-current') != 'main':
        raise ValueError('Chỉ đồng bộ khi đang ở nhánh main.')
    if git('status', '--porcelain', '--untracked-files=normal'):
        raise ValueError('Repo có thay đổi chưa commit. Hãy commit hoặc cất chúng trước khi đồng bộ.')
    git('fetch', 'origin', 'main')
    ahead = int(git('rev-list', '--count', 'origin/main..HEAD'))
    behind = int(git('rev-list', '--count', 'HEAD..origin/main'))
    if ahead and behind:
        raise ValueError('Nhánh main đã lệch với GitHub. Hãy xử lý Git riêng; blog sync không tự merge.')
    if behind:
        git('merge', '--ff-only', 'origin/main')
        print(f'Đã đồng bộ {behind} commit từ GitHub. Không có nội dung nào được đăng.')
    elif ahead:
        print(f'Máy đang có {ahead} commit chưa có trên GitHub. Không tự push.')
    else:
        print('Blog đã đồng bộ với GitHub.')


def act(action, args):
    if action == 'list':
        listing()
    elif action in {'manage', 'posts'}:
        manage_menu()
    elif action in {'new', 'post'}:
        create('post', args.title or input('Tiêu đề: ').strip())
    elif action == 'sync':
        sync()
    elif action == 'preview':
        preview()
    elif action in {'open', 'edit', 'image', 'read', 'publish', 'delete', 'unpublish'}:
        run_post_action(action, choose(args.title))
    elif action == 'pages':
        print('Sửa menu, tên blog và thông tin liên hệ trong hugo.toml. Không tự đăng cấu hình.')
        editor(ROOT / 'hugo.toml')
    elif action == 'publish-settings':
        publish(ROOT / 'hugo.toml')
    elif action == 'status':
        print(git('status', '--short') or 'Không có thay đổi trong repo.')
        print(f'Thư mục viết: {BLOG_POSTS} · {len(posts())} bài')


def run_post_action(action, path):
    if action in {'open', 'edit'}:
        editor(path)
    elif action == 'image':
        add_image(path)
    elif action == 'read':
        text = path.read_text(encoding='utf-8-sig')
        text = re.sub(r'\A---\r?\n.*?\r?\n---\r?\n', '', text, count=1, flags=re.S)
        print(text)
    elif action == 'publish':
        publish_post(path)
    elif action == 'delete':
        delete_draft(path)
    elif action == 'unpublish':
        unpublish_post(path)


def manage_menu():
    while True:
        items = managed_posts()
        if not items:
            return
        selection = ask_choice(
            'Chọn bài · 0 thoát',
            ['0', *(str(i) for i in range(1, len(items) + 1))],
        )
        if selection == '0':
            return
        selected = items[int(selection) - 1]
        is_published = selected.status == 'Đã đăng'
        local_published = selected.source == 'MÁY' and is_published
        note = None
        if selected.source == 'BLOG' and is_published:
            action_labels = '1 Cập nhật   2 Sửa   3 Gỡ   0 Quay'
            action_choices = ['0', '1', '2', '3']
        elif local_published:
            note = 'Bài đã đăng; chọn dòng BLOG để gỡ khỏi website.'
            action_labels = '1 Cập nhật   2 Sửa   0 Quay'
            action_choices = ['0', '1', '2']
        else:
            action_labels = '1 Đăng   2 Sửa   3 Xóa nháp   0 Quay'
            action_choices = ['0', '1', '2', '3']
        print(f'{selected.source} · {title(selected.path)} · {selected.status}')
        print(action_labels)
        if note:
            print(note)
        choice = ask_choice('Chọn', action_choices)
        if choice == '0':
            return
        try:
            if choice == '1':
                if selected.source == 'MÁY':
                    publish_post(selected.path)
                else:
                    publish(selected.path)
            elif choice == '2':
                editor(selected.path)
            elif choice == '3':
                if selected.source == 'MÁY':
                    delete_draft(selected.path)
                else:
                    unpublish_post(selected.path)
        except (ValueError, OSError, subprocess.CalledProcessError) as error:
            print('Lỗi: ' + str(error))


def managed_posts():
    local_posts = posts()
    repo_posts = sorted(
        path for path in (ROOT / 'content' / 'posts').rglob('*.md')
        if path.is_file() and not path.is_symlink())
    items = []
    for path in local_posts:
        target = post_target(path)
        status = ('Đã đăng' if target.exists() and not is_draft(
            target.read_text(encoding='utf-8-sig')) else 'Chưa đăng')
        items.append(ManagedPost(path, 'MÁY', status))
    for path in repo_posts:
        content = path.read_text(encoding='utf-8-sig')
        items.append(ManagedPost(
            path, 'BLOG', 'Nháp' if is_draft(content) else 'Đã đăng'))

    print('BLOG · Quản lý bài')
    for index, item in enumerate(items, 1):
        location = (item.path.parent.relative_to(BLOG_DIR).as_posix()
                    if item.source == 'MÁY'
                    else item.path.relative_to(ROOT).as_posix())
        print(f'{index}. {item.source} · {title(item.path)} · {item.status} · {location}')
    if not items:
        print('Chưa có bài nào.')
    return items


def open_blog():
    url = 'https://cmduyeen.github.io/'
    if not webbrowser.open(url):
        raise OSError('Không mở được blog trong trình duyệt: ' + url)


def main():
    parser = argparse.ArgumentParser(description='Quản lý blog Dyn bằng VS Code, Markdown và Hugo')
    parser.add_argument(
        'action',
        nargs='?',
        choices=[
            'list', 'manage', 'new', 'post', 'open', 'edit', 'image', 'read',
            'preview', 'publish', 'delete', 'unpublish', 'sync', 'pages',
            'publish-settings', 'status',
        ],
    )
    parser.add_argument('title', nargs='?')
    args = parser.parse_args()
    if args.action:
        act(args.action, args)
        return
    choices = {
        '1': 'publish',
        '2': 'manage',
        '3': 'open-blog',
    }
    while True:
        print('DYN')
        print('1 Đăng   2 Quản   3 Xem   0 Thoát')
        choice = ask_choice('Chọn', ['0', *choices])
        if choice == '0':
            return
        try:
            action = choices[choice]
            if action == 'open-blog':
                open_blog()
            else:
                act(action, args)
        except (ValueError, OSError, subprocess.CalledProcessError) as error:
            print('Lỗi: ' + str(error))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print('Lỗi: ' + str(error))
        sys.exit(1)
    except (KeyboardInterrupt, EOFError):
        print('\nĐã dừng.')
