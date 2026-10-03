import { isElement } from '../shared/dom';
import { Transformer } from './transformer';

export class MutationHandler {
  private observer: MutationObserver | undefined;
  private queued = new Set<Element>();
  private scheduled = false;

  constructor(private readonly transformer: Transformer) {}

  start(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (isElement(node)) this.queued.add(node);
        });
      }
      this.schedule();
    });
    this.observer.observe(document.documentElement, { childList: true, subtree: true });
    this.watchSpaNavigation();
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.scheduled = false;
      const pending = [...this.queued];
      this.queued.clear();
      pending.forEach((element) => this.transformer.transform(element));
    });
  }

  private watchSpaNavigation(): void {
    const signal = () => window.setTimeout(() => this.transformer.transform(document.body), 0);
    for (const method of ['pushState', 'replaceState'] as const) {
      type NavigationArgs = [data: unknown, unused: string, url?: string | URL | null];
      const original = history[method] as (...args: NavigationArgs) => unknown;
      history[method] = ((...args: NavigationArgs) => {
        const result = original(...args);
        signal();
        return result;
      }) as History[typeof method];
    }
    window.addEventListener('popstate', signal);
  }
}
