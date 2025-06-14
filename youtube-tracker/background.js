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
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('Background script received message:', message);
    console.log('Message from tab:', sender.tab ? sender.tab.url : 'unknown');
    
    // Send data to API when we receive METADATA or TIME_DATA
    if (message.type === 'METADATA' || message.type === 'TIME_DATA') {
        console.log('About to send to API...');
        try {
            const result = await sendToAPI(message.data);
            console.log('API call result:', result);
            sendResponse({ status: 'sent', result: result });
        } catch (error) {
            console.error('Error sending data to API:', error);
            sendResponse({ status: 'error', error: error.message });
        }
        return true; // Keep message channel open for async response
    } else {
        console.log('Received message of unknown type:', message.type, { message });
        // For other message types, just acknowledge
        sendResponse({ status: 'received' });
    }

    return true; // Keep message channel open for async response
});


// === HISTORY FUNCTIONALITY ADDED AT END ===

/**
 * SEND YOUTUBE HISTORY TO BACKEND
 * Fetches YouTube history and sends each item to Django API
 */
async function sendHistoryToBackend() {
    console.log('🔍 === SENDING YOUTUBE HISTORY TO BACKEND ===');
    
    // Check if chrome.history is available
    if (!chrome.history) {
        console.error('❌ chrome.history not available - check permissions');
        return;
    }
    
    console.log('✅ chrome.history available, fetching...');
    
    // Get YouTube history from last 30 days
    chrome.history.search({
        text: 'youtube.com',
        maxResults: 100,
        startTime: Date.now() - (30 * 24 * 60 * 60 * 1000)
    }, async (historyItems) => {
        console.log(`📊 Found ${historyItems.length} YouTube videos in history`);
        
        if (historyItems.length === 0) {
            console.log('⚠️ No YouTube history found in last 30 days');
            return;
        }
        
        // Send each history item to backend
        let successCount = 0;
        for (const item of historyItems) {
            const historyData = {
                url: item.url,
                title: item.title || 'No title',
                visit_count: item.visitCount || 1,
                last_visit: new Date(item.lastVisitTime).toISOString()
            };
            
            console.log('🔍 EXACT DATA BEING SENT:', JSON.stringify(historyData, null, 2));
            
            try {
                console.log(`📤 Sending: ${item.title}`);
                
                const response = await fetch(`${API_BASE_URL}/history/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(historyData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log(`✅ Sent: ${item.title}`);
                    successCount++;
                } else {
                    const errorText = await response.text();
                    console.log(`❌ Failed: ${item.title} (Status: ${response.status})`);
                    console.log('❌ Error details:', errorText);
                }
            } catch (error) {
                console.log(`❌ Error sending: ${item.title} (${error.message})`);
            }
        }
        
        console.log(`🎯 History sync completed: ${successCount}/${historyItems.length} sent successfully`);
    });
}

// Trigger history sync on extension load
// TODO(alexv): disabled history for now; make it configurable and optimize to send all urls using a single request
// console.log('🚀 Extension loaded - starting history sync...');
// setTimeout(() => {
//     sendHistoryToBackend();
// }, 2000); // Wait 2 seconds for extension to fully load