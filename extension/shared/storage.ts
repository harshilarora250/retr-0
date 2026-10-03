import { DEFAULT_SETTINGS, Retr0Settings, SettingsChange, clampIntensity } from './types';

const SETTINGS_KEY = 'retr0-settings';

function sanitise(raw: Partial<Retr0Settings> | undefined): Retr0Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    mode: raw?.mode === 'modern' ? 'modern' : 'retro',
    intensity: clampIntensity(raw?.intensity ?? DEFAULT_SETTINGS.intensity),
    disabledSites: Array.isArray(raw?.disabledSites) ? raw.disabledSites.filter(Boolean) : [],
    enabledSites: Array.isArray(raw?.enabledSites) ? raw.enabledSites.filter(Boolean) : []
  };
}

export async function getSettings(): Promise<Retr0Settings> {
  const result = await chrome.storage.sync.get(SETTINGS_KEY);
  return sanitise(result[SETTINGS_KEY] as Partial<Retr0Settings> | undefined);
}

export async function saveSettings(change: SettingsChange): Promise<Retr0Settings> {
  const current = await getSettings();
  const next = sanitise({ ...current, ...change });
  await chrome.storage.sync.set({ [SETTINGS_KEY]: next });
  return next;
}

export function watchSettings(callback: (settings: Retr0Settings) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes[SETTINGS_KEY]) callback(sanitise(changes[SETTINGS_KEY].newValue));
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
