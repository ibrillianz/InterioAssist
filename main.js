// InterioAssist/main.js
// Generic Bot Personality Questionnaire with Avatar Management System

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
        // Cache the image for faster loading
      }
    });
  }
}

// Initialize avatar manager
const avatarManager = new AvatarManager();

// ========== Rest of your existing main.js code... ==========
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

// ✅ UPDATED: Dynamic avatar loading in bot selection
function showBotSelection() {
  chatMessages.innerHTML = `
    <div class="bot-message">
      <div class="message-content">
        ${CLIENT_BRANDING.welcomeMessage}<br><br>
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
    
    // ✅ Use dynamic avatar system
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

  // ✅ Update header with dynamic avatar
  updateChatHeader(bot);
  
  // Clear messages and show greeting
  chatMessages.innerHTML = '';
  addBotMessage(bot.greeting);
  
  setTimeout(() => {
    nextQuestion();
  }, 1500);
}

// ✅ UPDATED: Dynamic avatar in chat header
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

// ========== ... Rest of your existing functions remain the same ... ==========

// [Include all your existing validation, question handling, and submission functions here]
// The only change is that avatar rendering now uses avatarManager.createAvatarElement()

// ========== Initialize with client config ==========
document.addEventListener('DOMContentLoaded', () => {
  // Initialize chat launcher
  if (chatLauncher) {
    chatLauncher.addEventListener('click', toggleChat);
  }

  // ✅ Load client-specific avatars if available
  if (window.CLIENT_AVATAR_CONFIG) {
    avatarManager.loadClientConfig(window.CLIENT_AVATAR_CONFIG);
    avatarManager.preloadAvatars();
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

// Export avatar manager for testing
window.avatarManager = avatarManager;
window.chatState = chatState;
window.initializeChat = initializeChat;
