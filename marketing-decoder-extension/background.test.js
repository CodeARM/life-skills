describe("marketing-decoder-extension background", () => {
  let callClaude;
  let showPanel;
  let SYSTEM_PROMPT;

  beforeEach(() => {
    jest.resetModules();

    document.body.innerHTML = "";

    global.chrome = {
      runtime: { onInstalled: { addListener: jest.fn() } },
      contextMenus: {
        create: jest.fn(),
        onClicked: { addListener: jest.fn() }
      },
      scripting: {
        executeScript: jest.fn()
      },
      storage: {
        local: {
          get: jest.fn().mockResolvedValue({ apiKey: "test-key" })
        }
      }
    };

    global.navigator = {
      clipboard: {
        writeText: jest.fn().mockResolvedValue()
      }
    };

    ({ callClaude, showPanel, SYSTEM_PROMPT } = require("./background.js"));
  });

  afterEach(() => {
    delete global.chrome;
    delete global.navigator;
  });

  test("callClaude sends correct request and returns joined text", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: "Decoded text" }] })
    });

    const result = await callClaude("abc123", "Hello world");

    expect(result).toBe("Decoded text");
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({
      "Content-Type": "application/json",
      "x-api-key": "abc123",
      "anthropic-version": "2023-06-01"
    });

    const body = JSON.parse(options.body);
    expect(body).toEqual({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: "Hello world" }]
    });
  });

  test("callClaude throws with API error message when response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "Invalid API key" } })
    });

    await expect(callClaude("bad-key", "text")).rejects.toThrow("Invalid API key");
  });

  test("showPanel renders loading state and hides copy text", () => {
    showPanel(null, true);

    const panel = document.getElementById("marketing-decoder-panel");
    expect(panel).not.toBeNull();
    expect(panel.querySelector(".md-loading")).not.toBeNull();
    expect(panel.querySelector(".md-copy").textContent).toBe("");
    expect(panel.querySelector(".md-result")).toBeNull();
  });

  test("showPanel sanitizes HTML output, copies text, and closes panel", async () => {
    showPanel("<b>bold</b>", false);

    const panel = document.getElementById("marketing-decoder-panel");
    expect(panel).not.toBeNull();

    const result = panel.querySelector(".md-result");
    expect(result).not.toBeNull();
    expect(result.innerHTML).toContain("&lt;b&gt;bold&lt;/b&gt;");

    const copyBtn = panel.querySelector(".md-copy");
    expect(copyBtn).not.toBeNull();
    expect(copyBtn.textContent).toBe("Copy");

    copyBtn.click();
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith("<b>bold</b>");

    panel.querySelector(".md-close").click();
    expect(document.getElementById("marketing-decoder-panel")).toBeNull();
  });
});
