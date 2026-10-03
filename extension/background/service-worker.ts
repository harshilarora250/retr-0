import { DEFAULT_SETTINGS } from '../shared/types';

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') await chrome.storage.sync.set({ 'retr0-settings': DEFAULT_SETTINGS });
});

chrome.runtime.onMessage.addListener((message: { type?: string }, sender) => {
  if (message.type === 'refresh-page' && sender.tab?.id) {
    void chrome.tabs.reload(sender.tab.id);
  }
});
