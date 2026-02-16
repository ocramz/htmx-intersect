/**
 * HTMX Intersection Observer Extension Type Definitions
 */

declare namespace htmx {
  interface Intersect {
    /**
     * Manually start observing an element
     * @param element - The element to observe
     */
    observe(element: HTMLElement): void;

    /**
     * Stop observing an element
     * @param element - The element to stop observing
     */
    unobserve(element: HTMLElement): void;

    /**
     * Create a custom IntersectionObserver
     * @param config - IntersectionObserver configuration
     * @param callback - Callback function for intersection changes
     */
    createObserver(
      config: IntersectionObserverInit,
      callback: IntersectionObserverCallback
    ): IntersectionObserver;
  }

  /**
   * Intersection utilities exposed on the htmx object
   */
  const intersect: Intersect;
}

/**
 * Custom intersection events
 */
interface IntersectionEventDetail {
  ratio: number;
  time: number;
  bounds?: DOMRectReadOnly;
  isIntersecting?: boolean;
}

interface IntersectEnterEvent extends CustomEvent {
  detail: IntersectionEventDetail;
}

interface IntersectExitEvent extends CustomEvent {
  detail: IntersectionEventDetail;
}

interface IntersectVisibleEvent extends CustomEvent {
  detail: IntersectionEventDetail;
}

interface IntersectBeforeUnloadEvent extends CustomEvent {
  detail: {
    mode: string;
  };
}

interface IntersectUnloadEvent extends CustomEvent {
  detail: {
    mode: string;
    element: HTMLElement;
  };
}

/**
 * HTML element attributes for the extension
 */
interface HTMLElement {
  /**
   * @attr intersect-root - Selector for the root element (default: viewport)
   */
  'intersect-root'?: string;

  /**
   * @attr intersect-threshold - Visibility threshold(s) 0.0-1.0
   * Can be single value or comma-separated list
   */
  'intersect-threshold'?: string;

  /**
   * @attr intersect-margin - Margin around root (CSS margin format)
   */
  'intersect-margin'?: string;

  /**
   * @attr intersect-scroll-margin - Margin around nested scroll containers
   */
  'intersect-scroll-margin'?: string;

  /**
   * @attr intersect-unload - Control element unloading when exiting viewport
   * Values: "true"/"remove" (remove from DOM), "content" (remove innerHTML), "hide" (display:none)
   */
  'intersect-unload'?: 'true' | 'remove' | 'content' | 'hide' | 'false';

  /**
   * @attr intersect-unload-delay - Delay before unloading in milliseconds
   */
  'intersect-unload-delay'?: string;

  /**
   * @attr intersect-unload-placeholder - HTML to show when using intersect-unload="content"
   */
  'intersect-unload-placeholder'?: string;
}

/**
 * Event type declarations for TypeScript
 */
declare global {
  interface HTMLElementEventMap {
    'intersect:enter': IntersectEnterEvent;
    'intersect:exit': IntersectExitEvent;
    'intersect:visible': IntersectVisibleEvent;
    'intersect:beforeunload': IntersectBeforeUnloadEvent;
    'intersect:unload': IntersectUnloadEvent;
  }
}

export {};
