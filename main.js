// Echo - Tavus AI Integration
const API_BASE = 'http://localhost:3000/api';
const HALOOCOM_URL = 'https://haloocom.com/';

// State management
let conversationUrl = null;
let isInitializing = false;

/**
 * Show loading state (now used briefly before redirection)
 */
function showLoading(message = 'Initializing Echo...') {
    // Create a loading overlay if it doesn't exist
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="loader-container">
          <div class="spinner"></div>
          <h2>${message}</h2>
          <p>Please wait while we prepare your conversation...</p>
        </div>
    `;
    overlay.classList.remove('hidden');
}
/**
 * Create a conversation (securely calls our backend)
 */
async function createConversation() {
    try {
        console.log('Creating conversation...');

        const response = await fetch(`${API_BASE}/create-conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to create conversation');
        }

        console.log('Conversation created:', data.conversationUrl);
        return data.conversationUrl;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
}

async function initializeEcho() {
    if (isInitializing) {
        console.log('Already initializing...');
        return;
    }

    isInitializing = true;

    try {
        // Step 0: Hide Join button container
        const joinContainer = document.getElementById('joinContainer');
        if (joinContainer) joinContainer.classList.add('hidden');

        // Step 1: Show loading state (could show on body or a specific overlay)
        showLoading('Redirecting to Echo Conversation...');

        // Step 2: Create conversation (uses existing document ID on backend)
        conversationUrl = await createConversation();

        // Step 3: Redirect user to the conversation URL
        console.log('🔗 Redirecting to:', conversationUrl);
        window.location.href = conversationUrl;

        console.log('✅ Redirection initiated!');
    } catch (error) {
        console.error('❌ Failed to redirect to Echo:', error);
        // Show error on the main page instead of iframe
        const joinContainer = document.getElementById('joinContainer');
        if (joinContainer) joinContainer.classList.remove('hidden');
        alert(error.message || 'An unexpected error occurred. Please check the console and try again.');
    } finally {
        isInitializing = false;
    }
}

// Handle manual Join button click
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Echo ready. Waiting for Join...');

    const joinBtn = document.getElementById('joinBtn');
    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            console.log('🖱️ Join clicked. Starting Echo...');
            initializeEcho();
        });
    }
});
