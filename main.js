// main.js

import { handleMessage } from "./engine/src/engine.js";
import { calculatePrice } from "./calculator.js";
import { WIDGET_CONFIG, RESIDENTIAL_STEPS, COMMERCIAL_STEPS } from "./config.js";

// --- Define global helpers ---
// Toggle widget open/close
window.toggleChat = () => {
  const chatWidget = document.getElementById("chatWidget");
  const isOpen = chatWidget.style.display === "flex";
  chatWidget.style.display = isOpen ? "none" : "flex";
  if (!isOpen) {
    currentSteps = null;
    currentStep  = 0;
    responses    = {};
    showStep();
  }
};

// Alias submitInput to submitStep (for HTML button)
window.submitInput = window.submitStep;

// Handle initial option buttons
window.handleOption = type => {
  // map home/project/other to questionnaire branches
  if (type === "home")       selectOption("Residential");
  else if (type === "project") selectOption("Commercial");
  else                         selectOption(type);
};

// FAQ stub
window.showFAQ = () => window.open("https://www.tenerinteriors.com/faq", "_blank");

// --- 1) Apply CSS vars ---
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

// --- 2) Setup launcher & header ---
const launcher = document.getElementById("chatLauncher");
launcher.style.cssText += `
  width: ${WIDGET_CONFIG.launcherSize}px;
  height: ${WIDGET_CONFIG.launcherSize}px;
  background-color: ${WIDGET_CONFIG.launcherColor};
  background-image: var(--launcher-icon);
`;

// --- 3) Questionnaire state ---
let currentSteps = null;
let currentStep  = 0;
let responses    = {};

// --- 4) Render a question or CTA ---
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

  // Append FAQ button
  html += `<button class="optionButton" style="margin-top:12px;" onclick="showFAQ()">View FAQ</button>`;

  content.innerHTML = html;
}

// --- 5) Handle option clicks (including first branch) ---
window.selectOption = async val => {
  if (currentSteps === null) {
    responses.projectType = val;
    currentSteps = val === "Commercial" ? COMMERCIAL_STEPS : RESIDENTIAL_STEPS;
    currentStep  = 0;
    showStep();
    return;
  }

  const key = currentSteps[currentStep].key;

  // Intercept estimate (options)
  if (key === "estimate" && val === "Yes") {
    responses[key] = val;
    const cost = calculatePrice(responses);
    document.getElementById("chatContent").innerHTML =
      `<p>Estimated cost: ₹${cost.toLocaleString()}</p>`;
    currentStep++;
    showStep();
    return;
  }

  responses[key] = val;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else showStep();
};

// --- 6) Handle text submissions ---
window.submitStep = async () => {
  const inputEl = document.getElementById("userInput");
  const text    = inputEl.value.trim();
  if (!text) return;

  const key = currentSteps[currentStep].key;

  // Contact Info validation
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

  // Pincode validation
  if (key === "pincode") {
    const pinRe = /^[0-9]{6}$/;
    if (!pinRe.test(text)) {
      alert("⚠️ Please enter a valid 6-digit pincode.");
      return;
    }
  }

  // Estimate intercept (text)
  if (key === "estimate" && text === "Yes") {
    responses[key] = text;
    const cost = calculatePrice(responses);
    document.getElementById("chatContent").innerHTML =
      `<p>Estimated cost: ₹${cost.toLocaleString()}</p>`;
    currentStep++;
    showStep();
    return;
  }

  // Record response and advance
  responses[key] = text;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else showStep();
};

// --- 7) Map CTAs to actions ---
const CTA_ACTIONS = {
  "Book WhatsApp":            () => window.open("https://wa.me/919515210666?text=Hi%20Tener%20Team","_blank"),
  "View Case Studies":        () => window.open("https://www.tenerinteriors.com/commercial-case-studies","_blank"),
  "Speak to Project Manager": () => window.open("https://www.tenerinteriors.com/contact","_blank"),
  "Check Existing Projects":  () => window.open("https://www.tenerinteriors.com/projects","_blank"),
  "Design Gallery":           () => window.open("https://www.tenerinteriors.com/designs","_blank"),
  "FAQ":                      () => window.open("https://www.tenerinteriors.com/faq","_blank")
};
window.handleCTA = async label => {
  const action = CTA_ACTIONS[label];
  if (action) action();
  await finalizeFlow();
};

// --- 8) Finalize and close ---
async function finalizeFlow() {
  // Send responses to Apps Script webhook
  await fetch("https://script.google.com/macros/s/AKfycbz3KixRrhicq9olsfA1H6fha2X7S1OopRjeTjrm1mImpkJnKurbHgvsXJ4WR2tF6f1M/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...responses, ctaChoice: responses.cta })
  });

  const reply = await handleMessage("decobot", JSON.stringify(responses), null);
  alert(reply);
  document.getElementById("chatWidget").style.display = "none";
}

// --- 9) Allow Enter key for input ---
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.activeElement.id === "userInput") {
    submitStep();
  }
});

// --- 10) Initialize hidden ---
document.getElementById("chatWidget").style.display = "none";
