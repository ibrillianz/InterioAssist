// config.js

// Widget display version
export const VERSION = "5.7";

// Client’s service area configuration
export const CLIENT_LOCATION = {
  center: { lat: 17.3850, lon: 78.4867 },  // Hyderabad center coordinates
  radiusKm: 80                             // Service radius in kilometers
};

// Main widget configuration
export const WIDGET_CONFIG = {
  botName:        "Design Assistant",           // header title
  launcherSize:   60,                           // px
  launcherColor:  "#C5A880",                    // background of the launcher
  launcherIcon:   "assets/face_new.png",        // path to your bot avatar
  widgetWidth:    350,                          // px
  widgetMaxHeight:550,                          // px
  widgetBg:       "#FFFFFF",                    // widget background color
  headerBg:       "#C5A880",                    // header background color
  headerText:     "#FFFFFF",                    // header text color
  bubbleUserBg:   "#f0f0f0",                    // user-bubble background
  bubbleUserHover:"#ececec",                    // user-bubble hover background
  inputBg:        "#FFFFFF",                    // input field background
  inputBorder:    "#ddd",                       // input border color
  buttonBg:       "#C5A880",                    // button background
  buttonText:     "#FFFFFF",                    // button text color
  breakPoint:     600                           // px breakpoint for mobile
};

// Questionnaire steps for residential projects
export const RESIDENTIAL_STEPS = [
  // ... existing residential steps ...
];

// Questionnaire steps for commercial projects
export const COMMERCIAL_STEPS = [
  // ... existing commercial steps ...
];

// 1) Residential flow
export const RESIDENTIAL_STEPS = [
  { key: "projectType",  prompt: "What type of project are you working on?",                     type: "options", options: ["Residential","Commercial"] },
  { key: "spaceType",    prompt: "What space are you designing? (Full Home, Kitchen, Bedroom, etc.)", type: "options", options: ["Full Home","Kitchen","Bedroom","Living Room","Other"] },
  { key: "contactInfo",  prompt: "Please enter your Name, Email & Phone:",                        type: "input" },
  { key: "finishTier",   prompt: "Select your finish tier:",                                      type: "options", options: ["Economy","Standard","Premium"] },
  { key: "timeline",     prompt: "When would you like to start your project?",                    type: "options", options: ["Immediate","Within 30 Days","3–6 Months","Not Sure"] },
  { key: "pincode",      prompt: "What’s your project pincode? (Hyderabad area only)",           type: "input" },
  { key: "estimate",     prompt: "Would you like a price estimate?",                              type: "options", options: ["Yes","No"] },
  { key: "cta",          prompt: "Thank you! We’ll follow up with you shortly.",                   type: "cta" }
];

// 2) Commercial flow
export const COMMERCIAL_STEPS = [
  { key: "projectType", prompt: "What kind of commercial space are you designing?",              type: "options", options: ["Office","Retail Store","Restaurant/Café","Hospitality","Other"] },
  { key: "spaceSpec",   prompt: "Please select the area you’re outfitting.",                      type: "options", options: ["Workstations","Meeting Rooms","Reception","Retail Floor","Other"] },
  { key: "contactInfo", prompt: "Enter Company Name, Contact Person, Email & Phone (comma-separated).", type: "input" },
  { key: "budgetTier",  prompt: "Which budget tier suits your project?",                         type: "options", options: ["Economy","Standard","Premium"] },
  { key: "timeline",    prompt: "When do you need this completed?",                              type: "options", options: ["Within 1 Month","1–3 Months","3–6 Months","Flexible"] },
  { key: "pincode",     prompt: "What’s the project pincode? (Hyderabad area only)",           type: "input" },
  { key: "estimate",    prompt: "Would you like an estimated cost?",                             type: "options", options: ["Yes","No"] },
  { key: "cta",         prompt: "Thank you! How would you like to proceed?",                    type: "options", options: ["Book WhatsApp","View Case Studies","Speak to Project Manager"] }
];
