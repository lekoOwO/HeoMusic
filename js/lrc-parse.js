function processLyricParagraph(p) {
  if (p.classList.contains('lyric-processed')) return;

  const text = p.textContent.trim();
  const end = text.lastIndexOf(')');
  if (end === -1) {
    p.classList.add('lyric-processed');
    return;
  };

  let depth = 0;
  for (let start = end - 1; start >= 0; start--) {
    if (text[start] === ')') {
      depth++;
    } else if (text[start] === '(') {
      if (depth === 0) {
        const jp = text.slice(0, start).trim();
        const zh = text.slice(start + 1, end).trim();

        if (!jp || !zh) return;

        p.innerHTML = `${jp}<br><span style="font-size: 90%;">${zh}</span>`;
        p.classList.add('lyric-processed');
        return;
      } else {
        depth--;
      }
    }
  }

  p.classList.add('lyric-processed');
  return;
}

function initLyricProcessor() {
  const targetNode = document.querySelector('.aplayer-lrc-contents');

  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      targetNode.querySelectorAll('p').forEach(p => {
        processLyricParagraph(p);
      });
    }
  };

  const config = {
    childList: true,      // 監聽子節點新增/刪除
    characterData: true,  // 監聽文字內容變動
    subtree: true         // 深度監聽所有子節點
  };

  const observer = new MutationObserver(callback);
  if (targetNode) {
    observer.observe(targetNode, config);
  }
}