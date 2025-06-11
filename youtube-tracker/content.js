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
        timestamp: new Date().toISOString()
    };
    console.log("[YouTube Tracker] videoData:", videoData);
}, 1000);

// Time tracking - Task 9
let startTime = Date.now();

// Save time data when leaving the page
window.addEventListener('beforeunload', () => {
    const totalTime = Date.now() - startTime;
    const timeSpent = Math.round(totalTime / 1000); // in seconds
    
    const timeData = {
        url: window.location.href,
        timeSpent: timeSpent,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };
    
    // Store in chrome storage
    chrome.storage.local.get(['youtubeTimeData'], (result) => {
        const existingData = result.youtubeTimeData || [];
        existingData.push(timeData);
        chrome.storage.local.set({ youtubeTimeData: existingData });
    });
    
    console.log(`[YouTube Tracker] Time spent: ${timeSpent} seconds`);
});