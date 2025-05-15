import { WIDGET_CONFIG } from "./config.js";

// Apply CSS variables dynamically
const root = document.documentElement;
Object.entries({
  "--launcher-size": `${WIDGET_CONFIG.launcherSize}px`,
  "--launcher-bg": WIDGET_CONFIG.launcherColor,
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

// Chat widget toggle and handlers
const chatWidget = document.getElementById("chatWidget");
launcher.onclick = () => chatWidget.style.display = chatWidget.style.display === "flex" ? "none" : "flex";

window.handleOption = type => {
  const prompts = {
    home: "What kind of home are you designing?",
    project: "Please share your project ID or details:"
  };
  document.getElementById("userInput").value = prompts[type] || "Please type your question below.";
};

window.submitInput = () => {
  const input = document.getElementById("userInput");
  alert(`Your message: ${input.value} has been noted! A team member will get in touch.`);
  input.value = "";
};
