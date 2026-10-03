export type ThemeMode = 'retro' | 'modern';

export interface Retr0Settings {
  enabled: boolean;
  mode: ThemeMode;
  intensity: number;
  animation: boolean;
  disabledSites: string[];
  enabledSites: string[];
}

export const DEFAULT_SETTINGS: Retr0Settings = {
  enabled: true,
  mode: 'retro',
  intensity: 84,
  animation: true,
  disabledSites: [],
  enabledSites: []
};

export type SettingsChange = Partial<Retr0Settings>;

export function clampIntensity(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normaliseDomain(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '').trim();
}

export function isSiteEnabled(settings: Retr0Settings, hostname: string): boolean {
  const domain = normaliseDomain(hostname);
  const matches = (site: string) => domain === normaliseDomain(site) || domain.endsWith(`.${normaliseDomain(site)}`);
  if (settings.enabledSites.some(matches)) return true;
  if (!settings.enabled) return false;
  return !settings.disabledSites.some(matches);
}
