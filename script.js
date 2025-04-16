// Application State
const state = {
    currentScreen: 'welcome',
    profileData: {
        gender: '',
        height: '',
        weight: '',
        waist: '',
        inseam: '',
        chest: '',
        shoulders: '',
        preferredFit: 'regular'
    },
    messages: []
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    profile: document.getElementById('profile-screen'),
    chat: document.getElementById('chat-screen')
};

const getStartedBtn = document.getElementById('get-started-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const tabHeaders = document.querySelectorAll('.tab-header');
const tabContents = document.querySelectorAll('.tab-content');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');

// Initial bot message
const initialBotMessage = {
    content: "Hi there! I'm your FitBud SmartSize Advisor. I can help you find the perfect clothing size based on your measurements and preferences. What are you shopping for today?",
    type: 'bot',
    timestamp: new Date()
};

// Clothing database simulation
const clothingDatabase = {
    jeans: {
        brands: [
            { name: "Levi's", sizes: ['28x30', '30x32', '32x32', '34x34'] },
            { name: 'TrendyFit', sizes: ['S', 'M', 'L', 'XL'] },
            { name: 'DenimCo', sizes: ['2', '4', '6', '8', '10'] }
        ]
    },
    shirts: {
        brands: [
            { name: 'ComfortWear', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
            { name: 'StylePlus', sizes: ['S', 'M', 'L'] },
            { name: 'FitFashion', sizes: ['36', '38', '40', '42'] }
        ]
    },
    dresses: {
        brands: [
            { name: 'ElegantWear', sizes: ['XS', 'S', 'M', 'L'] },
            { name: 'ChicStyle', sizes: ['2', '4', '6', '8'] },
            { name: 'ModernFit', sizes: ['S', 'M', 'L'] }
        ]
    }
};

// Initialize the application
function init() {
    // Add event listeners
    getStartedBtn.addEventListener('click', navigateToProfile);
    saveProfileBtn.addEventListener('click', saveProfile);
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => switchTab(header.dataset.tab));
    });
    
    chatForm.addEventListener('submit', handleMessageSubmit);
    messageInput.addEventListener('input', validateMessageInput);
    
    // Set initial active screen
    navigateToScreen(state.currentScreen);
}

// Navigation Functions
function navigateToScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the selected screen
    screens[screenName].classList.add('active');
    state.currentScreen = screenName;
    
    // Specific actions for each screen
    if (screenName === 'chat') {
        if (state.messages.length === 0) {
            // Add the initial bot message when entering chat for the first time
            state.messages.push(initialBotMessage);
            renderMessages();
        }
    }
}

function navigateToProfile() {
    navigateToScreen('profile');
}

function navigateToChat() {
    navigateToScreen('chat');
}

// Tab Switching
function switchTab(tabName) {
    // Update tab headers
    tabHeaders.forEach(header => {
        if (header.dataset.tab === tabName) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }
    });
    
    // Update tab contents
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Form Handling
function saveProfile(e) {
    e.preventDefault();
    
    // Collect profile data
    state.profileData = {
        gender: document.getElementById('gender').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        waist: document.getElementById('waist').value,
        inseam: document.getElementById('inseam').value,
        chest: document.getElementById('chest').value,
        shoulders: document.getElementById('shoulders').value,
        preferredFit: document.getElementById('preferredFit').value
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('fitbud_profile', JSON.stringify(state.profileData));
    
    // Navigate to chat
    navigateToChat();
}

// Chat Functions
function validateMessageInput() {
    const value = messageInput.value.trim();
    sendBtn.disabled = !value;
}

function handleMessageSubmit(e) {
    e.preventDefault();
    
    const content = messageInput.value.trim();
    if (!content) return;
    
    // Add user message
    addMessage({
        content,
        type: 'user',
        timestamp: new Date()
    });
    
    // Clear input
    messageInput.value = '';
    sendBtn.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process response after a delay to simulate thinking
    setTimeout(() => {
        processUserMessage(content);
    }, 1500);
}

function addMessage(message) {
    state.messages.push(message);
    renderMessages();
    scrollToBottom();
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingIndicator.appendChild(dot);
    }
    
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function processUserMessage(content) {
    const lowerContent = content.toLowerCase();
    let response = null;
    
    // Keywords matching
    const keywords = {
        jeans: ['jeans', 'pants', 'denim', 'trousers'],
        shirts: ['shirt', 't-shirt', 'tee', 'top', 'blouse'],
        dresses: ['dress', 'gown', 'frock']
    };

    let itemType = null;
    for (const [type, words] of Object.entries(keywords)) {
        if (words.some(word => lowerContent.includes(word))) {
            itemType = type;
            break;
        }
    }

    if (itemType) {
        const recommendation = getSizeRecommendation(itemType, state.profileData);
        if (recommendation) {
            // Initial response
            hideTypingIndicator();
            addMessage({
                content: `I've analyzed your measurements and found some great ${itemType} options for you.`,
                type: 'bot',
                timestamp: new Date()
            });

            // Show typing for recommendation
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                // Product recommendation
                addMessage({
                    type: 'recommendation',
                    recommendation: {
                        item: `${recommendation.brand.name} ${capitalize(itemType)}`,
                        brand: recommendation.brand.name,
                        recommendedSize: recommendation.size,
                        confidence: recommendation.confidence
                    },
                    timestamp: new Date()
                });

                // Follow-up message
                setTimeout(() => {
                    addMessage({
                        content: "Would you like to see more options or get recommendations for other items?",
                        type: 'bot',
                        timestamp: new Date()
                    });
                }, 1000);
            }, 1000);
            return;
        }
    }

    // Handle general inquiries
    if (lowerContent.includes('help') || lowerContent.includes('how')) {
        response = {
            content: "I can help you find the perfect size for clothing items. Just tell me what you're looking for - jeans, shirts, dresses, or other items. I'll use your profile measurements to give you personalized recommendations.",
            type: 'bot',
            timestamp: new Date()
        };
    } else if (lowerContent.includes('size') || lowerContent.includes('measurement')) {
        response = {
            content: "I see you're asking about sizes. To give you the most accurate recommendation, make sure your profile measurements are up to date. What specific item would you like a size recommendation for?",
            type: 'bot',
            timestamp: new Date()
        };
    } else if (lowerContent.includes('brand') || lowerContent.includes('recommend')) {
        response = {
            content: "I can recommend sizes across various brands. Just let me know what type of clothing you're interested in, and I'll suggest the best options based on your measurements.",
            type: 'bot',
            timestamp: new Date()
        };
    } else {
        response = {
            content: "I'm here to help you find the perfect fit! You can ask me about specific clothing items like jeans, shirts, or dresses, and I'll provide personalized size recommendations based on your measurements.",
            type: 'bot',
            timestamp: new Date()
        };
    }

    hideTypingIndicator();
    addMessage(response);
}

function getSizeRecommendation(item, userProfile) {
    const recommendations = {
        jeans: () => {
            const waistSize = parseInt(userProfile.waist) || 32;
            const inseamSize = parseInt(userProfile.inseam) || 30;
            return {
                size: `${waistSize}W x ${inseamSize}L`,
                confidence: waistSize && inseamSize ? 'high' : 'medium',
                brand: clothingDatabase.jeans.brands[Math.floor(Math.random() * clothingDatabase.jeans.brands.length)]
            };
        },
        shirts: () => {
            const chest = parseInt(userProfile.chest);
            let size = 'M';
            if (chest) {
                if (chest < 90) size = 'S';
                else if (chest > 105) size = 'L';
            }
            return {
                size: size,
                confidence: chest ? 'high' : 'medium',
                brand: clothingDatabase.shirts.brands[Math.floor(Math.random() * clothingDatabase.shirts.brands.length)]
            };
        },
        dresses: () => {
            const waist = parseInt(userProfile.waist);
            let size = 'M';
            if (waist) {
                if (waist < 70) size = 'S';
                else if (waist > 85) size = 'L';
            }
            return {
                size: size,
                confidence: waist ? 'high' : 'medium',
                brand: clothingDatabase.dresses.brands[Math.floor(Math.random() * clothingDatabase.dresses.brands.length)]
            };
        }
    };

    return recommendations[item] ? recommendations[item]() : null;
}

function renderMessages() {
    // Clear messages container first to avoid duplicates
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
    
    // Render all messages
    state.messages.forEach(message => {
        if (message.type === 'recommendation') {
            renderRecommendation(message);
        } else {
            renderMessage(message);
        }
    });
}

function renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    
    const avatarElement = document.createElement('div');
    avatarElement.className = `message-avatar avatar-${message.type}`;
    
    if (message.type === 'user') {
        // User avatar (simplified icon)
        avatarElement.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else {
        // Bot avatar (logo)
        avatarElement.innerHTML = `
            <img src="logo.png" alt="FitBud Logo" style="width: 100%; height: 100%; object-fit: contain;">
        `;
    }
    
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.textContent = message.content;
    
    // Add timestamp
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = formatTime(message.timestamp);
    contentElement.appendChild(timeElement);
    
    messageElement.appendChild(avatarElement);
    messageElement.appendChild(contentElement);
    
    chatMessages.appendChild(messageElement);
}

function renderRecommendation(message) {
    const { recommendation } = message;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot';
    
    const avatarElement = document.createElement('div');
    avatarElement.className = 'message-avatar avatar-bot';
    avatarElement.innerHTML = `
        <img src="logo.png" alt="FitBud Logo" style="width: 100%; height: 100%; object-fit: contain;">
    `;
    
    const recommendationElement = document.createElement('div');
    recommendationElement.className = 'recommendation';
    
    // Recommendation header
    const headerElement = document.createElement('div');
    headerElement.className = 'recommendation-header';
    
    const titleContainer = document.createElement('div');
    
    const titleElement = document.createElement('div');
    titleElement.className = 'recommendation-title';
    titleElement.textContent = recommendation.item;
    
    const brandElement = document.createElement('div');
    brandElement.className = 'recommendation-brand';
    brandElement.textContent = `Brand: ${recommendation.brand}`;
    
    titleContainer.appendChild(titleElement);
    titleContainer.appendChild(brandElement);
    
    const confidenceElement = document.createElement('span');
    confidenceElement.className = `confidence ${recommendation.confidence}`;
    confidenceElement.textContent = `${capitalize(recommendation.confidence)} confidence`;
    
    headerElement.appendChild(titleContainer);
    headerElement.appendChild(confidenceElement);
    
    // Recommendation size
    const sizeElement = document.createElement('div');
    sizeElement.className = 'recommended-size';
    sizeElement.innerHTML = `
        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Recommended size: ${recommendation.recommendedSize}
    `;
    
    // Recommendation footer
    const footerElement = document.createElement('div');
    footerElement.className = 'recommendation-footer';
    footerElement.innerHTML = `
        <span>Based on your profile</span>
        <span class="see-details">
            See details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    `;
    
    // Combine all elements
    recommendationElement.appendChild(headerElement);
    recommendationElement.appendChild(sizeElement);
    recommendationElement.appendChild(footerElement);
    
    messageElement.appendChild(avatarElement);
    messageElement.appendChild(recommendationElement);
    
    chatMessages.appendChild(messageElement);
}

// Utility Functions
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Check if there's a saved profile
function loadSavedProfile() {
    const savedProfile = localStorage.getItem('fitbud_profile');
    if (savedProfile) {
        state.profileData = JSON.parse(savedProfile);
        
        // Pre-fill the form if returning to the profile screen
        document.getElementById('gender').value = state.profileData.gender;
        document.getElementById('height').value = state.profileData.height;
        document.getElementById('weight').value = state.profileData.weight;
        document.getElementById('waist').value = state.profileData.waist;
        document.getElementById('inseam').value = state.profileData.inseam;
        document.getElementById('chest').value = state.profileData.chest;
        document.getElementById('shoulders').value = state.profileData.shoulders;
        document.getElementById('preferredFit').value = state.profileData.preferredFit;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadSavedProfile();
});
