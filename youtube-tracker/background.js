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
    
    // Send data to API when we receive METADATA or TIME_DATA
    if (message.type === 'METADATA' || message.type === 'TIME_DATA') {
        console.log('About to send to API...');
        
        sendToAPI(message.data)
            .then(result => {
                console.log('API call result:', result);
                sendResponse({ status: 'sent', result: result });
            })
            .catch(error => {
                console.error('API call error:', error);
                sendResponse({ status: 'error', error: error.message });
            });
        
        return true; // Keep message channel open for async response
    } else {
        // For other message types, just acknowledge
        sendResponse({ status: 'received' });
    }

    return true; // Keep message channel open for async response
});


/**
 * YOUTUBE HISTORY FETCHER
 * This function gets YouTube browsing history from the last 30 days
 * and logs it to the console for debugging/monitoring
 */
// ... existing code ...

// History access function (YouTube only, last 30 days)
function logBrowsingHistory() {
    console.log('=== FETCHING YOUTUBE HISTORY (30 DAYS) ===');
    
    chrome.history.search({
        text: 'youtube.com',  // Only YouTube URLs
        maxResults: 50,       // More results since it's 30 days
        startTime: Date.now() - (30 * 24 * 60 * 60 * 1000) // Last 30 days
    }, (historyItems) => {
        console.log('YouTube history (last 30 days):');
        historyItems.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title || 'No title'}`);
            console.log(`   URL: ${item.url}`);
            console.log(`   Visits: ${item.visitCount}x`);
            console.log(`   Last visit: ${new Date(item.lastVisitTime).toLocaleDateString()}`);
            console.log('---');
        });
        console.log(`Total YouTube visits found: ${historyItems.length}`);
    });
}

console.log('🧪 Testing history function immediately...');
setTimeout(() => {
    console.log('🔍 Calling logBrowsingHistory...');
    logBrowsingHistory();
}, 1000);