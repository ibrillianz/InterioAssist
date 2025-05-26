// main.js (safe public version)

// --- 1) Safe wrapper to send requests to private engine ---
window.callBotAPI = async (type, data) => {
  if (window.DecoEngine && window.DecoEngine.handle) {
    return await window.DecoEngine.handle(type, data);
  } else {
    console.warn("DecoEngine not available.");
    return "Error: Engine not ready.";
  }
};

// --- 2) Chat toggler ---
window.toggleChat = () => {
  const chatWidget = document.getElementById("chatWidget");
  const isOpen = chatWidget.style.display === "flex";
  chatWidget.style.display = isOpen ? "none" : "flex";
};

// --- 2a) Bind the launcher to toggleChat ---
window.addEventListener('DOMContentLoaded', () => {
  const launcher = document.getElementById('chatLauncher');
  if (launcher) {
    launcher.addEventListener('click', window.toggleChat);
  } else {
    console.warn('⚠️ chatLauncher element not found');
  }
});


// --- 3) Demo input (placeholder) ---
window.submitInput = async () => {
  const inputEl = document.getElementById("userInput");
  const value = inputEl.value.trim();
  if (!value) return;

  const response = await window.callBotAPI("estimate", value);
  alert("Simulated Response: " + response);
};
