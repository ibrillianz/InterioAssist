// main.js

import { handleMessage } from "./engine/src/engine.js";
import { calculatePrice } from "./calculator.js";
import { WIDGET_CONFIG, RESIDENTIAL_STEPS, COMMERCIAL_STEPS } from "./config.js";

// ... existing code ...
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

// ... existing code ...
const launcher = document.getElementById("chatLauncher");
launcher.style.cssText += `
  width: ${WIDGET_CONFIG.launcherSize}px;
  height: ${WIDGET_CONFIG.launcherSize}px;
  background-color: ${WIDGET_CONFIG.launcherColor};
  background-image: var(--launcher-icon);
`;
document.getElementById("chatHeader").childNodes[0].textContent = WIDGET_CONFIG.botName;

// ... existing code ...
let currentSteps = null;
let currentStep  = 0;
let responses    = {};

// ... existing code ...
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
    html += options.map(opt =>
      `<button class="optionButton" onclick="handleCTA('${opt}')">${opt}</button>`
    ).join("");
  }

  content.innerHTML = html;
}

// ... existing code ...
window.selectOption = async val => {
  if (currentSteps === null) {
    responses.projectType = val;
    currentSteps = (val === "Commercial") ? COMMERCIAL_STEPS : RESIDENTIAL_STEPS;
    currentStep  = 0;
    showStep();
    return;
  }

  const key = currentSteps[currentStep].key;

  // ⬇️ Intercept the “estimate” answer for options-based selection
  if (key === "estimate" && val === "Yes") {
    responses[key] = val;
    const cost = calculatePrice(responses);
    const content = document.getElementById("chatContent");
    content.innerHTML = `<p>Estimated cost: ₹${cost.toLocaleString()}</p>`;
    currentStep++;
    showStep();  // proceed to CTA step
    return;
  }

  responses[key] = val;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else showStep();  // render CTA step
};

// ... existing code ...
window.submitStep = async () => {
  const inputEl = document.getElementById("userInput");
  const text    = inputEl.value.trim();
  if (!text) return;

  const key = currentSteps[currentStep].key;

  if (key === "contactInfo") {
    const parts = text.split(",").map(s => s.trim());
    if (parts.length !== 3) {
      alert("⚠️ Please enter Name, Email & Phone separated by commas.");
      return;
    }
    const [name, email, phone] = parts;
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRe = /^[6-9]\d{9}$/;
    if (!emailRe.test(email)) {
      alert("⚠️ Please enter a valid email (e.g., john@example.com).");
      return;
    }
    if (!phoneRe.test(phone)) {
      alert("⚠️ Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }
  }

  // ⬇️ Intercept the “estimate” answer for text-based input (if ever used)
  if (key === "estimate" && text === "Yes") {
    responses[key] = text;
    const cost = calculatePrice(responses);
    const content = document.getElementById("chatContent");
    content.innerHTML = `<p>Estimated cost: ₹${cost.toLocaleString()}</p>`;
    currentStep++;
    showStep();  // proceed to CTA step
    return;
  }

  responses[key] = text;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else showStep();  // render CTA step
};

// ... existing code ...
const CTA_ACTIONS = {
  /* ... */
};

window.handleCTA = async label => {
  /* ... */
};

// ... existing code ...
async function finalizeFlow() { /* ... */ }
const chatWidget = document.getElementById("chatWidget");
launcher.onclick = () => { /* ... */ };
document.addEventListener("keydown", e => { /* ... */ });
chatWidget.style.display = "none";
