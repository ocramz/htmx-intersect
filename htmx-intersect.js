/**
 * HTMX Intersection Observer Extension
 * 
 * A lightweight extension that integrates the Intersection Observer API with HTMX
 * to simplify scroll-based web experiences.
 * 
 * Usage:
 * <div hx-ext="intersect"
 *      hx-get="/api/content"
 *      hx-trigger="intersect"
 *      intersect-root="#container"
 *      intersect-threshold="0.5"
 *      intersect-margin="0px">
 *   Content loads when visible
 * </div>
 * 
 * Attributes:
 * - hx-trigger="intersect" - Triggers request when element intersects
 * - hx-trigger="intersect once" - Triggers only once (for lazy loading)
 * - intersect-root - Root element selector (default: viewport)
 * - intersect-threshold - Visibility threshold 0.0-1.0 (default: 0)
 * - intersect-margin - Root margin like CSS margin (default: "0px")
 * - intersect-scroll-margin - Margin around nested scroll containers (default: "0px")
 * - intersect-unload - Remove element when exiting viewport (values: "true", "content", "hide")
 * - intersect-unload-delay - Delay before unloading in ms (default: 0)
 * 
 * Events emitted:
 * - intersect:enter - When element enters viewport
 * - intersect:exit - When element exits viewport
 * - intersect:visible - Continuous while visible
 * - intersect:beforeunload - Before element is unloaded
 * - intersect:unload - After element is unloaded
 */

(function() {
    'use strict';

    // Store observers to manage lifecycle
    const observers = new WeakMap();
    const observerConfigs = new WeakMap();

    /**
     * Parse threshold value from attribute
     * Can be single number or comma-separated list
     */
    function parseThreshold(value) {
        if (!value) return 0;
        
        const parts = value.split(',').map(v => parseFloat(v.trim()));
        return parts.length === 1 ? parts[0] : parts;
    }

    /**
     * Get the root element from selector
     */
    function getRootElement(selector) {
        if (!selector || selector === 'null' || selector === 'viewport') {
            return null;
        }
        return document.querySelector(selector);
    }

    /**
     * Create observer configuration from element attributes
     */
    function getObserverConfig(element) {
        const root = getRootElement(element.getAttribute('intersect-root'));
        const rootMargin = element.getAttribute('intersect-margin') || '0px';
        const scrollMargin = element.getAttribute('intersect-scroll-margin') || '0px';
        const threshold = parseThreshold(element.getAttribute('intersect-threshold'));

        return {
            root,
            rootMargin,
            scrollMargin,
            threshold
        };
    }

    /**
     * Create a unique key for observer configuration
     */
    function getConfigKey(config) {
        return JSON.stringify({
            root: config.root ? config.root.id || config.root.className : null,
            rootMargin: config.rootMargin,
            scrollMargin: config.scrollMargin,
            threshold: config.threshold
        });
    }

    /**
     * Get or create an IntersectionObserver for the given configuration
     */
    function getObserver(config, callback) {
        const key = getConfigKey(config);
        
        if (!observers.has(key)) {
            const observer = new IntersectionObserver(callback, config);
            observers.set(key, observer);
            observerConfigs.set(key, config);
        }
        
        return observers.get(key);
    }

    /**
     * Handle element unloading when it exits viewport
     */
    function handleUnload(element) {
        const unloadMode = element.getAttribute('intersect-unload');
        const unloadDelay = parseInt(element.getAttribute('intersect-unload-delay') || '0', 10);
        
        if (!unloadMode || unloadMode === 'false') {
            return;
        }
        
        const performUnload = () => {
            // Fire before unload event (can be prevented)
            const beforeUnloadEvent = htmx.trigger(element, 'intersect:beforeunload', {
                mode: unloadMode
            });
            
            // Check if event was prevented
            if (beforeUnloadEvent.defaultPrevented) {
                return;
            }
            
            // Store reference to parent for the after-unload event
            const parent = element.parentElement;
            
            switch (unloadMode) {
                case 'true':
                case 'remove':
                    // Completely remove element from DOM
                    element.remove();
                    break;
                    
                case 'content':
                    // Remove only the content, keep the element shell
                    // Store original content if not already stored
                    if (!element._htmxIntersectOriginalContent) {
                        element._htmxIntersectOriginalContent = element.innerHTML;
                    }
                    element.innerHTML = element.getAttribute('intersect-unload-placeholder') || '';
                    break;
                    
                case 'hide':
                    // Just hide the element
                    element.style.display = 'none';
                    break;
                    
                default:
                    console.warn('htmx-intersect: Unknown unload mode:', unloadMode);
            }
            
            // Fire after unload event
            if (parent) {
                htmx.trigger(parent, 'intersect:unload', {
                    mode: unloadMode,
                    element: element
                });
            }
        };
        
        if (unloadDelay > 0) {
            // Store timeout ID so it can be cancelled if element re-enters
            element._htmxIntersectUnloadTimeout = setTimeout(performUnload, unloadDelay);
        } else {
            performUnload();
        }
    }
    
    /**
     * Cancel pending unload if element re-enters viewport
     */
    function cancelUnload(element) {
        if (element._htmxIntersectUnloadTimeout) {
            clearTimeout(element._htmxIntersectUnloadTimeout);
            delete element._htmxIntersectUnloadTimeout;
        }
    }
    
    /**
     * Restore element content if it was previously unloaded
     */
    function restoreContent(element) {
        const unloadMode = element.getAttribute('intersect-unload');
        
        if (unloadMode === 'content' && element._htmxIntersectOriginalContent) {
            element.innerHTML = element._htmxIntersectOriginalContent;
        } else if (unloadMode === 'hide') {
            element.style.display = '';
        }
    }

    /**
     * Handle intersection changes
     */
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            const element = entry.target;
            
            // Get element's trigger configuration
            const trigger = element.getAttribute('hx-trigger');
            const isOnce = trigger && trigger.includes('once');
            const hasUnload = element.getAttribute('intersect-unload');
            
            if (entry.isIntersecting) {
                // Cancel any pending unload
                if (hasUnload) {
                    cancelUnload(element);
                    restoreContent(element);
                }
                
                // Element is entering viewport
                htmx.trigger(element, 'intersect:enter', {
                    ratio: entry.intersectionRatio,
                    time: entry.time,
                    bounds: entry.boundingClientRect
                });
                
                // Trigger htmx request if configured
                if (trigger && trigger.includes('intersect')) {
                    htmx.trigger(element, 'intersect', {
                        ratio: entry.intersectionRatio
                    });
                    
                    // If once, unobserve after triggering
                    if (isOnce) {
                        observer.unobserve(element);
                    }
                }
                
                // Add visual state class
                element.classList.add('intersecting');
            } else {
                // Element is exiting viewport
                htmx.trigger(element, 'intersect:exit', {
                    ratio: entry.intersectionRatio,
                    time: entry.time
                });
                
                // Remove visual state class
                element.classList.remove('intersecting');
                
                // Handle unloading if configured
                if (hasUnload) {
                    handleUnload(element);
                }
            }
            
            // Always emit visible event with current ratio
            htmx.trigger(element, 'intersect:visible', {
                ratio: entry.intersectionRatio,
                isIntersecting: entry.isIntersecting
            });
        });
    }

    /**
     * Start observing an element
     */
    function observe(element) {
        // Don't observe if already being observed
        if (element._htmxIntersectObserved) {
            return;
        }
        
        const config = getObserverConfig(element);
        const observer = getObserver(config, handleIntersection);
        
        observer.observe(element);
        element._htmxIntersectObserved = true;
        
        // Store observer reference for cleanup
        element._htmxIntersectObserver = observer;
    }

    /**
     * Stop observing an element
     */
    function unobserve(element) {
        if (element._htmxIntersectObserver && element._htmxIntersectObserved) {
            element._htmxIntersectObserver.unobserve(element);
            element._htmxIntersectObserved = false;
            delete element._htmxIntersectObserver;
        }
    }

    // Define the extension
    htmx.defineExtension('intersect', {
        /**
         * Called when extension is first loaded
         */
        init: function(api) {
            // Check if IntersectionObserver is supported
            if (!('IntersectionObserver' in window)) {
                console.warn('htmx-intersect: IntersectionObserver API is not supported in this browser');
                return;
            }
        },

        /**
         * Called when htmx processes an element with this extension
         */
        onEvent: function(name, evt) {
            const element = evt.detail.elt || evt.target;
            
            if (name === 'htmx:afterProcessNode') {
                // Start observing after element is processed
                if (element.hasAttribute('hx-trigger') && 
                    element.getAttribute('hx-trigger').includes('intersect')) {
                    observe(element);
                }
            } else if (name === 'htmx:beforeCleanupElement') {
                // Stop observing before element is removed
                unobserve(element);
            }
            
            return true;
        }
    });

    // Expose utility functions for advanced usage
    htmx.intersect = {
        observe: observe,
        unobserve: unobserve,
        
        /**
         * Manually create an observer with custom callback
         * Useful for complex scenarios
         */
        createObserver: function(config, callback) {
            return new IntersectionObserver(callback, config);
        }
    };

})();
