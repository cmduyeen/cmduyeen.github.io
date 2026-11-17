// Safe interactive Markdown preview for Markdown 101 exercises.
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
    const pattern = /\\([\\`*_{}[\]()#+\-.!~])|(`+)([^`\n]+?)\2|!\[([^\]\n]*)\]\(([^\s)]+)\)|\[([^\]\n]+)\]\(([^\s)]+)\)|~~([^~\n]+)~~|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      parent.append(document.createTextNode(text.slice(last, match.index)));
      if (match[1]) {
        parent.append(document.createTextNode(match[1]));
      } else if (match[2]) {
        parent.append(element('code', match[3]));
      } else if (match[4] !== undefined) {
        const url = safeUrl(match[5], true);
        if (url) {
          const img = element('img'); img.src = url; img.alt = match[4]; img.loading = 'lazy';
          parent.append(img);
        } else {
          parent.append(element('span', `[Image: ${match[4]}]`));
        }
      } else if (match[6] !== undefined) {
        const url = safeUrl(match[7]);
        if (url) {
          const link = element('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer nofollow';
          inline(link, match[6], depth + 1); parent.append(link);
        } else {
          parent.append(document.createTextNode(match[6]));
        }
      } else if (match[8] !== undefined) {
        const del = element('del');
        inline(del, match[8], depth + 1);
        parent.append(del);
      } else {
        const node = element(match[9] !== undefined ? 'strong' : 'em');
        inline(node, match[9] ?? match[10], depth + 1);
        parent.append(node);
      }
      last = match.index + match[0].length;
    }
    parent.append(document.createTextNode(text.slice(last)));
  }

  function parseTableRow(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  }

  function parseAligns(sepLine) {
    const cells = parseTableRow(sepLine);
    if (!cells.length || !cells.every(c => /^:?-{3,}:?$/.test(c))) return null;
    return cells.map(c => (c.startsWith(':') && c.endsWith(':')) ? 'center' : (c.endsWith(':') ? 'right' : 'left'));
  }

  function render(text, output) {
    const fragment = document.createDocumentFragment();
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    let i = 0;
    const special = line => /^(?:\s*$|`{3,}|~{3,}|#{1,6}\s|\s*[-+*]\s|\s*\d+[.)]\s|>\s?|---\s*$|.*\|.*)/.test(line);

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

      // GFM Table
      if (line.includes('|') && i + 1 < lines.length) {
        const aligns = parseAligns(lines[i + 1]);
        if (aligns) {
          const table = element('table');
          const thead = element('thead');
          const headTr = element('tr');
          const headers = parseTableRow(line);
          headers.forEach((h, idx) => {
            const th = element('th');
            th.style.textAlign = aligns[idx] || 'left';
            inline(th, h);
            headTr.append(th);
          });
          thead.append(headTr);
          table.append(thead);
          i += 2;
          const tbody = element('tbody');
          while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
            const rowCells = parseTableRow(lines[i]);
            const tr = element('tr');
            for (let c = 0; c < headers.length; c++) {
              const td = element('td');
              td.style.textAlign = aligns[c] || 'left';
              inline(td, rowCells[c] || '');
              tr.append(td);
            }
            tbody.append(tr);
            i++;
          }
          table.append(tbody);
          fragment.append(table);
          continue;
        }
      }

      const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
      if (heading) {
        const level = heading[1].length;
        const node = element(`h${Math.min(level + 2, 6)}`);
        node.className = `md-preview-h${level}`;
        inline(node, heading[2]); fragment.append(node); i++; continue;
      }

      if (/^---\s*$/.test(line)) { fragment.append(element('hr')); i++; continue; }

      const list = line.match(/^\s*(?:([-+*])|\d+[.)])\s+(.+)$/);
      if (list) {
        const ordered = !list[1];
        const node = element(ordered ? 'ol' : 'ul');
        if (ordered) node.start = Number.parseInt(line.trim(), 10);
        const pattern = ordered ? /^\s*\d+[.)]\s+(.+)$/ : /^\s*[-+*]\s+(.+)$/;
        while (i < lines.length) {
          const item = lines[i].match(pattern);
          if (!item) break;
          const li = element('li');
          const task = !ordered && item[1].match(/^\[( |x|X)\]\s+(.*)$/);
          if (task) {
            li.className = 'md-task-item';
            const cb = element('input');
            cb.type = 'checkbox';
            cb.disabled = true;
            cb.checked = task[1].toLowerCase() === 'x';
            const span = element('span');
            inline(span, task[2]);
            li.append(cb, span);
          } else {
            inline(li, item[1]);
          }
          node.append(li);
          i++;
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
    const isEn = panel.dataset.lang === 'en';
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
      clearTimeout(timer); input.value = initial; update(); input.focus();
      status.textContent = isEn ? 'Restored initial example.' : 'Đã khôi phục ví dụ ban đầu.';
    });
    const download = panel.querySelector('[data-practice-download]');
    download.hidden = false;
    download.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([input.value], { type: 'text/markdown;charset=utf-8' }));
      const link = element('a'); link.href = url; link.download = 'markdown-practice.md';
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = isEn ? 'Prepared .md file for download.' : 'Đã chuẩn bị tệp .md để tải xuống.';
    });
    update();
  });
})();
