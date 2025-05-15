import { WIDGET_CONFIG } from "./config.js";

// Apply CSS variables dynamically
const root = document.documentElement;
root.style.setProperty("--launcher-size", `${WIDGET_CONFIG.launcherSize}px`);
root.style.setProperty("--launcher-bg", WIDGET_CONFIG.launcherColor);
root.style.setProperty("--widget-width", `${WIDGET_CONFIG.widgetWidth}px`);
root.style.setProperty("--widget-max-h", `${WIDGET_CONFIG.widgetMaxHeight}px`);
root.style.setProperty("--header-bg", WIDGET_CONFIG.headerBg);
root.style.setProperty("--header-text", WIDGET_CONFIG.headerText);
root.style.setProperty("--bubble-user", WIDGET_CONFIG.bubbleUserBg);
root.style.setProperty("--bubble-hover", WIDGET_CONFIG.bubbleUserHover);
root.style.setProperty("--input-bg", WIDGET_CONFIG.inputBg);
root.style.setProperty("--input-border", WIDGET_CONFIG.inputBorder);
root.style.setProperty("--btn-bg", WIDGET_CONFIG.buttonBg);
root.style.setProperty("--btn-text", WIDGET_CONFIG.buttonText);
root.style.setProperty("--break-point", `${WIDGET_CONFIG.breakPoint}px`);

// Configure launcher
const launcher = document.getElementById("chatLauncher");
launcher.style.width = `${WIDGET_CONFIG.launcherSize}px`;
launcher.style.height = `${WIDGET_CONFIG.launcherSize}px`;
launcher.style.backgroundColor = WIDGET_CONFIG.launcherColor;
launcher.style.backgroundImage = `url('${WIDGET_CONFIG.launcherIcon}')`;

// Configure header title
const headerTitleNode = document.getElementById("chatHeader").childNodes[0];
headerTitleNode.textContent = WIDGET_CONFIG.botName;

// Chat widget logic
const chatWidget = document.getElementById("chatWidget");
const launcherIcon = document.getElementById("chatLauncher");
const closeBtn = document.getElementById("closeBtn");
const userInput = document.getElementById("userInput");

launcherIcon.onclick = toggleChat;
closeBtn.onclick = toggleChat;

function toggleChat() {
  chatWidget.style.display = chatWidget.style.display === "flex" ? "none" : "flex";
}

function handleOption(type) {
  if (type === "home") {
    userInput.value = "What kind of home are you designing?";
  } else if (type === "project") {
    userInput.value = "Please share your project ID or details:";
  } else {
    userInput.value = "Please type your question below.";
  }
}

window.handleOption = handleOption;

function submitInput() {
  const value = userInput.value;
  alert(`Your message: ${value} has been noted! A team member will get in touch.`);
  userInput.value = "";
}

window.submitInput = submitInput;
