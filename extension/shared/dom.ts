export function isElement(value: Node): value is Element {
  return value.nodeType === Node.ELEMENT_NODE;
}

export function closestSafe(element: Element, selector: string): Element | null {
  try {
    return element.closest(selector);
  } catch {
    return null;
  }
}

export function textSignal(element: Element): string {
  return `${element.getAttribute('aria-label') ?? ''} ${element.getAttribute('title') ?? ''} ${element.className?.toString() ?? ''}`.toLowerCase();
}

export function isRetr0Owned(element: Element): boolean {
  return element.id === 'retr0-overlay' || element.closest('[data-retr0-owned]') !== null;
}
