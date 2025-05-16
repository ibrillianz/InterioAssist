import { handleMessage } from "./engine/src/engine.js";
import { WIDGET_CONFIG, RESIDENTIAL_STEPS, COMMERCIAL_STEPS } from "./config.js";

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
}).forEach(([k, v]) => root.style.setProperty(k, v));

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
let currentSteps = null;
let currentStep  = 0;
let responses    = {};

// 4) Render a question or CTA
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
  } else if (type === "cta") {
    // Final CTAs
    html += options.map(opt =>
      `<button class="optionButton" onclick="handleCTA('${opt}')">${opt}</button>`
    ).join("");
  }

  content.innerHTML = html;
}

// 5) Handle option clicks (including first branch)
window.selectOption = async val => {
  // First answer = projectType branch selector
  if (currentSteps === null) {
    responses.projectType = val;
    currentSteps = (val === "Commercial") ? COMMERCIAL_STEPS : RESIDENTIAL_STEPS;
    currentStep  = 0;
    showStep();
    return;
  }

  // Record response and advance
  const key = currentSteps[currentStep].key;
  responses[key] = val;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else finalizeFlow();  // after last step we’ll render CTAs, not auto-close
};

// 6) Handle text submissions
window.submitStep = async () => {
  const inputEl = document.getElementById("userInput");
  const text    = inputEl.value.trim();
  if (!text) return;

  const key = currentSteps[currentStep].key;
  responses[key] = text;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else finalizeFlow();
};

// 7) Map CTAs to actions
const CTA_ACTIONS = {
  "Book WhatsApp":       () => window.open("https://wa.me/919515210666?text=Hi%20Tener%20Team", "_blank"),
  "View Case Studies":   () => window.open("https://www.tenerinteriors.com/commercial-case-studies", "_blank"),
  "Speak to Project Manager": () => window.open("https://www.tenerinteriors.com/contact", "_blank"),
  "Check Existing Projects":   () => window.open("https://www.tenerinteriors.com/projects", "_blank"),
  "Design Gallery":             () => window.open("https://www.tenerinteriors.com/designs", "_blank"),
  "FAQ":                        () => window.open("https://www.tenerinteriors.com/faq", "_blank")
};

window.handleCTA = async label => {
  const action = CTA_ACTIONS[label];
  if (action) action();
  await finalizeFlow();
};

// 8) Finalize: send to engine, then close
async function finalizeFlow() {
  const reply = await handleMessage("decobot", JSON.stringify(responses), null);
  alert(reply);
  document.getElementById("chatWidget").style.display = "none";
}

// 9) Toggle widget open/close
const chatWidget = document.getElementById("chatWidget");
launcher.onclick = () => {
  const isOpen = chatWidget.style.display === "flex";
  chatWidget.style.display = isOpen ? "none" : "flex";
  if (!isOpen) {
    currentSteps = null;
    currentStep  = 0;
    responses    = {};
    showStep();
  }
};

// 10) Send on Enter key
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.activeElement.id === "userInput") {
    submitStep();
  }
});

// 11) Initialize hidden
chatWidget.style.display = "none";
