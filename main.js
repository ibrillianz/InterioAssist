import { handleMessage } from "./engine/src/engine.js";
import { WIDGET_CONFIG, QUESTIONNAIRE_STEPS } from "./config.js";

// 1) Apply CSS vars
const root = document.documentElement;
Object.entries({
  "--launcher-size": `${WIDGET_CONFIG.launcherSize}px`,
  "--launcher-bg":   WIDGET_CONFIG.launcherColor,
  "--launcher-icon": `url('${WIDGET_CONFIG.launcherIcon}')`,
  "--widget-width":  `${WIDGET_CONFIG.widgetWidth}px`,
  "--widget-max-h":  `${WIDGET_CONFIG.widgetMaxHeight}px`,
  "--header-bg":     WIDGET_CONFIG.headerBg,
  "--header-text":   WIDGET_CONFIG.headerText,
  "--bubble-user":   WIDGET_CONFIG.bubbleUserBg,
  "--bubble-hover":  WIDGET_CONFIG.bubbleUserHover,
  "--input-bg":      WIDGET_CONFIG.inputBg,
  "--input-border":  WIDGET_CONFIG.inputBorder,
  "--btn-bg":        WIDGET_CONFIG.buttonBg,
  "--btn-text":      WIDGET_CONFIG.buttonText,
  "--break-point":   `${WIDGET_CONFIG.breakPoint}px`
}).forEach(([k,v]) => root.style.setProperty(k, v));

// 2) Setup launcher & header
const launcher = document.getElementById("chatLauncher");
launcher.style.cssText += `
  width: ${WIDGET_CONFIG.launcherSize}px;
  height: ${WIDGET_CONFIG.launcherSize}px;
  background-color: ${WIDGET_CONFIG.launcherColor};
  background-image: var(--launcher-icon);
`;
document.getElementById("chatHeader").childNodes[0].textContent = WIDGET_CONFIG.botName;

// 3) Questionnaire state
let currentStep = 0;
let responses = {};

// Show a step
function showStep() {
  const { prompt, type, options } = QUESTIONNAIRE_STEPS[currentStep];
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
  } else { // cta
    html += `<p>Thank you! We’ll follow up with you shortly.</p>`;
  }
  content.innerHTML = html;
}

// User picked an option
window.selectOption = async val => {
  responses[QUESTIONNAIRE_STEPS[currentStep].key] = val;
  currentStep++;
  if (currentStep < QUESTIONNAIRE_STEPS.length) showStep();
  else await finalizeFlow();
};

// User typed input
window.submitStep = async () => {
  const inputEl = document.getElementById("userInput");
  const text = inputEl.value.trim();
  if (!text) return;
  responses[QUESTIONNAIRE_STEPS[currentStep].key] = text;
  currentStep++;
  if (currentStep < QUESTIONNAIRE_STEPS.length) showStep();
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
    currentStep = 0;
    responses = {};
    showStep();
  }
};

// Allow Enter key on input
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.activeElement.id === "userInput") {
    window.submitStep();
  }
});

// Start hidden
chatWidget.style.display = "none";
