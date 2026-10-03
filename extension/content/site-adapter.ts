const SITE_BRANDS: Record<string, string> = {
  'google.com': '#4285f4',
  'youtube.com': '#ff0033',
  'github.com': '#24292f',
  'wikipedia.org': '#54595d',
  'x.com': '#111111'
};

export function applySiteIdentity(root: HTMLElement): void {
  const host = location.hostname.replace(/^www\./, '').toLowerCase();
  const match = Object.keys(SITE_BRANDS).find((domain) => host === domain || host.endsWith(`.${domain}`));
  root.dataset.retr0Site = match ?? 'generic';
  if (match) root.style.setProperty('--retr0-brand', SITE_BRANDS[match]);
}
