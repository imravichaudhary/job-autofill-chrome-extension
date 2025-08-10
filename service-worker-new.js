'use strict';

// Constants for notifications and storage
const NOTIFICATION_TIMEOUT = 3000;
const MESSAGE_TYPE = "notification";
const PROFILE_KEY = "profile";

// Handle notifications
function createNotification(options) {
    chrome.notifications.create("", options);
    setTimeout(() => chrome.notifications.clear(options.id), NOTIFICATION_TIMEOUT);
}

// Handle messages from content scripts
function handleMessage(request, sender, sendResponse) {
    if (request.type === MESSAGE_TYPE) {
        createNotification(request.options);
    }
}

// Initialize storage sync
function initializeStorage() {
    chrome.storage.local.get(PROFILE_KEY, function(localData) {
        if (localData.profile) {
            chrome.storage.sync.set({ [PROFILE_KEY]: localData.profile }, () => {
                console.log('Profile synced to cloud storage');
            });
        } else {
            chrome.storage.sync.get(PROFILE_KEY, function(syncData) {
                if (syncData.profile) {
                    chrome.storage.local.set({ [PROFILE_KEY]: syncData.profile }, () => {
                        console.log('Profile restored from cloud storage');
                    });
                }
            });
        }
    });
}

// Event Listeners
chrome.runtime.onMessage.addListener(handleMessage);

// Install event listener
chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Service worker installed:', details.reason);
    initializeStorage();
});
