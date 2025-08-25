// InterioAssist/main.js
// Generic Bot Personality Questionnaire with Enhanced International Validation

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
  VALIDATION_CONFIG 
} from './config.js';

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
  chatMessages.innerHTML = `
    <div class="bot-message">
      <div class="message-content">
        ${CLIENT_BRANDING.welcomeMessage}<br><br>
        First, let me connect you with the right design specialist:
      </div>
    </div>
  `;

  const botGrid = document.createElement('div');
  botGrid.className = 'bot-selection-grid';

  BOT_PERSONALITIES.forEach(bot => {
    const botCard = document.createElement('div');
    botCard.className = 'bot-card';
    botCard.onclick = () => selectBot(bot);
    
    botCard.innerHTML = `
      <div class="bot-avatar">${bot.avatar || '👤'}</div>
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

  // Update header with selected bot
  updateChatHeader(bot);
  
  // Clear messages and show greeting
  chatMessages.innerHTML = '';
  addBotMessage(bot.greeting);
  
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
        <div class="bot-avatar-small">${bot.avatar || '👤'}</div>
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
  // Use config for email validation settings
  const config = VALIDATION_CONFIG.email;
  
  // Basic checks
  if (!email || email.length < config.minLength) {
    return { isValid: false, error: 'Email is too short' };
  }
  
  if (email.length > config.maxLength) {
    return { isValid: false, error: 'Email is too long' };
  }

  // Check for dangerous characters (XSS prevention)
  if (config.dangerousChars.test(email)) {
    return { isValid: false, error: 'Email contains invalid characters' };
  }

  // Check basic structure
  if (!email.includes('@') || !email.includes('.')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Multiple @ symbols check
  if ((email.match(/@/g) || []).length !== 1) {
    return { isValid: false, error: 'Email can only contain one @ symbol' };
  }

  // Domain validation
  const [localPart, domain] = email.split('@');
  
  if (localPart.length > config.maxLocalPart) {
    return { isValid: false, error: 'Email username part is too long' };
  }

  if (!domain || domain.length < 3) {
    return { isValid: false, error: 'Please enter a valid domain name' };
  }

  // Check for common typos
  const typoCheck = checkEmailTypos(domain, config.commonDomains, config.suspiciousDomains);
  if (typoCheck.hasTyoe) {
    return {
      isValid: false,
      error: 'Did you mean one of these domains?',
      suggestions: typoCheck.suggestions
    };
  }

  // Final regex validation
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

  // Allow letters, spaces, apostrophes, hyphens, and dots
  if (!config.allowedChars.test(trimmed)) {
    return {
      isValid: false,
      error: 'Name can only contain letters, spaces, and basic punctuation'
    };
  }

  // Check for suspicious patterns (prevent spam/bots)
  if (config.spamPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid name'
    };
  }

  return {
    isValid: true,
    cleaned: trimmed.replace(/\s+/g, ' ') // Normalize spaces
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
  
  // Check against supported postal code patterns
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
  
  // Remove potentially dangerous characters
  const sanitized = value
    .replace(config.dangerousChars, '') // Remove XSS characters
    .replace(/\s+/g, ' ') // Normalize spaces
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
  
  // Add input formatting for phone numbers
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
  // Auto-format phone input as user types
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0 && !value.startsWith('+')) {
    // Try to detect country and add appropriate prefix
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
  
  // Remove error after 5 seconds
  setTimeout(() => {
    if (errorMsg.parentNode) {
      errorMsg.parentNode.removeChild(errorMsg);
    }
  }, 5000);
  
  scrollToBottom();
}

function handleAnswer(answer) {
  // Remove input/options from view
  const containers = chatMessages.querySelectorAll('.options-container, .input-container');
  containers.forEach(container => container.remove());

  // For options, add user message
  if (!chatMessages.querySelector('.user-message:last-child')) {
    addUserMessage(answer);
  }

  // Save answer
  const currentStep = chatState.currentFlow[chatState.stepIndex];
  chatState.userData[currentStep.key] = answer;

  // Special handling for certain fields
  if (currentStep.key === 'userPhone') {
    chatState.userData[currentStep.key] = formatPhoneNumber(answer);
  }

  chatState.stepIndex++;

  // Personalized response for name
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
    // Call bot-engine API for pricing
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
    } else {
      showFallbackEstimate();
    }

    // Submit lead data
    await submitLead();

  } catch (error) {
    console.error('Pricing calculation failed:', error);
    showFallbackEstimate();
    await submitLead();
  }
}

function showPriceEstimate(quote) {
  const estimateDiv = document.createElement('div');
  estimateDiv.className = 'price-estimate';
  estimateDiv.innerHTML = `
    <h4>Your Estimated Investment</h4>
    <div class="price-amount">${quote}</div>
    <div class="price-disclaimer">*This is an approximate estimate only</div>
  `;
  chatMessages.appendChild(estimateDiv);
  
  setTimeout(() => {
    addBotMessage(CLIENT_BRANDING.ctaMessage || 'Ready to get started? I\'ll submit your details and our team will contact you within 24 hours!');
    showFinalCTA();
  }, 2000);
  
  scrollToBottom();
}

function showFallbackEstimate() {
  showPriceEstimate('₹15,00,000 - ₹25,00,000');
}

function showFinalCTA() {
  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'final-cta';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'cta-btn primary';
  submitBtn.textContent = CLIENT_BRANDING.ctaButtonText || 'Yes, Get My Free Consultation!';
  submitBtn.onclick = () => showSuccessMessage();
  
  ctaContainer.appendChild(submitBtn);
  chatMessages.appendChild(ctaContainer);
  scrollToBottom();
}

async function submitLead() {
  try {
    const leadData = {
      userData: chatState.userData,
      responses: chatState.userData,
      pricing: { display: chatState.userData.estimatedPrice || '₹15,00,000 - ₹25,00,000' },
      botType: chatState.selectedBot.key,
      clientId: BOT_ENGINE_CONFIG.clientId,
      sessionId: generateSessionId(),
      marketingConsent: false,
      submittedAt: new Date().toISOString()
    };

    const response = await fetch(`${BOT_ENGINE_CONFIG.apiBaseUrl}/api/submit-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BOT_ENGINE_CONFIG.apiKey || 'demo-key'}`
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();
    return result.success;

  } catch (error) {
    console.error('Lead submission failed:', error);
    return false;
  }
}

function showSuccessMessage() {
  chatMessages.innerHTML = `
    <div class="success-message">
      <div class="success-icon">✓</div>
      <h3>${CLIENT_BRANDING.successTitle || 'Quote Request Submitted!'}</h3>
      <p>${CLIENT_BRANDING.successMessage || 'Thank you! We\'ll contact you within 24 hours with your personalized quote.'}</p>
      <br>
      <a href="${CLIENT_BRANDING.whatsappUrl}" 
         class="whatsapp-btn" target="_blank">
        ${CLIENT_BRANDING.whatsappText || 'WhatsApp Us Now'}
      </a>
    </div>
  `;
  scrollToBottom();
}

// ========== Utility Functions ==========

function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function toggleChat() {
  const isVisible = chatWidget.style.display === 'block';
  chatWidget.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible && chatMessages.innerHTML.trim() === '') {
    initializeChat();
  }
}

function restartChat() {
  if (confirm('Start a new conversation? This will clear your current progress.')) {
    initializeChat();
  }
}

// ========== Event Listeners ==========

document.addEventListener('DOMContentLoaded', () => {
  // Initialize chat launcher
  if (chatLauncher) {
    chatLauncher.addEventListener('click', toggleChat);
  }

  // Initialize widget if needed
  if (chatMessages && chatMessages.innerHTML.trim() === '') {
    // Don't auto-start, wait for launcher click
  }
});

// ========== Global Exports ==========

window.toggleChat = toggleChat;
window.restartChat = restartChat;
window.selectBot = selectBot;
window.handleAnswer = handleAnswer;

// Export for testing
window.chatState = chatState;
window.initializeChat = initializeChat;
