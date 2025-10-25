function waitForSelector(selector, root = document, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const el = root.querySelector(selector);
    if (el) return resolve(el);
    const obs = new MutationObserver(() => {
      const el2 = root.querySelector(selector);
      if (el2) {
        obs.disconnect();
        resolve(el2);
      }
    });
    obs.observe(root.documentElement || root, { childList: true, subtree: true });
    setTimeout(() => {
      obs.disconnect();
      reject(new Error("Timeout waiting for selector: " + selector));
    }, timeout);
  });
}

function createAskButton() {
  const btn = document.createElement("button");
  btn.textContent = "问AI";
  btn.title = "把本事件标题交给 ChatGPT 讨论";
  btn.style.cssText = `
    margin-left: 10px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,.1);
    background: #fff;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
  `;
  btn.onmouseenter = () => (btn.style.background = "#f5f5f5");
  btn.onmouseleave = () => (btn.style.background = "#fff");
  return btn;
}

function buildPrompt(titleText) {
  const url = location.href;
  return (
    `请基于这个 Polymarket 事件进行分析并给出交易建议：\n` +
    `标题：${titleText}\n` +
    `链接：${url}\n\n` +
    `要求：\n1) 解释事件的判定条件与时间线；\n2) 概览买/卖双方核心观点；\n3) 给出可能的催化与风险；\n4) 提供结构化的交易思路（入场/止损/退出标准）。`
  );
}

(async () => {
  try {
    const h1 = await waitForSelector("h1");
    if (!h1 || h1.dataset.aiButtonInjected) return;
    const btn = createAskButton();
    h1.insertAdjacentElement("afterend", btn);
    h1.dataset.aiButtonInjected = "1";
    btn.addEventListener("click", async () => {
      const titleText = h1.textContent?.trim() || "Polymarket event";
      const prompt = buildPrompt(titleText);
      try {
        await navigator.clipboard.writeText(prompt);
      } catch (e) {
        console.warn("剪贴板复制失败：", e);
      }
      // 将完整提示词作为查询参数传递给 ChatGPT，而不仅是标题
      const q = encodeURIComponent(prompt);
      const urlCandidates = [
        `https://chatgpt.com/?q=${q}`
      ];
      const win = window.open(urlCandidates[0], "_blank");
      if (!win) window.location.href = urlCandidates[0];
      btn.textContent = "已复制，去 ChatGPT 粘贴";
      setTimeout(() => (btn.textContent = "问AI"), 2500);
    });
  } catch (err) {
    console.warn("[Polymarket Ask AI] 初始化失败：", err);
  }
})();
