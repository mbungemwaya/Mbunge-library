// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

// Configuration
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your key
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are MBUNGE, a helpful AI assistant for the MBUNGE Online Library. You help users with:
- Book recommendations from the library
- Personal growth and development advice
- Financial literacy and wealth-building tips
- Spiritual guidance
- Mindset development strategies

Our library features books like:
- Rich Dad Poor Dad (Personal Finance)
- Think and Grow Rich (Mindset)
- The Bible (Spiritual)
- Understanding Your Potential (Mindset)
- Rediscovering the Kingdom (Spiritual)
- The Psychology of Money (Finance)
- Start with Why (Mindset)
- Atomic Habits (Mindset)

Be encouraging, helpful, and knowledgeable. Keep responses concise and actionable.`;

// DOM Elements
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const chatIcon = document.querySelector('.chat-icon');
const chatClose = document.querySelector('.chat-close');

// Event Listeners
chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Toggle Chat Window
function toggleChat() {
  const isOpen = chatWindow.style.display !== 'none';
  
  if (isOpen) {
    chatWindow.style.display = 'none';
    chatIcon.style.display = 'inline-block';
    chatClose.style.display = 'none';
  } else {
    chatWindow.style.display = 'flex';
    chatIcon.style.display = 'none';
    chatClose.style.display = 'inline-block';
    chatInput.focus();
  }
}

// Send Message
async function sendMessage() {
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  // Add user message to chat
  addMessage(message, 'user');
  chatInput.value = '';
  sendBtn.disabled = true;
  
  // Show loading indicator
  addLoadingMessage();
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    
    // Remove loading message and add bot response
    removeLoadingMessage();
    addMessage(botResponse, 'bot');
    
  } catch (error) {
    console.error('Chat Error:', error);
    removeLoadingMessage();
    addMessage('Sorry, I encountered an error. Please make sure your API key is set up correctly. For testing, try: "What books do you recommend?"', 'bot');
  }
  
  sendBtn.disabled = false;
}

// Add Message to Chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}-message`;
  
  const messageContent = document.createElement('p');
  messageContent.textContent = text;
  
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add Loading Indicator
function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message bot-message';
  messageDiv.id = 'loading-message';
  
  messageDiv.innerHTML = `
    <div>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove Loading Indicator
function removeLoadingMessage() {
  const loadingMsg = document.getElementById('loading-message');
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

console.log('Chatbot loaded! Remember to set your OpenAI API key.');
