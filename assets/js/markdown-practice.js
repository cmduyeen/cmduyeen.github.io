// Small teaching preview, deliberately limited to the syntax used in this series.
// All user text becomes DOM text nodes. Raw HTML and scripts are never executed.
(() => {
  function element(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeUrl(value, image = false) {
    try {
      const url = new URL(value, location.href);
      if (!['https:', 'http:'].includes(url.protocol)) return null;
      if (image && url.origin !== location.origin) return null;
      return url.href;
    } catch { return null; }
  }

  function inline(parent, text, depth = 0) {
    if (depth > 8) { parent.append(document.createTextNode(text)); return; }
    const pattern = /(`+)([^`\n]+?)\1|!\[([^\]\n]*)\]\(([^\s)]+)\)|\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      parent.append(document.createTextNode(text.slice(last, match.index)));
      if (match[1]) parent.append(element('code', match[2]));
      else if (match[3] !== undefined) {
        const url = safeUrl(match[4], true);
        if (url) {
          const img = element('img'); img.src = url; img.alt = match[3]; img.loading = 'lazy';
          parent.append(img);
        } else parent.append(element('span', `[Ảnh: ${match[3]} — cần đường dẫn cùng website]`));
      } else if (match[5] !== undefined) {
        const url = safeUrl(match[6]);
        if (url) {
          const link = element('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer nofollow';
          inline(link, match[5], depth + 1); parent.append(link);
        } else parent.append(document.createTextNode(match[5]));
      } else {
        const node = element(match[7] !== undefined ? 'strong' : 'em');
        inline(node, match[7] ?? match[8], depth + 1); parent.append(node);
      }
      last = match.index + match[0].length;
    }
    parent.append(document.createTextNode(text.slice(last)));
  }

  function render(text, output) {
    const fragment = document.createDocumentFragment();
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    let i = 0;
    const special = line => /^(?:\s*$|`{3,}|~{3,}|#{1,6}\s|\s*[-+*]\s|\s*\d+[.)]\s|>\s?|---\s*$)/.test(line);
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      const fence = line.match(/^(`{3,}|~{3,})[^\n]*$/);
      if (fence) {
        const content = []; i++;
        const closing = new RegExp(`^${fence[1][0]}{${fence[1].length},}\\s*$`);
        while (i < lines.length && !closing.test(lines[i])) content.push(lines[i++]);
        if (i < lines.length) i++;
        const pre = element('pre'); pre.append(element('code', content.join('\n'))); fragment.append(pre); continue;
      }
      if (i === 0 && line.trim() === '---') {
        const content = [line]; i++;
        while (i < lines.length && lines[i].trim() !== '---') content.push(lines[i++]);
        if (i < lines.length) content.push(lines[i++]);
        const pre = element('pre'); pre.append(element('code', content.join('\n'))); fragment.append(pre); continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
      if (heading) {
        // Keep one page H1; the exercise is a nested section of the article.
        const level = heading[1].length;
        const node = element(`h${Math.min(level + 2, 6)}`);
        node.className = `md-preview-h${level}`;
        inline(node, heading[2]); fragment.append(node); i++; continue;
      }
      if (/^---\s*$/.test(line)) { fragment.append(element('hr')); i++; continue; }
      const list = line.match(/^\s*(?:([-+*])|\d+[.)])\s+(.+)$/);
      if (list) {
        const ordered = !list[1]; const node = element(ordered ? 'ol' : 'ul');
        if (ordered) node.start = Number.parseInt(line.trim(), 10);
        const pattern = ordered ? /^\s*\d+[.)]\s+(.+)$/ : /^\s*[-+*]\s+(.+)$/;
        while (i < lines.length) {
          const item = lines[i].match(pattern); if (!item) break;
          const li = element('li'); inline(li, item[1]); node.append(li); i++;
        }
        fragment.append(node); continue;
      }
      if (/^>\s?/.test(line)) {
        const content = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) content.push(lines[i++].replace(/^>\s?/, ''));
        const node = element('blockquote'); inline(node, content.join('\n')); fragment.append(node); continue;
      }
      const content = [line]; i++;
      while (i < lines.length && !special(lines[i])) content.push(lines[i++]);
      const node = element('p'); inline(node, content.join('\n')); fragment.append(node);
    }
    output.replaceChildren(fragment);
  }

  document.querySelectorAll('[data-markdown-practice]').forEach(panel => {
    if (panel.dataset.ready) return;
    panel.dataset.ready = 'true';
    const input = panel.querySelector('[data-practice-input]');
    const preview = panel.querySelector('[data-practice-preview]');
    const status = panel.querySelector('[data-practice-status]');
    const initial = input.value;
    let timer;
    const update = () => render(input.value.slice(0, 12000), preview);
    input.addEventListener('input', () => {
      status.textContent = '';
      clearTimeout(timer); timer = setTimeout(update, 120);
    });
    const reset = panel.querySelector('[data-practice-reset]');
    reset.hidden = false;
    reset.addEventListener('click', () => {
      clearTimeout(timer); input.value = initial; update(); input.focus(); status.textContent = 'Đã khôi phục ví dụ ban đầu.';
    });
    const download = panel.querySelector('[data-practice-download]');
    download.hidden = false;
    download.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([input.value], { type: 'text/markdown;charset=utf-8' }));
      const link = element('a'); link.href = url; link.download = 'thuc-hanh-markdown.md';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Đã chuẩn bị tệp .md để tải xuống.';
    });
    update();
  });
})();
