// Background script for YouTube Tracker Extension
// Handles communication between content script and Django API

console.log('YouTube Tracker background script loaded');

// Django API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Function to send data to Django API
async function sendToAPI(data) {
    try {
        console.log('Sending data to API:', data);
        
        const response = await fetch(`${API_BASE_URL}/sessions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('API response success:', result);
            return { success: true, data: result };
        } else {
            console.error('API response error:', response.status, response.statusText);
            return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
    } catch (error) {
        console.error('Failed to send data to API:', error);
        return { success: false, error: error.message };
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);
    console.log('Message from tab:', sender.tab ? sender.tab.url : 'unknown');
    
    // Acknowledge receipt of message
    sendResponse({ status: 'received' });
    
    return true; // Keep message channel open for async response
});
