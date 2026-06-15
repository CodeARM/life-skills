const SYSTEM_PROMPT = `You are a marketing decoder. Your job is to translate marketing copy into honest, plain-language descriptions of what a product or feature actually does — or honestly acknowledge when the copy doesn't reveal enough to say.

## Core task
Read the provided marketing text. Extract the concrete, functional reality: what does this thing do, for whom, and how? Strip away all hype and write a short, factual description a non-expert could understand.

## Output format
- Under 200 words, ideally much less (aim for 50–100 words)
- Plain prose, no bullet points unless listing genuinely distinct features
- No hedging filler ("it's worth noting that...", "essentially...")
- One short paragraph is usually enough
- If the marketing copy is so vague that you cannot determine what the product concretely does, say so plainly: "This copy doesn't explain what the product actually does."

## Banned words and phrases
Never use any of the following in your output:
seamless, best-in-class, world-class, scalable, leverage, innovation, innovative, leader, leading, cutting-edge, state-of-the-art, robust, powerful, next-generation, next-gen, transformative, revolutionize, disruptive, dynamic, holistic, synergy, synergistic, empower, game-changing, groundbreaking, unlock, ecosystem, end-to-end, turnkey, best-of-breed, mission-critical, enterprise-grade, future-proof, frictionless, intuitive, delightful, reimagined, reimagine, reinvent, paradigm

If you catch yourself about to write one of these, replace it with a concrete description of what actually happens.

## Method
1. Identify the product or feature being described
2. Ask: what does it actually do? (a verb + object, not an adjective)
3. Ask: who uses it and what problem does it solve?
4. Ask: is there any concrete mechanism described, or just outcomes?
5. Write the answer to those questions in plain English

## Tone
Matter-of-fact. You are not mocking the marketing copy — you're just saying what is actually there (or not there). If some parts of the copy are concrete and useful, preserve those; only strip the parts that add no information.`;

// Create context menu item on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "decode-selection",
    title: "Decode with Marketing Decoder",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "decode-selection") {
    const selectedText = info.selectionText;
    if (!selectedText) return;

    // Show loading state in the page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showPanel,
      args: [null, true] // null result = loading
    });

    try {
      const { apiKey } = await chrome.storage.local.get("apiKey");
      if (!apiKey) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: showPanel,
          args: ["⚠️ No API key set. Click the extension icon to add your Anthropic API key.", false]
        });
        return;
      }

      const result = await callClaude(apiKey, selectedText);

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showPanel,
        args: [result, false]
      });

    } catch (err) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showPanel,
        args: [`Error: ${err.message}`, false]
      });
    }
  }
});

async function callClaude(apiKey, text) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: text }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.content.map(b => b.text || "").join("\n").trim();
}

// This function is injected into the page — must be self-contained
function showPanel(result, isLoading) {
  const PANEL_ID = "marketing-decoder-panel";

  // Remove existing panel
  const existing = document.getElementById(PANEL_ID);
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.setAttribute("data-marketing-decoder", "true");

  const header = document.createElement("div");
  header.className = "md-header";
  header.innerHTML = `
    <span class="md-title">📋 Marketing Decoder</span>
    <button class="md-close" title="Close">✕</button>
  `;

  const body = document.createElement("div");
  body.className = "md-body";

  if (isLoading) {
    body.innerHTML = `<div class="md-loading"><span class="md-spinner"></span> Decoding...</div>`;
  } else {
    body.innerHTML = `<p class="md-result">${result.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
  }

  const footer = document.createElement("div");
  footer.className = "md-footer";
  const copyBtn = document.createElement("button");
  copyBtn.className = "md-copy";
  copyBtn.textContent = isLoading ? "" : "Copy";
  if (!isLoading) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(result).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy", 1500);
      });
    });
  }
  footer.appendChild(copyBtn);

  panel.appendChild(header);
  panel.appendChild(body);
  panel.appendChild(footer);
  document.body.appendChild(panel);

  panel.querySelector(".md-close").addEventListener("click", () => panel.remove());
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    callClaude,
    showPanel,
    SYSTEM_PROMPT
  };
}
