import { getSettings, saveSettings } from '../shared/storage';
import { isSiteEnabled, normaliseDomain, ThemeMode } from '../shared/types';

const $ = <T extends HTMLElement>(selector: string): T => document.querySelector<T>(selector)!;

async function getCurrentDomain(): Promise<string> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  try { return normaliseDomain(new URL(tabs[0]?.url ?? '').hostname); } catch { return 'this page'; }
}

async function boot(): Promise<void> {
  let settings = await getSettings();
  const domain = await getCurrentDomain();
  const power = $('#power-toggle');
  const label = $('#enabled-label');
  const siteToggle = $('#site-toggle');
  const siteLed = $('#site-led');
  const update = (next = settings) => {
    settings = next;
    const siteOn = isSiteEnabled(next, domain);
    label.textContent = next.enabled ? 'ON' : 'OFF';
    power.textContent = next.enabled ? 'ON' : 'OFF';
    power.classList.toggle('off', !next.enabled);
    siteToggle.textContent = siteOn ? 'ON' : 'OFF';
    siteToggle.classList.toggle('off', !siteOn);
    siteLed.classList.toggle('off', !siteOn);
    $('#site-name').textContent = domain;
    $<HTMLInputElement>(`input[name="mode"][value="${next.mode}"]`).checked = true;
    $<HTMLInputElement>('#intensity').value = String(next.intensity);
    $('#intensity-value').textContent = `${next.intensity}%`;
  };
  update();
  power.addEventListener('click', async () => update(await saveSettings({ enabled: !settings.enabled })));
  siteToggle.addEventListener('click', async () => {
    const siteOn = isSiteEnabled(settings, domain);
    if (settings.enabled) {
      const disabledSites = siteOn ? [...new Set([...settings.disabledSites, domain])] : settings.disabledSites.filter((site) => normaliseDomain(site) !== domain);
      update(await saveSettings({ disabledSites }));
    } else {
      const enabledSites = siteOn ? settings.enabledSites.filter((site) => normaliseDomain(site) !== domain) : [...new Set([...settings.enabledSites, domain])];
      update(await saveSettings({ enabledSites }));
    }
  });
  document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((input) => input.addEventListener('change', async () => update(await saveSettings({ mode: input.value as ThemeMode }))));
  $('#intensity').addEventListener('input', () => { $('#intensity-value').textContent = `${$<HTMLInputElement>('#intensity').value}%`; });
  $('#intensity').addEventListener('change', async () => update(await saveSettings({ intensity: Number($<HTMLInputElement>('#intensity').value) })));
  $('#settings-button').addEventListener('click', () => void chrome.runtime.openOptionsPage());
  $('#open-github').addEventListener('click', () => void chrome.tabs.create({ url: 'https://github.com/harshil-arora/retr-0' }));
}

void boot();
