import { textSignal } from '../shared/dom';

export type ElementKind =
  | 'page'
  | 'heading'
  | 'button'
  | 'input'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'link'
  | 'nav'
  | 'card'
  | 'dialog'
  | 'tabs'
  | 'menu'
  | 'table'
  | 'progress'
  | 'code'
  | 'media'
  | 'form'
  | 'separator'
  | 'generic';

const cardWords = /card|panel|tile|widget|surface|sidebar|aside|popover|dropdown|drawer|toast/;
const dialogWords = /modal|dialog|alertdialog|lightbox/;
const tabWords = /tab|tabs|segmented/;
const menuWords = /menu|menubar|context-menu|breadcrumb/;

export function classify(element: Element): ElementKind {
  const tag = element.tagName.toLowerCase();
  const role = element.getAttribute('role')?.toLowerCase() ?? '';
  const signal = textSignal(element);
  const type = element.getAttribute('type')?.toLowerCase() ?? '';

  if (/^h[1-6]$/.test(tag)) return 'heading';
  if (tag === 'button' || role === 'button' || element.getAttribute('aria-haspopup') === 'menu') return 'button';
  if (tag === 'a' && element.getAttribute('href')) return 'link';
  if (tag === 'nav' || role === 'navigation' || role === 'menubar') return 'nav';
  if (tag === 'select' || role === 'combobox') return 'select';
  if (tag === 'textarea') return 'textarea';
  if (tag === 'input') {
    if (type === 'checkbox' || role === 'checkbox') return 'checkbox';
    if (type === 'radio' || role === 'radio') return 'radio';
    return 'input';
  }
  if (role === 'dialog' || role === 'alertdialog' || dialogWords.test(signal)) return 'dialog';
  if (role === 'tablist' || role === 'tab' || tabWords.test(signal)) return 'tabs';
  if (role === 'menu' || role === 'menuitem' || menuWords.test(signal)) return 'menu';
  if (tag === 'table' || role === 'grid' || role === 'table') return 'table';
  if (tag === 'progress' || role === 'progressbar') return 'progress';
  if (tag === 'code' || tag === 'pre' || role === 'code') return 'code';
  if (tag === 'form') return 'form';
  if (tag === 'hr' || role === 'separator') return 'separator';
  if (/^(img|video|audio|canvas|svg)$/.test(tag)) return 'media';
  if (cardWords.test(signal) || isPanelLike(element)) return 'card';
  return tag === 'body' || tag === 'html' || tag === 'main' ? 'page' : 'generic';
}

function isPanelLike(element: Element): boolean {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const hasBoundary = style.borderStyle !== 'none' || style.boxShadow !== 'none' || style.backgroundColor !== 'rgba(0, 0, 0, 0)';
  return hasBoundary && rect.width > 160 && rect.height > 52 && element.children.length > 0;
}

export function shouldTransform(element: Element): boolean {
  if (element.matches('script, style, link, meta, title, head, noscript, template')) return false;
  if (element.id === 'retr0-overlay' || element.closest('[data-retr0-owned]')) return false;
  return true;
}
