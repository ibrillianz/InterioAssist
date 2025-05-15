import { handleMessage } from "./engine/src/engine.js";
import { WIDGET_CONFIG } from "./config.js";

// Apply CSS variables dynamically
const root = document.documentElement;
Object.entries({
  "--launcher-size": `${WIDGET_CONFIG.launcherSize}px`,
  "--launcher-bg": WIDGET_CONFIG.launcherColor,
  "--launcher-icon": `url('${WIDGET_CONFIG.launcherIcon}')`,
  "--widget-width": `${WIDGET_CONFIG.widgetWidth}px`,
  "--widget-max-h": `${WIDGET_CONFIG.widgetMaxHeight}px`,
  "--header-bg": WIDGET_CONFIG.headerBg,
  "--header-text": WIDGET_CONFIG.headerText,
  "--bubble-user": WIDGET_CONFIG.bubbleUserBg,
  "--bubble-hover": WIDGET_CONFIG.bubbleUserHover,
  "--input-bg": WIDGET_CONFIG.inputBg,
  "--input-border": WIDGET_CONFIG.inputBorder,
  "--btn-bg": WIDGET_CONFIG.buttonBg,
  "--btn-text": WIDGET_CONFIG.buttonText,
  "--break-point": `${WIDGET_CONFIG.breakPoint}px`
}).forEach(([prop, value]) => root.style.setProperty(prop, value));

// Configure launcher & header
const launcher = document.getElementById("chatLauncher");
launcher.style.cssText += `
  width: ${WIDGET_CONFIG.launcherSize}px;
  height: ${WIDGET_CONFIG.launcherSize}px;
  background-color: ${WIDGET_CONFIG.launcherColor};
  background-image: url('${WIDGET_CONFIG.launcherIcon}');
`;
const header = document.getElementById("chatHeader");
header.childNodes[0].textContent = WIDGET_CONFIG.botName;

// Chat widget toggle
const chatWidget = document.getElementById("chatWidget");
launcher.onclick = () => {
  chatWidget.style.display = chatWidget.style.display === "flex" ? "none" : "flex";
};

// Step handlers (placeholder, to be replaced by questionnaire)
window.handleOption = type => {
  const prompts = {
    home: "What kind of home are you designing?",
    project: "Please share your project ID or details:"
  };
  document.getElementById("userInput").value = prompts[type] || "Please type your question below.";
};

// Submit input via engine
async function submitInput() {
  const inputEl = document.getElementById("userInput");
  const userText = inputEl.value.trim();
  if (!userText) return; // ignore empty
  // call engine
  try {
    const reply = await handleMessage("decobot", userText, null);
    alert(reply);
  } catch (e) {
    console.error(e);
    alert("Error contacting bot. Please try again later.");
  }
  inputEl.value = "";
}

// Expose for onclick
window.submitInput = submitInput;

// Allow Enter key to send
const inputField = document.getElementById("userInput");
inputField.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    submitInput();
  }
});
