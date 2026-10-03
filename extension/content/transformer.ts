import { isRetr0Owned } from '../shared/dom';
import { classify, ElementKind, shouldTransform } from './classifier';

const CLASS_PREFIX = 'retr0-kind-';

export class Transformer {
  private readonly seen = new WeakSet<Element>();

  transform(root: ParentNode): void {
    if (root instanceof Element && shouldTransform(root)) this.transformElement(root);
    root.querySelectorAll?.('*').forEach((element) => {
      if (shouldTransform(element)) this.transformElement(element);
    });
  }

  private transformElement(element: Element): void {
    if (this.seen.has(element) || isRetr0Owned(element)) return;
    const kind = classify(element);
    this.seen.add(element);
    element.classList.add(`${CLASS_PREFIX}${kind}`);
    element.setAttribute('data-retr0-transformed', 'true');
    if (kind === 'input' || kind === 'textarea' || kind === 'select') {
      element.setAttribute('data-retr0-control', 'true');
    }
    if (kind === 'card' || kind === 'dialog') {
      element.setAttribute('data-retr0-surface', kind);
    }
  }
}

export function kindClass(kind: ElementKind): string {
  return `${CLASS_PREFIX}${kind}`;
}
