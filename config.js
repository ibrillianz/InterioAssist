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
export const QUESTIONNAIRE_STEPS = [
  { key: "projectType",  prompt: "What type of project are you working on?", type: "options", options: ["Residential","Commercial"] },
  { key: "spaceType",    prompt: "What space are you designing? (Full Home, Kitchen, Bedroom, etc.)", type: "options", options: ["Full Home","Kitchen","Bedroom","Living Room","Other"] },
  { key: "contactInfo",  prompt: "Please enter your Name, Email & Phone:", type: "input" },
  { key: "finishTier",   prompt: "Select your finish tier:", type: "options", options: ["Budget","Premium","Luxe"] },
  { key: "timeline",     prompt: "When would you like to start your project?", type: "options", options: ["Immediate","Within 30 Days","3–6 Months","Not Sure"] },
  { key: "pincode",      prompt: "What’s your project pincode? (Hyderabad area only)", type: "input" },
  { key: "estimate",     prompt: "Would you like a price estimate?", type: "options", options: ["Yes","No"] },
  { key: "cta",          prompt: "Thank you! We’ll follow up with you shortly.", type: "cta" }
];
