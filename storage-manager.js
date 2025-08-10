'use strict';

// Storage manager functionality
const initializeStorageManager = () => {
    // Listen for extension installation or update
    chrome.runtime.onInstalled.addListener(function(details) {
        console.log('Installation type:', details.reason);
        
        // Check for existing profile in local storage
        chrome.storage.local.get('profile', function(localData) {
            console.log('Local storage profile:', localData.profile ? 'exists' : 'not found');
            
            if (localData.profile) {
                // If found in local, save to sync
                chrome.storage.sync.set({ profile: localData.profile }, function() {
                    console.log('Profile restored to sync storage');
                });
            } else {
                // Check sync storage
                chrome.storage.sync.get('profile', function(syncData) {
                    console.log('Sync storage profile:', syncData.profile ? 'exists' : 'not found');
                    
                    if (syncData.profile) {
                        // If found in sync, save to local
                        chrome.storage.local.set({ profile: syncData.profile }, function() {
                            console.log('Profile restored to local storage');
                        });
                    }
                });
            }
        });
    });

    // Listen for sync storage changes
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync' && changes.profile) {
            console.log('Profile updated in sync storage');
            // Update local storage to match
            chrome.storage.local.set({ profile: changes.profile.newValue }, function() {
                console.log('Local storage updated to match sync');
            });
        }
    });
};

// Initialize storage management
initializeStorageManager();
