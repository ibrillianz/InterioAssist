// InterioAssist/main.js
// Complete Generic Bot Personality Questionnaire with Avatar Management System

import { 
  WIDGET_CONFIG, 
  BOT_PERSONALITIES, 
  RESIDENTIAL_FLOW, 
  COMMERCIAL_FLOW, 
  RES_MATERIAL_QUESTIONS, 
  COMM_MATERIAL_QUESTIONS, 
  BOT_ENGINE_CONFIG,
  PRIVACY_CONFIG,
  CLIENT_BRANDING,
  VALIDATION_CONFIG,
  AVATAR_CONFIG
} from './config.js';

// ========== Avatar Management System ==========
class AvatarManager {
  constructor() {
    this.clientAvatars = {};
    this.fallbacks = AVATAR_CONFIG.fallbacks;
    this.loadingCache = new Map();
  }

  // Load client-specific avatar configuration
  loadClientConfig(clientConfig) {
    this.clientAvatars = clientConfig.avatars || {};
    console.log('Client avatars loaded:', this.clientAvatars);
  }

  // Get avatar for bot - supports images, URLs, and emoji fallbacks
  getAvatar(botKey) {
    // 1. Try client-specific image path
    if (this.clientAvatars[botKey]) {
      return {
        type: 'image',
        src: this.clientAvatars[botKey],
        fallback: this.fallbacks[botKey] || this.fallbacks.default
      };
    }
    
    // 2. Use emoji fallback  
    return {
      type: 'emoji',
      src: this.fallbacks[botKey] || this.fallbacks.default,
      fallback: this.fallbacks.default
    };
  }

  // Create avatar HTML with error handling
  createAvatarElement(botKey, className = 'bot-avatar') {
    const avatarData = this.getAvatar(botKey);
    
    if (avatarData.type === 'image') {
      return `
        <div class="${className}">
          <img src="${avatarData.src}" 
               alt="${botKey} avatar"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
               loading="lazy"
               class="avatar-image" />
          <div class="avatar-fallback" style="display:none;">${avatarData.fallback}</div>
        </div>
      `;
    } else {
      return `<div class="${className}">${avatarData.src}</div>`;
    }
  }

  // Preload client avatars for better performance
  preloadAvatars() {
    Object.values(this.clientAvatars).forEach(src => {
      if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('./'))) {
        const img = new Image();
        img.src = src;
      }
    });
  }
}

// Initialize avatar manager
const avatarManager = new AvatarManager();

// ========== Chat State Management ==========
let chatState = {
  currentStep: 'botSelection',
  selectedBot: null,
  userData: {},
  currentFlow: [],
  stepIndex: 0,
  materialQuestionsInjected: false
};

// ========== DOM Elements ==========
const chatWidget = document.getElementById('chat-widget');
const chatMessages = document.getElementById('chat-messages');
const chatLauncher = document.getElementById('chat-launcher');

// ========== Main Chat Functions ==========

function initializeChat() {
  chatState.currentStep = 'botSelection';
  chatState.userData = {};
  chatState.stepIndex = 0;
  chatState.materialQuestionsInjected = false;
  showBotSelection();
}

function showBotSelection() {
  const branding = window.CLIENT_BRANDING_CONFIG || CLIENT_BRANDING;
  
  chatMessages.innerHTML = `
    <div class="bot-message">
      <div class="message-content">
        ${branding.welcomeMessage}<br><br>
        First, let me connect you with the right design specialist:
      </div>
    </div>
  `;

  // Add scroll indicator for mobile
  if (window.innerWidth <= 768) {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '← Swipe to see all experts →';
    chatMessages.appendChild(scrollIndicator);
  }

  const botGrid = document.createElement('div');
  botGrid.className = 'bot-selection-grid';

  BOT_PERSONALITIES.forEach(bot => {
    const botCard = document.createElement('div');
    botCard.className = 'bot-card';
    botCard.onclick = () => selectBot(bot);
    
    // Use dynamic avatar system
    botCard.innerHTML = `
      ${avatarManager.createAvatarElement(bot.avatar, 'bot-avatar')}
      <div class="bot-name">${bot.name}</div>
      <div class="bot-tagline">${bot.tagline}</div>
      <div class="bot-description">${bot.serviceDescription}</div>
    `;
    
    botGrid.appendChild(botCard);
  });

  chatMessages.appendChild(botGrid);
  scrollToBottom();
}

function selectBot(bot) {
  chatState.selectedBot = bot;
  chatState.userData.botKey = bot.key;
  chatState.userData.botType = bot.name;
  chatState.userData.projectType = bot.projectType;
  
  // Set flow based on bot's project type
  chatState.currentFlow = bot.projectType === 'residential' ? 
    [...RESIDENTIAL_FLOW] : [...COMMERCIAL_FLOW];
  
  // Remove botPersonality step since we already handled it
  chatState.currentFlow = chatState.currentFlow.filter(step => step.key !== 'botPersonality');
  chatState.stepIndex = 0;

  // Update header with dynamic avatar
  updateChatHeader(bot);
  
  // Clear messages and show greeting
  chatMessages.innerHTML = '';
  
  // Use client override greeting if available
  const clientOverrides = window.CLIENT_BOT_OVERRIDES || {};
  const greeting = clientOverrides[bot.key]?.greeting || bot.greeting;
  
  addBotMessage(greeting);
  
  setTimeout(() => {
    nextQuestion();
  }, 1500);
}

function updateChatHeader(bot) {
  const header = document.querySelector('.chat-header');
  if (header) {
    header.innerHTML = `
      <button class="close-btn" onclick="toggleChat()">×</button>
      <div class="bot-info">
        ${avatarManager.createAvatarElement(bot.avatar, 'bot-avatar-small')}
        <div>
          <div class="bot-name-header">${bot.name}</div>
          <div class="bot-tagline-header">${bot.tagline}</div>
        </div>
      </div>
    `;
  }
}

function nextQuestion() {
  // Check if we need to inject material questions
  if (!chatState.materialQuestionsInjected && 
      chatState.userData.spaceType && 
      chatState.stepIndex < chatState.currentFlow.length) {
    
    const currentStep = chatState.currentFlow[chatState.stepIndex];
    
    // Find where to inject material questions (after spaceType, before contact)
    if (currentStep.key === 'userName') {
      injectMaterialQuestions();
      return; // Will recursively call nextQuestion
    }
  }

  // Normal flow progression
  if (chatState.stepIndex >= chatState.currentFlow.length) {
    completeQuestionnaire();
    return;
  }

  const step = chatState.currentFlow[chatState.stepIndex];
  askQuestion(step);
}

function injectMaterialQuestions() {
  const spaceType = chatState.userData.spaceType;
  let materialQuestions = [];

  if (chatState.selectedBot.projectType === 'residential') {
    materialQuestions = RES_MATERIAL_QUESTIONS[spaceType] || [];
  } else {
    materialQuestions = COMM_MATERIAL_QUESTIONS[spaceType] || [];
  }

  // Insert material questions at current position
  chatState.currentFlow.splice(chatState.stepIndex, 0, ...materialQuestions);
  chatState.materialQuestionsInjected = true;

  // Continue with first material question
  nextQuestion();
}

function askQuestion(step) {
  addBotMessage(step.prompt);

  if (step.type === 'options') {
    showOptions(step.options);
  } else if (step.type === 'input') {
    showInputField(step);
  }
}

function showOptions(options) {
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'options-container';

  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.onclick = () => handleAnswer(option);
    optionsContainer.appendChild(button);
  });

  chatMessages.appendChild(optionsContainer);
  scrollToBottom();
}

// ========== Enhanced International Validation Functions ==========

function validateInput(fieldKey, value) {
  switch (fieldKey) {
    case 'userName':
      return validateName(value);
    
    case 'userPhone':
      return validatePhoneNumber(value);
    
    case 'userEmail':
      return validateEmail(value);
    
    case 'areaSqft':
      return validateArea(value);
    
    case 'pincode':
      return validatePincode(value);
    
    default:
      return sanitizeGenericInput(value);
  }
}

function validatePhoneNumber(phone) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Get supported countries from config
  const patterns = VALIDATION_CONFIG.phonePatterns;

  // Check against all patterns
  for (const [country, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return {
        isValid: true,
        country: country,
        cleaned: formatPhoneForCountry(cleaned, country)
      };
    }
  }

  // If no pattern matches but looks like a phone number
  if (/^\d{7,15}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please include your country code (e.g., +91 for India, +971 for UAE)',
      suggestion: `Try: +${cleaned}`
    };
  }

  return {
    isValid: false,
    error: 'Please enter a valid mobile number with country code'
  };
}

function formatPhoneForCountry(phone, country) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  const formatters = VALIDATION_CONFIG.phoneFormatters;
  
  if (formatters[country]) {
    return formatters[country](cleaned);
  }
  
  return cleaned;
}

function validateEmail(email) {
  const config = VALIDATION_CONFIG.email;
  
  if (!email || email.length < config.minLength) {
    return { isValid: false, error: 'Email is too short' };
  }
  
  if (email.length > config.maxLength) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (config.dangerousChars.test(email)) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }

  if (!email.includes('@') || !email.includes('.')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if ((email.match(/@/g) || []).length !== 1) {
    return { isValid: false, error: 'Email can only contain one @ symbol' };
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length > config.maxLocalPart) {
    return { isValid: false, error: 'Email username part is too long' };
  }

  if (!domain || domain.length < 3) {
    return { isValid: false, error: 'Please enter a valid domain name' };
  }

  const typoCheck = checkEmailTypos(domain, config.commonDomains, config.suspiciousDomains);
  if (typoCheck.hasTyoe) {
    return {
      isValid: false,
      error: 'Did you mean one of these domains?',
      suggestions: typoCheck.suggestions
    };
  }

  if (!config.regex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return {
    isValid: true,
    cleaned: email.toLowerCase().trim()
  };
}

function checkEmailTypos(domain, commonDomains, suspiciousDomains) {
  const domainLower = domain.toLowerCase();
  
  for (const typo of suspiciousDomains) {
    if (domainLower.includes(typo)) {
      return {
        hasTyoe: true,
        suggestions: commonDomains
      };
    }
  }
  
  return { hasTyoe: false };
}

function validateName(name) {
  const config = VALIDATION_CONFIG.name;
  const trimmed = name.trim();
  
  if (trimmed.length < config.minLength) {
    return {
      isValid: false,
      error: `Name must be at least ${config.minLength} characters long`
    };
  }
  
  if (trimmed.length > config.maxLength) {
    return {
      isValid: false,
      error: `Name is too long (maximum ${config.maxLength} characters)`
    };
  }

  if (!config.allowedChars.test(trimmed)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, and basic punctuation'
    };
  }

  if (config.spamPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid name'
    };
  }

  return {
    isValid: true,
    cleaned: trimmed.replace(/\s+/g, ' ')
  };
}

function validateArea(area) {
  const config = VALIDATION_CONFIG.area;
  const numericArea = parseFloat(area.replace(/[^\d.]/g, ''));
  
  if (isNaN(numericArea) || numericArea <= 0) {
    return {
      isValid: false,
      error: 'Please enter a valid area in square feet'
    };
  }
  
  if (numericArea < config.min) {
    return {
      isValid: false,
      error: `Area seems too small (minimum ${config.min} sq ft)`
    };
  }
  
  if (numericArea > config.max) {
    return {
      isValid: false,
      error: `Area seems too large (maximum ${config.max.toLocaleString()} sq ft)`
    };
  }

  return {
    isValid: true,
    cleaned: Math.round(numericArea).toString()
  };
}

function validatePincode(pincode) {
  const cleaned = pincode.replace(/\D/g, '');
  const patterns = VALIDATION_CONFIG.postcodePatterns;
  
  for (const [country, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return { 
        isValid: true, 
        cleaned: cleaned, 
        country: country 
      };
    }
  }

  return {
    isValid: false,
    error: 'Please enter a valid postal/PIN code for your country'
  };
}

function sanitizeGenericInput(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  const config = VALIDATION_CONFIG.generic;
  
  const sanitized = value
    .replace(config.dangerousChars, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (sanitized.length > config.maxLength) {
    return {
      isValid: false,
      error: `Input is too long (maximum ${config.maxLength} characters)`
    };
  }

  return {
    isValid: true,
    cleaned: sanitized
  };
}

function showInputField(step) {
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  
  const input = document.createElement('input');
  input.type = getInputType(step.key);
  input.className = 'chat-input';
  input.placeholder = getInputPlaceholder(step.key);
  
  if (step.key === 'userPhone') {
    input.addEventListener('input', (e) => {
      formatPhoneInput(e.target);
    });
  }
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'submit-btn';
  submitBtn.textContent = 'Send';
  
  const handleSubmit = () => {
    const value = input.value.trim();
    if (value) {
      const validation = validateInput(step.key, value);
      
      if (validation.isValid) {
        const finalValue = validation.cleaned || value;
        addUserMessage(finalValue);
        handleAnswer(finalValue);
      } else {
        showValidationError(validation.error, validation.suggestions);
      }
    }
  };

  submitBtn.onclick = handleSubmit;
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });

  inputContainer.appendChild(input);
  inputContainer.appendChild(submitBtn);
  chatMessages.appendChild(inputContainer);
  
  input.focus();
  scrollToBottom();
}

// ========== Helper Functions ==========

function getInputType(fieldKey) {
  const types = {
    userEmail: 'email',
    userPhone: 'tel',
    areaSqft: 'number'
  };
  return types[fieldKey] || 'text';
}

function formatPhoneInput(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0 && !value.startsWith('+')) {
    if (value.length === 10 && /^[6-9]/.test(value)) {
      value = '+91' + value;
    } else if (value.length === 9 && value.startsWith('5')) {
      value = '+971' + value;
    } else if (value.length === 9 && value.startsWith('4')) {
      value = '+61' + value;
    }
  }
  
  input.value = value;
}

function getInputPlaceholder(fieldKey) {
  const placeholders = VALIDATION_CONFIG.placeholders;
  return placeholders[fieldKey] || 'Type your answer...';
}

function showValidationError(error, suggestions = null) {
  const errorMsg = document.createElement('div');
  errorMsg.className = 'error-message';
  errorMsg.innerHTML = `
    <div class="error-text">${error}</div>
    ${suggestions ? `<div class="error-suggestions">Suggestions: ${suggestions.join(', ')}</div>` : ''}
  `;
  
  chatMessages.appendChild(errorMsg);
  
  setTimeout(() => {
    if (errorMsg.parentNode) {
      errorMsg.parentNode.removeChild(errorMsg);
    }
  }, 5000);
  
  scrollToBottom();
}

function handleAnswer(answer) {
  const containers = chatMessages.querySelectorAll('.options-container, .input-container');
  containers.forEach(container => container.remove());

  if (!chatMessages.querySelector('.user-message:last-child')) {
    addUserMessage(answer);
  }

  const currentStep = chatState.currentFlow[chatState.stepIndex];
  chatState.userData[currentStep.key] = answer;

  if (currentStep.key === 'userPhone') {
    chatState.userData[currentStep.key] = formatPhoneNumber(answer);
  }

  chatState.stepIndex++;

  if (currentStep.key === 'userName') {
    setTimeout(() => {
      addBotMessage(`Nice to meet you, ${answer}! What's your phone number?`);
      setTimeout(() => nextQuestion(), 1000);
    }, 800);
  } else if (currentStep.key === 'userPhone') {
    setTimeout(() => {
      addBotMessage('And your email address?');
      setTimeout(() => nextQuestion(), 1000);
    }, 800);
  } else {
    setTimeout(() => nextQuestion(), 1000);
  }
}

function formatPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  const cleanNumber = digits.startsWith('91') && digits.length === 12 ? 
    digits.substring(2) : digits.slice(-10);
  return `+91-${cleanNumber}`;
}

function addBotMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'bot-message';
  messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function addUserMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'user-message';
  messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

async function completeQuestionnaire() {
  addBotMessage('Perfect! Let me calculate your personalized estimate...');

  try {
    const pricingResponse = await fetch(`${BOT_ENGINE_CONFIG.apiBaseUrl}/api/calculate-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BOT_ENGINE_CONFIG.apiKey || 'demo-key'}`
      },
      body: JSON.stringify({
        responses: chatState.userData,
        botType: chatState.selectedBot.key,
        clientType: BOT_ENGINE_CONFIG.clientId
      })
    });

    const pricing = await pricingResponse.json();

    if (pricing.success) {
      showPriceEstimate(pricing.quote);
      
      setTimeout(() => {
        const branding = window.CLIENT_BRANDING_CONFIG || CLIENT_BRANDING;
        addBotMessage(branding.ctaMessage);
        showSubmitButton();
      }, 2000);
    } else {
      throw new Error('Pricing calculation failed');
    }
  } catch (error) {
    console.error('Price calculation error:', error);
    showSimplePriceEstimate();
  }
}

function showPriceEstimate(quote) {
  const priceHtml = `
    <div class="price-estimate">
      <h4>Your Estimated Investment</h4>
      <div class="price-amount">₹${quote.min?.toLocaleString()} - ₹${quote.max?.toLocaleString()}</div>
      <div class="price-disclaimer">This is an approximate estimate based on your requirements</div>
    </div>
  `;
  
  chatMessages.insertAdjacentHTML('beforeend', priceHtml);
  scrollToBottom();
}

function showSimplePriceEstimate() {
  const basePrice = 1500; // Base price per sq ft
  const area = parseInt(chatState.userData.areaSqft) || 1000;
  const multiplier = chatState.selectedBot.priceMultiplier || 1.0;
  
  const minPrice = Math.round(basePrice * area * multiplier * 0.8);
  const maxPrice = Math.round(basePrice * area * multiplier * 1.2);
  
  showPriceEstimate({
    min: minPrice,
    max: maxPrice
  });
  
  setTimeout(() => {
    const branding = window.CLIENT_BRANDING_CONFIG || CLIENT_BRANDING;
    addBotMessage(branding.ctaMessage);
    showSubmitButton();
  }, 2000);
}

function showSubmitButton() {
  const branding = window.CLIENT_BRANDING_CONFIG || CLIENT_BRANDING;
  
  const ctaHtml = `
    <div class="final-cta">
      <button class="cta-btn" onclick="submitLead()">${branding.ctaButtonText}</button>
    </div>
  `;
  
  chatMessages.insertAdjacentHTML('beforeend', ctaHtml);
  scrollToBottom();
}

async function submitLead() {
  const branding = window.CLIENT_BRANDING_CONFIG || CLIENT_BRANDING;
  
  try {
    const leadData = {
      ...chatState.userData,
      timestamp: new Date().toISOString(),
      source: 'InterioAssist Chat Widget',
      botPersonality: chatState.selectedBot.name
    };

    // Show loading state
    addBotMessage('Submitting your request...');

    const response = await fetch('https://script.google.com/macros/s/AKfycbzl9ZkLGKIIDYuCt0cQa77NWvrLyWyT_fH3pwL3WDCc09pFOVwa55cV1blU0kJBbtqx/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    if (response.ok) {
      showSuccessMessage();
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Lead submission error:', error);
    addBotMessage('There was an issue submitting your request. Please try again or contact us directly.');
    showSubmitButton();
  }
}

function showSuccessMessage() {
  const branding = window.CLIENT_BRANDING_CONFIG || CLIENT_BRANDING;
  
  chatMessages.innerHTML = `
    <div class="success-message">
      <div class="success-icon">✅</div>
      <h3>${branding.successTitle}</h3>
      <p>${branding.successMessage}</p>
      <a href="${branding.whatsappUrl}" class="whatsapp-btn" target="_blank">
        ${branding.whatsappText}
      </a>
    </div>
  `;
  
  scrollToBottom();
}

function scrollToBottom() {
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function toggleChat() {
  if (chatWidget.style.display === 'flex') {
    chatWidget.style.display = 'none';
  } else {
    chatWidget.style.display = 'flex';
    
    if (chatMessages.innerHTML.trim() === '') {
      initializeChat();
    }
  }
}

function restartChat() {
  if (confirm('Start a new conversation? This will clear your current progress.')) {
    chatState = {
      currentStep: 'botSelection',
      selectedBot: null,
      userData: {},
      currentFlow: [],
      stepIndex: 0,
      materialQuestionsInjected: false
    };
    
    initializeChat();
  }
}

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
  // Initialize chat launcher
  if (chatLauncher) {
    chatLauncher.addEventListener('click', toggleChat);
  }

  // Load client-specific avatars if available
  if (window.CLIENT_AVATAR_CONFIG) {
    avatarManager.loadClientConfig(window.CLIENT_AVATAR_CONFIG);
    avatarManager.preloadAvatars();
  }

  console.log('InterioAssist initialized successfully');
});

// ========== Global Exports ==========
window.toggleChat = toggleChat;
window.restartChat = restartChat;
window.submitLead = submitLead;

// Export for testing
window.avatarManager = avatarManager;
window.chatState = chatState;
window.initializeChat = initializeChat;
