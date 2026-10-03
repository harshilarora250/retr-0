import { getSettings, saveSettings } from '../shared/storage';
import { Retr0Settings, ThemeMode } from '../shared/types';

const $ = <T extends HTMLElement>(selector: string): T => document.querySelector<T>(selector)!;

function renderDomains(settings: Retr0Settings, key: 'disabledSites' | 'enabledSites'): void {
  const target = $(`#${key === 'disabledSites' ? 'disabled' : 'enabled'}-sites`);
  const empty = $(`#${key === 'disabledSites' ? 'disabled' : 'enabled'}-empty`);
  const count = $(`#${key === 'disabledSites' ? 'disabled' : 'enabled'}-count`);
  target.replaceChildren();
  count.textContent = String(settings[key].length);
  empty.hidden = settings[key].length > 0;
  settings[key].forEach((domain) => {
    const row = document.createElement('div'); row.className = 'domain-row';
    const name = document.createElement('span'); name.textContent = domain;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove';
    remove.addEventListener('click', async () => {
      const next = await saveSettings({ [key]: settings[key].filter((site) => site !== domain) });
      render(next);
    });
    row.append(name, remove); target.append(row);
  });
}

function render(settings: Retr0Settings): void {
  $('#enabled').textContent = settings.enabled ? 'ON' : 'OFF';
  $('#enabled').classList.toggle('off', !settings.enabled);
  $('#animation').textContent = settings.animation ? 'ON' : 'OFF';
  $('#animation').classList.toggle('off', !settings.animation);
  $<HTMLInputElement>(`input[name="mode"][value="${settings.mode}"]`).checked = true;
  $<HTMLInputElement>('#intensity').value = String(settings.intensity);
  $('#intensity-value').textContent = `${settings.intensity}%`;
  renderDomains(settings, 'disabledSites'); renderDomains(settings, 'enabledSites');
}

async function boot(): Promise<void> {
  let settings = await getSettings();
  const sync = async (change: Partial<Retr0Settings>) => { settings = await saveSettings(change); render(settings); };
  render(settings);
  $('#enabled').addEventListener('click', () => void sync({ enabled: !settings.enabled }));
  $('#animation').addEventListener('click', () => void sync({ animation: !settings.animation }));
  document.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((input) => input.addEventListener('change', () => void sync({ mode: input.value as ThemeMode })));
  $('#intensity').addEventListener('input', () => $('#intensity-value').textContent = `${$<HTMLInputElement>('#intensity').value}%`);
  $('#intensity').addEventListener('change', () => void sync({ intensity: Number($<HTMLInputElement>('#intensity').value) }));
  document.querySelectorAll<HTMLButtonElement>('.nav-item').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.settings-section').forEach((section) => section.classList.remove('active'));
    button.classList.add('active'); $(`#${button.dataset.section}`).classList.add('active');
  }));
}

void boot();
