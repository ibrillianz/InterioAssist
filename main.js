import { handleMessage } from "./engine/src/engine.js";
import { WIDGET\_CONFIG, RESIDENTIAL\_STEPS, COMMERCIAL\_STEPS } from "./config.js";

// 1) Apply CSS vars
const root = document.documentElement;
Object.entries({
"--launcher-size": `${WIDGET_CONFIG.launcherSize}px`,
"--launcher-bg":   WIDGET\_CONFIG.launcherColor,
"--launcher-icon": `url('${WIDGET_CONFIG.launcherIcon}')`,
"--widget-width":  `${WIDGET_CONFIG.widgetWidth}px`,
"--widget-max-h":  `${WIDGET_CONFIG.widgetMaxHeight}px`,
"--header-bg":     WIDGET\_CONFIG.headerBg,
"--header-text":   WIDGET\_CONFIG.headerText,
"--bubble-user":   WIDGET\_CONFIG.bubbleUserBg,
"--bubble-hover":  WIDGET\_CONFIG.bubbleUserHover,
"--input-bg":      WIDGET\_CONFIG.inputBg,
"--input-border":  WIDGET\_CONFIG.inputBorder,
"--btn-bg":        WIDGET\_CONFIG.buttonBg,
"--btn-text":      WIDGET\_CONFIG.buttonText,
"--break-point":   `${WIDGET_CONFIG.breakPoint}px`
}).forEach((\[k,v]) => root.style.setProperty(k, v));

// 2) Setup launcher & header
const launcher = document.getElementById("chatLauncher");
launcher.style.cssText += `  width: ${WIDGET_CONFIG.launcherSize}px;
  height: ${WIDGET_CONFIG.launcherSize}px;
  background-color: ${WIDGET_CONFIG.launcherColor};
  background-image: var(--launcher-icon);`;
document.getElementById("chatHeader").childNodes\[0].textContent = WIDGET\_CONFIG.botName;

// 3) Questionnaire state
let currentSteps = null;
let currentStep = 0;
let responses = {};

// Show a step
function showStep() {
  const { prompt, type, options } = currentSteps[currentStep];
  const content = document.getElementById("chatContent");
  let html = `<p>${prompt}</p>`;

  if (type === "options") {
    html += options.map(opt =>
      `<button class="optionButton" onclick="selectOption('${opt}')">${opt}</button>`
    ).join("");
  } else if (type === "input") {
    html += `
      <div id="inputField">
        <input type="text" id="userInput" placeholder="Type here…" />
        <button onclick="submitStep()">Send</button>
      </div>
    `;
  } 
  // HIGHLIGHT
  else if (type === "cta") {
    // Final CTA step: immediately finish without rendering duplicate message
    finalizeFlow();
    return;
  }
  content.innerHTML = html;
}

// User picked an option
window\.selectOption = async val => {
// First answer determines branch
if (currentSteps === null) {
responses.projectType = val;
currentSteps = (val === "Commercial") ? COMMERCIAL\_STEPS : RESIDENTIAL\_STEPS;
currentStep = 0;
showStep();
return;
}
// Record response and advance
const key = currentSteps\[currentStep].key;
responses\[key] = val;
currentStep++;
if (currentStep < currentSteps.length) showStep();
else await finalizeFlow();
};

// User typed input
window\.submitStep = async () => {
const inputEl = document.getElementById("userInput");
const text = inputEl.value.trim();
if (!text) return;
const key = currentSteps\[currentStep].key;
responses\[key] = text;
currentStep++;
if (currentStep < currentSteps.length) showStep();
else await finalizeFlow();
};

// End of flow: call engine and close
async function finalizeFlow() {
const reply = await handleMessage("decobot", JSON.stringify(responses), null);
alert(reply);
document.getElementById("chatWidget").style.display = "none";
}

// 4) Toggle and initialize
const chatWidget = document.getElementById("chatWidget");
launcher.onclick = () => {
const isOpen = chatWidget.style.display === "flex";
chatWidget.style.display = isOpen ? "none" : "flex";
if (!isOpen) {
currentSteps = null;
currentStep = 0;
responses = {};
showStep();
}
};

// Allow Enter key on input
document.addEventListener("keydown", e => {
if (e.key === "Enter" && document.activeElement.id === "userInput") {
submitStep();
}
});

// Start hidden
chatWidget.style.display = "none";
