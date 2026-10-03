export function playTransformationAnimation(enabled: boolean): void {
  if (!enabled || sessionStorage.getItem('retr0-transformed')) return;
  sessionStorage.setItem('retr0-transformed', '1');
  const overlay = document.createElement('div');
  overlay.id = 'retr0-overlay';
  overlay.dataset.retr0Owned = 'true';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<span class="retr0-wand">✦</span><span class="retr0-sweep"></span>';
  (document.body ?? document.documentElement).appendChild(overlay);
  window.setTimeout(() => overlay.remove(), 1250);
}
