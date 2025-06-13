console.log("[YouTube Tracker] Content script loaded at:", new Date().toISOString());

setTimeout(() => {
    const title = document.querySelector('h1.ytd-watch-metadata');
    console.log("[YouTube Tracker] Video title:", title?.textContent?.trim() || "Title not found");
    
    const channel = document.querySelector('ytd-channel-name a');
    console.log("[YouTube Tracker] Channel name:", channel?.textContent?.trim() || "Channel not found");
    
    // Try multiple selectors for description
    const descriptionSelectors = [
        'ytd-text-inline-expander #plain-snippet-text',
        '#description-text',
        'ytd-video-secondary-info-renderer #description',
        '.ytd-expandable-video-description-body-renderer'
    ];
    
    let description = null;
    for (const selector of descriptionSelectors) {
        description = document.querySelector(selector);
        if (description && description.textContent.trim()) {
            break;
        }
    }
    
    const descriptionText = description?.textContent?.trim() || "Description not found";
    const shortDescription = descriptionText.length > 100 ? descriptionText.substring(0, 100) + "..." : descriptionText;
    console.log("[YouTube Tracker] Description:", shortDescription);

    // Build metadata object
    const videoData = {
        title: title?.textContent?.trim() || "Title not found",
        channel: channel?.textContent?.trim() || "Channel not found",
        description: shortDescription,
        url: window.location.href,
        start_time: new Date().toISOString(),  // ← Changed from 'timestamp'
        end_time: null,                        // ← Added required field  
        total_seconds: 0                       // ← Added required field
    };
    console.log("[YouTube Tracker] videoData:", videoData);
    
    // Send metadata to background script
    chrome.runtime.sendMessage({
        type: 'METADATA',
        data: videoData
    });
}, 1000);

// Time tracking - Task 9
let startTime = Date.now();

// Save time data when leaving the page
window.addEventListener('beforeunload', () => {
    const totalTime = Date.now() - startTime;
    const timeSpent = Math.round(totalTime / 1000); // in seconds
    
    const timeData = {
        url: window.location.href,
        title: "Video watched",           // ← Add required fields
        channel: "Unknown",               // ← Add required fields  
        description: "",                  // ← Add required fields
        start_time: new Date(startTime).toISOString(), // ← Changed from timestamp
        end_time: new Date().toISOString(),            // ← Add end time
        total_seconds: timeSpent          // ← Changed from timeSpent
    };
    
    // Send time data to background script
    chrome.runtime.sendMessage({
        type: 'TIME_DATA',
        data: timeData
    });
    
    console.log(`[YouTube Tracker] Time spent: ${timeSpent} seconds`);
});