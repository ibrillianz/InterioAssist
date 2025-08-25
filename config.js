// config.js

// ========== Widget Appearance and Branding ==========
export const WIDGET_CONFIG = {
  botName:         "Design Assistant",
  launcherSize:    60,
  launcherColor:   "#C5A880",
  launcherIcon:    "assets/face.png",
  widgetWidth:     350,
  widgetMaxHeight: 550,
  widgetBg:        "#FFFFFF",
  headerBg:        "#C5A880",
  headerText:      "#FFFFFF",
  bubbleUserBg:    "#f0f0f0",
  bubbleUserHover: "#ececec",
  inputBg:         "#FFFFFF",
  inputBorder:     "#ddd",
  buttonBg:        "#C5A880",
  buttonText:      "#FFFFFF",
  breakPoint:      600
};

export const VERSION = "6.0";

// ========== Client-Specific Branding (CONFIGURABLE) ==========
export const CLIENT_BRANDING = {
  companyName: "Your Interior Business",
  welcomeMessage: "Welcome! I'm here to help you get the perfect quote for your project.",
  ctaMessage: "Ready to get started? I'll submit your details and our team will contact you within 24 hours!",
  ctaButtonText: "Yes, Get My Free Consultation!",
  successTitle: "Quote Request Submitted!",
  successMessage: "Thank you! We'll contact you within 24 hours with your personalized quote.",
  whatsappUrl: "https://wa.me/your-number?text=Hi%2C%20I%20just%20submitted%20a%20quote%20request",
  whatsappText: "WhatsApp Us Now"
};

// ========== API and Storage ==========
export const BOT_ENGINE_CONFIG = {
  apiBaseUrl: "https://bot-engine-api.vercel.app",
  clientId: "generic_interior_client",
  apiKey: process.env.BOT_ENGINE_API_KEY || "demo-key"
};

// ========== Enhanced Validation Configuration ==========
export const VALIDATION_CONFIG = {
  // Phone number patterns for different countries
  phonePatterns: {
    india: /^(\+91)?[6-9]\d{9}$/,
    uae: /^(\+971)?5\d{8}$/,
    australia: /^(\+61)?4\d{8}$/,
    saudi: /^(\+966)?5\d{8}$/,
    uk: /^(\+44)?7\d{9}$/,
    international: /^\+\d{7,15}$/
  },

  // Phone number formatters
  phoneFormatters: {
    india: (phone) => {
      const number = phone.replace(/^\+91/, '').slice(-10);
      return `+91-${number.slice(0, 5)}-${number.slice(5)}`;
    },
    uae: (phone) => {
      const number = phone.replace(/^\+971/, '').slice(-9);
      return `+971-${number.slice(0, 1)}-${number.slice(1)}`;
    },
    australia: (phone) => {
      const number = phone.replace(/^\+61/, '').slice(-9);
      return `+61-${number.slice(0, 3)}-${number.slice(3)}`;
    },
    saudi: (phone) => {
      const number = phone.replace(/^\+966/, '').slice(-9);
      return `+966-${number.slice(0, 1)}-${number.slice(1)}`;
    },
    uk: (phone) => {
      const number = phone.replace(/^\+44/, '').slice(-10);
      return `+44-${number.slice(0, 4)}-${number.slice(4)}`;
    }
  },

  // Email validation configuration
  email: {
    minLength: 5,
    maxLength: 254,
    maxLocalPart: 64,
    regex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    dangerousChars: /[<>\"'&]/,
    commonDomains: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'],
    suspiciousDomains: ['gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com', 'outlok.com']
  },

  // Name validation configuration
  name: {
    minLength: 2,
    maxLength: 50,
    allowedChars: /^[a-zA-Z\s.'-]+$/,
    spamPattern: /(.)\1{4,}/ // 5+ repeated characters
  },

  // Area validation configuration
  area: {
    min: 100,
    max: 50000
  },

  // Postal code patterns for different countries
  postcodePatterns: {
    India: /^\d{6}$/,
    UAE: /^\d{5,6}$/,
    Australia: /^\d{4}$/,
    'Saudi Arabia': /^\d{5}$/,
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i
  },

  // Generic input sanitization
  generic: {
    maxLength: 500,
    dangerousChars: /[<>\"'&]/g
  },

  // Input placeholders for different fields
  placeholders: {
    userName: 'Enter your full name (e.g., John Smith)',
    userPhone: 'Enter phone with country code (e.g., +91 9876543210)',
    userEmail: 'Enter your email (e.g., john@gmail.com)',
    areaSqft: 'Enter area in sq.ft (e.g., 1200)',
    pincode: 'Enter postal/PIN code (e.g., 500001)'
  },

  // Error messages for different validation failures
  errorMessages: {
    phone: {
      invalid: 'Please enter a valid mobile number with country code',
      missingCountryCode: 'Please include your country code (e.g., +91 for India, +971 for UAE)',
      tooShort: 'Phone number is too short',
      tooLong: 'Phone number is too long'
    },
    email: {
      invalid: 'Please enter a valid email address',
      tooShort: 'Email is too short',
      tooLong: 'Email is too long',
      multipleAt: 'Email can only contain one @ symbol',
      invalidChars: 'Email contains invalid characters'
    },
    name: {
      tooShort: 'Name must be at least 2 characters long',
      tooLong: 'Name is too long (maximum 50 characters)',
      invalidChars: 'Name can only contain letters, spaces, and basic punctuation',
      spam: 'Please enter a valid name'
    }
  },

  // Supported countries for expansion
  supportedCountries: [
    { code: 'IN', name: 'India', flag: '🇮🇳', phonePrefix: '+91' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', phonePrefix: '+971' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', phonePrefix: '+61' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', phonePrefix: '+966' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phonePrefix: '+44' }
  ]
};

// ========== Bot Personalities ==========
export const BOT_PERSONALITIES = [
  {
    key: "kavya",
    name: "Kavya",
    tagline: "Premium Residential Expert",
    avatar: "👩‍🎨",
    priceMultiplier: 1.4,
    projectType: "residential",
    greeting: "Namaste! I'm Kavya, your premium residential design specialist.",
    serviceDescription: "Luxury interiors. Custom furniture. High-end finishes."
  },
  {
    key: "arjun",
    name: "Arjun",
    tagline: "Mid-Range Residential Expert",
    avatar: "👨‍💼",
    priceMultiplier: 1.0,
    projectType: "residential",
    greeting: "Hi! I'm Arjun, and I specialize in functional, beautiful homes.",
    serviceDescription: "Quality materials. Modular solutions. Smart budgets."
  },
  {
    key: "priya",
    name: "Priya",
    tagline: "Budget Residential Expert",
    avatar: "👩‍🔧",
    priceMultiplier: 0.7,
    projectType: "residential",
    greeting: "Hello! I'm Priya, your budget-friendly design expert.",
    serviceDescription: "Cost-effective, practical, and stylish homes."
  },
  {
    key: "rohan",
    name: "Rohan",
    tagline: "Commercial Space Expert",
    avatar: "👨‍💻",
    priceMultiplier: 1.2,
    projectType: "commercial",
    greeting: "Namaste! I'm Rohan, your commercial design specialist.",
    serviceDescription: "Productive offices, retail stores, restaurants."
  }
];

// ========== Step Flows ==========

// MATERIAL QUESTIONS LOGIC
export const RES_MATERIAL_QUESTIONS = {
  "Full Home": [
    { key: "flooring", prompt: "Choose flooring type:", options: ["Marble/Granite", "Premium Tiles", "Engineered Wood", "Laminate", "Standard Tiles", "Vinyl"] },
    { key: "wardrobe", prompt: "Wardrobe style (for bedrooms):", options: ["Custom Built-in", "Modular", "Ready-made", "None"] },
    { key: "windowSeating", prompt: "Need window seating anywhere?", options: ["Yes", "No"] },
    { key: "kitchen", prompt: "Kitchen module preference:", options: ["Premium Modular", "Standard Modular", "Semi-Modular", "Basic"] },
    { key: "lighting", prompt: "Lighting quality:", options: ["Designer", "Premium", "Standard", "Basic"] },
    { key: "paint", prompt: "Paint quality:", options: ["Premium", "Standard", "Economy"] }
  ],
  "Kitchen": [
    { key: "kitchen", prompt: "Kitchen module preference:", options: ["Premium Modular", "Standard Modular", "Semi-Modular", "Basic"] },
    { key: "flooring", prompt: "Kitchen flooring type:", options: ["Premium Tiles", "Standard Tiles", "Vinyl"] },
    { key: "lighting", prompt: "Lighting quality:", options: ["Premium", "Standard", "Basic"] },
    { key: "paint", prompt: "Paint quality:", options: ["Premium", "Standard", "Economy"] }
  ],
  "Bedroom": [
    { key: "flooring", prompt: "Bedroom flooring type:", options: ["Engineered Wood", "Laminate", "Standard Tiles", "Vinyl"] },
    { key: "wardrobe", prompt: "Wardrobe style:", options: ["Custom Built-in", "Modular", "Ready-made", "None"] },
    { key: "windowSeating", prompt: "Need window seating?", options: ["Yes", "No"] },
    { key: "lighting", prompt: "Lighting quality:", options: ["Premium", "Standard", "Basic"] },
    { key: "paint", prompt: "Paint quality:", options: ["Premium", "Standard", "Economy"] }
  ],
  "Living Room": [
    { key: "flooring", prompt: "Living room flooring type:", options: ["Marble/Granite", "Premium Tiles", "Standard Tiles"] },
    { key: "windowSeating", prompt: "Need window seating?", options: ["Yes", "No"] },
    { key: "lighting", prompt: "Lighting quality:", options: ["Designer", "Premium", "Standard", "Basic"] },
    { key: "paint", prompt: "Paint quality:", options: ["Premium", "Standard", "Economy"] }
  ],
  "Other": [
    { key: "flooring", prompt: "Choose flooring type:", options: ["Premium Tiles", "Standard Tiles", "Vinyl"] },
    { key: "paint", prompt: "Paint quality:", options: ["Premium", "Standard", "Economy"] }
  ]
};

export const COMM_MATERIAL_QUESTIONS = {
  "Office": [
    { key: "flooring", prompt: "Office flooring:", options: ["Premium Tiles", "Standard Tiles", "Vinyl", "Carpet"] },
    { key: "workstations", prompt: "Workstation style:", options: ["Ergonomic Modular", "Standard Modular", "Basic Tables"] },
    { key: "lighting", prompt: "Lighting type:", options: ["Premium LED", "Standard LED", "Basic"] },
    { key: "conference", prompt: "Need conference room fitout?", options: ["Yes", "No"] },
    { key: "paint", prompt: "Paint/wall finish:", options: ["Premium", "Standard", "Economy"] }
  ],
  "Retail Store": [
    { key: "flooring", prompt: "Retail flooring:", options: ["Premium Tiles", "Standard Tiles", "Vinyl"] },
    { key: "displayFixtures", prompt: "Display fixtures:", options: ["Custom", "Modular", "Basic"] },
    { key: "lighting", prompt: "Lighting (accent or normal):", options: ["Accent Lighting", "Premium", "Standard"] },
    { key: "paint", prompt: "Paint/branding wall finish:", options: ["Premium", "Standard", "Economy"] },
    { key: "cashCounter", prompt: "Cash counter needed?", options: ["Yes", "No"] }
  ],
  "Restaurant/Café": [
    { key: "flooring", prompt: "Flooring:", options: ["Tiles", "Wood-look", "Vinyl"] },
    { key: "furnishing", prompt: "Table/chair style:", options: ["Custom", "Standard", "Economy"] },
    { key: "lighting", prompt: "Lighting type:", options: ["Ambience", "Standard", "Basic"] },
    { key: "paint", prompt: "Paint/wall finish:", options: ["Premium", "Standard", "Economy"] },
    { key: "loungeArea", prompt: "Lounge/waiting area required?", options: ["Yes", "No"] }
  ],
  "Hospitality": [
    { key: "flooring", prompt: "Flooring:", options: ["Tiles", "Wood-look", "Vinyl"] },
    { key: "furniture", prompt: "Guest room furniture:", options: ["Custom", "Standard", "Basic"] },
    { key: "lighting", prompt: "Lighting type:", options: ["Premium", "Standard", "Basic"] },
    { key: "paint", prompt: "Paint/wall finish:", options: ["Premium", "Standard", "Economy"] },
    { key: "receptionArea", prompt: "Reception/waiting area?", options: ["Yes", "No"] }
  ],
  "Other": [
    { key: "flooring", prompt: "Flooring type:", options: ["Premium Tiles", "Standard Tiles", "Vinyl"] },
    { key: "paint", prompt: "Paint/wall finish:", options: ["Premium", "Standard", "Economy"] }
  ]
};

// ========== Step Definitions (Dynamic) ==========

export const RESIDENTIAL_FLOW = [
  { key: "botPersonality", prompt: "Choose your design expert:", type: "personality" }, // Step 1
  { key: "spaceType", prompt: "What space are you designing?", type: "options",
    options: ["Full Home", "Kitchen", "Bedroom", "Living Room", "Other"] }, // Step 2

  // MATERIAL QUESTIONS: injected dynamically next by UI logic depending on spaceType selection

  // (Gentle) Contact Collection:
  { key: "userName",  prompt: "What's your name?",           type: "input" },
  { key: "userPhone", prompt: "Nice to meet you! Phone?",    type: "input" },
  { key: "userEmail", prompt: "Your Email Address?",         type: "input" },

  { key: "finishTier", prompt: "Select your finish tier:",   type: "options", options: ["Economy", "Standard", "Premium"] },
  { key: "timeline",   prompt: "When would you like to start?", type: "options", options: ["Immediate", "Within 30 Days", "3–6 Months", "Not Sure"] },
  { key: "areaSqft",   prompt: "Approximate area (in sq.ft)?", type: "input" }, // Can be disabled as per business rule
  { key: "pincode",    prompt: "What's your project pincode?", type: "input" },
  { key: "estimate",   prompt: "Would you like a price estimate?", type: "options", options: ["Yes","No"] },
  { key: "cta",        prompt: "Thank you! How can we proceed?", type: "options", options: ["Explore Our Gallery", "View Completed Projects", "View FAQ"] }
];

export const COMMERCIAL_FLOW = [
  { key: "botPersonality", prompt: "Choose your design expert:", type: "personality" }, 
  { key: "spaceType", prompt: "What kind of commercial space?", type: "options",
    options: ["Office", "Retail Store", "Restaurant/Café", "Hospitality", "Other"] },

  // MATERIAL QUESTIONS: injected dynamically next by UI logic depending on spaceType selection

  // (Gentle) Contact Collection:
  { key: "userName",  prompt: "Contact person's name?",      type: "input" },
  { key: "userPhone", prompt: "Phone number?",               type: "input" },
  { key: "userEmail", prompt: "Email address?",              type: "input" },

  { key: "finishTier", prompt: "Choose your finish tier:",   type: "options", options: ["Economy","Standard","Premium"] },
  { key: "timeline",   prompt: "When do you need it completed?", type: "options", options: ["Within 1 Month","1–3 Months","3–6 Months","Flexible"] },
  { key: "areaSqft",   prompt: "Approximate area (in sq.ft)?", type: "input" },
  { key: "pincode",    prompt: "What's your project pincode?", type: "input" },
  { key: "estimate",   prompt: "Would you like an estimated cost?", type: "options", options: ["Yes","No"] },
  { key: "cta",        prompt: "Thank you! How can we proceed?", type: "options", options: ["Explore Our Gallery","View Completed Projects","View FAQ"] }
];

// ========== Privacy and Consent ==========
export const PRIVACY_CONFIG = {
  dataRetentionYears: 5,
  requirePrimaryConsent: true,
  requireMarketingConsent: true,
  privacyPolicyUrl: "/privacy-policy",
  dataUsageNotice: "Your details are used strictly for interior consultation and never sold.",
  marketingConsentText: "I'd like to receive design tips and offers (optional)."
};
