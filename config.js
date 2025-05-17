// config.js

export const WIDGET_CONFIG = {
  botName:         "Design Assistant",           // header title
  launcherSize:    60,                           // launcher diameter in px
  launcherColor:   "#C5A880",                    // background color of the launcher
  launcherIcon:    "assets/face.png",            // path to your bot avatar image
  widgetWidth:     350,                          // chat widget width in px
  widgetMaxHeight: 550,                          // max chat widget height in px
  widgetBg:        "#FFFFFF",                    // chat widget background color
  headerBg:        "#C5A880",                    // header background color
  headerText:      "#FFFFFF",                    // header text color
  bubbleUserBg:    "#f0f0f0",                    // user message bubble background
  bubbleUserHover: "#ececec",                    // user bubble hover background
  inputBg:         "#FFFFFF",                    // input field background
  inputBorder:     "#ddd",                       // input field border color
  buttonBg:        "#C5A880",                    // button background color
  buttonText:      "#FFFFFF",                    // button text color
  breakPoint:      600                           // mobile breakpoint in px
};

// Semantic version
export const VERSION = "5.8";

// Where to POST inquiries / estimates
export const CLIENT_LOCATION = {
  serviceAreaKm: 80,
  webhookUrl:    "https://script.google.com/macros/s/AKfycbz3KixRrhicq9olsfA1H6fha2X7S1OopRjeTjrm1mImpkJnKurbHgvsXJ4WR2tF6f1M/exec"
};

// Steps for Residential flow
export const RESIDENTIAL_STEPS = [
  { key: "projectType", prompt: "What type of project are you working on?",             type: "options", options: ["Residential","Commercial"] },
  { key: "spaceType",   prompt: "What space are you designing? (e.g. Full Home, Kitchen)", type: "options", options: ["Full Home","Kitchen","Bedroom","Living Room","Other"] },
  { key: "contactInfo", prompt: "Enter Full Name, Email & Phone (comma-separated):",      type: "input"   },
  { key: "finishTier",  prompt: "Select your finish tier:",                              type: "options", options: ["Economy","Standard","Premium"] },
  { key: "timeline",    prompt: "When would you like to start?",                         type: "options", options: ["Immediate","Within 30 Days","3–6 Months","Not Sure"] },
  { key: "areaSqft",    prompt: "Approximate area (in sq.ft)?",                          type: "input"   },
  { key: "pincode",     prompt: "What’s your project pincode? (Hyderabad area only)",    type: "input"   },
  { key: "estimate",    prompt: "Would you like a price estimate?",                     type: "options", options: ["Yes","No"] },
  { key: "cta",         prompt: "Thank you! How can we proceed?",                       type: "options", options: ["Explore Our Gallery","View Completed Projects","View FAQ"] }
];

// Steps for Commercial flow
export const COMMERCIAL_STEPS = [
  { key: "projectType", prompt: "What kind of commercial space are you designing?",       type: "options", options: ["Office","Retail Store","Restaurant/Café","Hospitality","Other"] },
  { key: "spaceSpec",   prompt: "Select the area you’re outfitting (e.g. Workstations):", type: "options", options: ["Workstations","Meeting Rooms","Reception","Retail Floor","Other"] },
  { key: "contactInfo", prompt: "Enter Company Name, Contact Person, Email & Phone:",    type: "input"   },
  { key: "finishTier",  prompt: "Which budget tier suits your project?",                type: "options", options: ["Economy","Standard","Premium"] },
  { key: "timeline",    prompt: "When do you need it completed?",                       type: "options", options: ["Within 1 Month","1–3 Months","3–6 Months","Flexible"] },
  { key: "areaSqft",    prompt: "Approximate area (in sq.ft)?",                         type: "input"   },
  { key: "pincode",     prompt: "What’s the project pincode? (Hyderabad area only)",    type: "input"   },
  { key: "estimate",    prompt: "Would you like an estimated cost?",                    type: "options", options: ["Yes","No"] },
  { key: "cta",         prompt: "Thank you! How can we proceed?",                       type: "options", options: ["Explore Our Gallery","View Completed Projects","View FAQ"] }
];
