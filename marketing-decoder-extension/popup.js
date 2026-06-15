const input = document.getElementById("apikey");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");
const toggle = document.getElementById("toggle");

// Load saved key
chrome.storage.local.get("apiKey", ({ apiKey }) => {
  if (apiKey) {
    input.value = apiKey;
    showStatus("Key saved ✓", false);
  }
});

// Toggle visibility
toggle.addEventListener("click", () => {
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  toggle.textContent = isPassword ? "Hide key" : "Show key";
});

// Save key
saveBtn.addEventListener("click", async () => {
  const key = input.value.trim();
  if (!key) {
    showStatus("Please enter a key", true);
    return;
  }
  if (!key.startsWith("sk-ant-")) {
    showStatus("Key should start with sk-ant-", true);
    return;
  }

  await chrome.storage.local.set({ apiKey: key });
  showStatus("Saved! ✓", false);
});

function showStatus(msg, isError) {
  status.textContent = msg;
  status.className = "status" + (isError ? " error" : "");
  if (!isError) {
    setTimeout(() => { if (status.textContent === msg) status.textContent = ""; }, 3000);
  }
}
