// config.js
export const WIDGET_CONFIG = {
  botName:        "Design Assistant",           // header title
  launcherSize:   60,                           // px
  launcherColor:  "#C5A880",                    // background of the launcher
  launcherIcon:   "assets/face.png",            // path to your bot avatar
  widgetWidth:    350,                          // px
  widgetMaxHeight:550,                          // px
  widgetBg:       "#FFFFFF",
  headerBg:       "#C5A880",
  headerText:     "#FFFFFF",
  bubbleUserBg:   "#f0f0f0",
  bubbleUserHover:"#ececec",
  inputBg:        "#FFFFFF",
  inputBorder:    "#ddd",
  buttonBg:       "#C5A880",
  buttonText:     "#FFFFFF",
  breakPoint:     600                           // px breakpoint for mobile
};
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
