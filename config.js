// InterioAssist/config.js - BROWSER-SAFE VERSION (No Node.js code)

// ========== Bot Personalities Configuration ==========
export const BOT_PERSONALITIES = [
  {
    key: 'kavya',
    avatar: '💎', 
    name: 'KAVYA',
    tagline: 'Premium Residential Expert',
    serviceDescription: '20L+ Luxury materials, custom designs',
    greeting: 'Namaste! I\'m Kavya, your premium residential design specialist. I create luxury homes with imported materials, custom furniture, and high-end finishes. Let\'s design your dream space!',
    priceMultiplier: 1.4,
    projectType: 'residential'
  },
  {
    key: 'arjun',
    avatar: '🏠',
    name: 'ARJUN', 
    tagline: 'Mid-Range Residential Expert',
    serviceDescription: '8-20L Quality materials, smart design',
    greeting: 'Hi! I\'m Arjun, and I specialize in beautiful, functional homes within smart budgets. Quality materials, modular solutions, and great design - let\'s create your perfect home!',
    priceMultiplier: 1.0,
    projectType: 'residential'
  },
  {
    key: 'priya',
    avatar: '🏡',
    name: 'PRIYA',
    tagline: 'Budget Residential Expert', 
    serviceDescription: '3-8L Cost-effective, functional',
    greeting: 'Hello! I\'m Priya, your budget-friendly design expert. I create beautiful homes that are cost-effective and functional. Great design doesn\'t need to be expensive!',
    priceMultiplier: 0.7,
    projectType: 'residential'
  },
  {
    key: 'rohan',
    avatar: '🏢',
    name: 'ROHAN',
    tagline: 'Commercial Space Expert',
    serviceDescription: 'Offices, retail, restaurants', 
    greeting: 'Namaste! I\'m Rohan, your commercial design specialist. I create productive office spaces, retail stores, and restaurants that enhance your business success!',
    priceMultiplier: 1.2,
    projectType: 'commercial'
  }
];

// ========== Client Branding (Default) ==========
export const CLIENT_BRANDING = {
  companyName: "InterioAssist",
  welcomeMessage: "Welcome to InterioAssist! I'm here to help you get the perfect quote for your dream space.",
  ctaMessage: "Ready to get started? I'll submit your details and our team will contact you within 24 hours!",
  ctaButtonText: "Yes, Get My Free Consultation!",
  successTitle: "Quote Request Submitted!",
  successMessage: "Thank you! We'll contact you within 24 hours with your personalized quote.",
  whatsappUrl: "https://wa.me/919876543210?text=Hi%2C%20I%20just%20submitted%20a%20quote%20request",
  whatsappText: "WhatsApp Us Now"
};

// ========== Avatar Configuration ==========
export const AVATAR_CONFIG = {
  fallbacks: {
    kavya: '💎',
    arjun: '🏠', 
    priya: '🏡',
    rohan: '🏢',
    default: '🎨'
  }
};

// ========== Validation Configuration ==========
export const VALIDATION_CONFIG = {
  name: {
    minLength: 2,
    maxLength: 50,
    allowedChars: /^[a-zA-Z\s.'-]+$/,
    spamPattern: /^(test|xxx|admin|null|undefined)$/i
  },
  email: {
    minLength: 5,
    maxLength: 100, 
    maxLocalPart: 64,
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    dangerousChars: /[<>]/,
    commonDomains: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
    suspiciousDomains: ['gmial', 'yahooo', 'hotmial']
  },
  phonePatterns: {
    india: /^\+?91[6-9]\d{9}$/,
    uae: /^\+?971[5]\d{8}$/,
    australia: /^\+?61[4]\d{8}$/,
    saudi: /^\+?966[5]\d{8}$/,
    uk: /^\+?44[7]\d{9}$/
  },
  phoneFormatters: {
    india: (phone) => phone.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2-$3'),
    uae: (phone) => phone.replace(/(\+971)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')
  },
  area: {
    min: 100,
    max: 50000
  },
  postcodePatterns: {
    india: /^[1-9][0-9]{5}$/,
    uae: /^\d{5}$/,
    australia: /^[0-9]{4}$/,
    saudi: /^[0-9]{5}$/,
    uk: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i
  },
  placeholders: {
    userName: 'Enter your name...',
    userPhone: 'Enter phone number (e.g., +91 9876543210)', 
    userEmail: 'Enter your email address...',
    areaSqft: 'Enter area in square feet...'
  },
  generic: {
    maxLength: 500,
    dangerousChars: /<script|javascript:|on\w+=/gi
  }
};
// ========== Bot Engine Configuration ==========
export const BOT_ENGINE_CONFIG = {
  apiBaseUrl: 'http://localhost:3000',
  apiKey: 'demo-key',
  clientId: 'interioassist',
  timeout: 5000,
  retries: 2,
  fallbackEnabled: true
};

