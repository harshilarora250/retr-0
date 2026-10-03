export type ContentThemeMode = 'retro' | 'modern';

interface ContentSettings {
  enabled: boolean;
  mode: ContentThemeMode;
  intensity: number;
  animation: boolean;
  disabledSites: string[];
  enabledSites: string[];
}

const SETTINGS_KEY = 'retr0-settings';
const DEFAULT_SETTINGS: ContentSettings = {
  enabled: true,
  mode: 'retro',
  intensity: 84,
  animation: true,
  disabledSites: [],
  enabledSites: []
};

function normaliseDomain(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '').trim();
}

function sanitise(raw: Partial<ContentSettings> | undefined): ContentSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    mode: raw?.mode === 'modern' ? 'modern' : 'retro',
    intensity: Math.max(0, Math.min(100, Math.round(raw?.intensity ?? DEFAULT_SETTINGS.intensity))),
    disabledSites: Array.isArray(raw?.disabledSites) ? raw.disabledSites.filter(Boolean) : [],
    enabledSites: Array.isArray(raw?.enabledSites) ? raw.enabledSites.filter(Boolean) : []
  };
}

export async function getContentSettings(): Promise<ContentSettings> {
  const result = await chrome.storage.sync.get(SETTINGS_KEY);
  return sanitise(result[SETTINGS_KEY] as Partial<ContentSettings> | undefined);
}

export function watchContentSettings(callback: (settings: ContentSettings) => void): void {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes[SETTINGS_KEY]) callback(sanitise(changes[SETTINGS_KEY].newValue as Partial<ContentSettings> | undefined));
  });
}

export function isContentSiteEnabled(settings: ContentSettings, hostname: string): boolean {
  const domain = normaliseDomain(hostname);
  const matches = (site: string) => domain === normaliseDomain(site) || domain.endsWith(`.${normaliseDomain(site)}`);
  if (settings.enabledSites.some(matches)) return true;
  return settings.enabled && !settings.disabledSites.some(matches);
}
