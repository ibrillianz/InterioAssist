// main.js

import { handleMessage }  from "./engine/src/engine.js";
import { calculatePrice } from "./engine/src/calculator.js";
import {
  WIDGET_CONFIG,
  RESIDENTIAL_STEPS,
  COMMERCIAL_STEPS,
  CLIENT_LOCATION,
  VERSION
} from "./config.js";
import { isWithinRadius } from "./engine/src/utils.js";

// Log version & service area
console.log(`DecoBot v${VERSION} — Service area:`, CLIENT_LOCATION);

// --- 1) Define toggleChat before wiring it ---
window.toggleChat = () => {
  const chatWidget = document.getElementById("chatWidget");
  const isOpen     = chatWidget.style.display === "flex";

  if (isOpen && currentSteps !== null && currentStep > 0) {
    alert("We noticed you left the chat. We'll be here whenever you need us!");
  }

  chatWidget.style.display = isOpen ? "none" : "flex";

  if (!isOpen) {
    currentSteps = null;
    currentStep  = 0;
    responses    = {};
    showStep();
  }
};

// --- 2) Grab launcher and attach a single click listener ---
const launcher = document.getElementById("chatLauncher");
launcher.addEventListener("click", toggleChat);

// --- Globals for questionnaire state ---
let currentSteps = null;
let currentStep  = 0;
let responses    = {};

// --- Helper stubs ---
window.selectOption = val => {
  if (currentSteps === null) {
    responses.projectType = val;
    currentSteps = val === "Commercial"
      ? COMMERCIAL_STEPS
      : RESIDENTIAL_STEPS;
    currentStep = 0;
    showStep();
  }
};
window.showFAQ = () =>
  window.open("https://www.tenerinteriors.com/faq", "_blank");

// --- 3) Apply CSS variables dynamically ---
const root = document.documentElement;
Object.entries({
  "--launcher-size": `${WIDGET_CONFIG.launcherSize}px`,
  "--launcher-bg":   "#000000",
  "--launcher-icon": `url('${WIDGET_CONFIG.launcherIcon}')`,
  "--widget-width":  `${WIDGET_CONFIG.widgetWidth}px`,
  "--widget-height": `calc(100vh - (var(--launcher-size) + 40px))`,
  "--header-bg":     "#000000",
  "--header-text":   "#FFFFFF",
  "--bubble-user":   WIDGET_CONFIG.bubbleUserBg,
  "--bubble-hover":  WIDGET_CONFIG.bubbleUserHover,
  "--input-bg":      WIDGET_CONFIG.inputBg,
  "--input-border":  WIDGET_CONFIG.inputBorder,
  "--btn-bg":        "#000000",
  "--btn-text":      "#FFFFFF",
  "--break-point":   `${WIDGET_CONFIG.breakPoint}px`
}).forEach(([k, v]) => root.style.setProperty(k, v));

// --- 4) Render questions or CTAs ---
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
        <input type="text" id="userInput" placeholder="Full Name, Email & Phone (comma-separated)" />
        <button onclick="submitStep()">Send</button>
      </div>
    `;
  } else if (type === "cta") {
    html += options.map(opt =>
      `<button class="optionButton" onclick="handleCTA('${opt}')">${opt}</button>`
    ).join("");
  }

  html += `<button class="optionButton" style="margin-top:12px;" onclick="showFAQ()">View FAQ</button>`;
  content.innerHTML = html;
}

// --- 5) Handle text submissions ---
window.submitStep = async () => {
  const inputEl = document.getElementById("userInput");
  const text    = inputEl.value.trim();
  if (!text) return;

  const key = currentSteps[currentStep].key;

  // Contact info validation
  if (key === "contactInfo") {
    const parts = text.split(",").map(s => s.trim());
    if (parts.length !== 3 || parts[0].split(" ").length < 2) {
      alert("⚠️ Please enter Full Name, Email & Phone (comma-separated), with full name.");
      return;
    }
    const [ , email, phone ] = parts;
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRe = /^[6-9]\d{9}$/;
    if (!emailRe.test(email) || !phoneRe.test(phone)) {
      alert("⚠️ Please enter a valid email and 10-digit mobile number starting with 6-9.");
      return;
    }
  }

  // Pincode + service-area check
  if (key === "pincode") {
    const pinRe = /^[0-9]{6}$/;
    if (!pinRe.test(text) || !(await isWithinRadius(text))) {
      alert("⚠️ Enter a valid 6-digit pincode within your service area.");
      return;
    }
  }

  // Inline estimate for options step
if (key === "estimate" && text === "Yes") {
  responses[key] = text;
  const cost = calculatePrice(responses);
  document.getElementById("chatContent").innerHTML =
    `<p>Estimated cost: ₹${cost.toLocaleString()}</p>`;
  currentStep++;
  showStep();
  return;
}

  // Record and advance
  responses[key] = text;
  currentStep++;
  if (currentStep < currentSteps.length) showStep();
  else showStep();
};

// Alias for send button
window.submitInput = window.submitStep;

// --- 6) Map CTAs to actions ---
const CTA_ACTIONS = {
  "Explore Our Gallery":    () => window.open("https://www.tenerinteriors.com/designs","_blank"),
  "View Completed Projects":() => window.open("https://www.tenerinteriors.com/projects","_blank"),
  "View FAQ":               () => window.open("https://www.tenerinteriors.com/faq","_blank")
};
window.handleCTA = async label => {
  const action = CTA_ACTIONS[label];
  if (action) action();
  await finalizeFlow();
};

// --- 7) Finalize: webhook, AI reply, close ---
async function finalizeFlow() {
  await fetch(CLIENT_LOCATION.webhookUrl || "<your-webhook-url>", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(responses)
  });
  const reply = await handleMessage("decobot", JSON.stringify(responses), null);
  alert(reply);
  document.getElementById("chatWidget").style.display = "none";
}

// --- 8) Initialize hidden ---
document.getElementById("chatWidget").style.display = "none";
