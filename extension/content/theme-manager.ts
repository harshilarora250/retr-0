import { Retr0Settings } from '../shared/types';

export function applyTheme(settings: Retr0Settings): void {
  const root = document.documentElement;
  root.dataset.retr0 = 'on';
  root.dataset.retr0Theme = settings.mode;
  root.style.setProperty('--retr0-intensity', `${settings.intensity / 100}`);
  root.style.setProperty('--retr0-intensity-percent', `${settings.intensity}%`);
  root.style.setProperty('--retr0-modernity', `${settings.mode === 'modern' ? 1 : 0}`);
}

export function removeTheme(): void {
  const root = document.documentElement;
  delete root.dataset.retr0;
  delete root.dataset.retr0Theme;
  root.style.removeProperty('--retr0-intensity');
  root.style.removeProperty('--retr0-intensity-percent');
  root.style.removeProperty('--retr0-modernity');
}
