# htmx-intersect

[![Playwright Tests](https://github.com/ocramz/htmx-intersect/actions/workflows/test.yml/badge.svg)](https://github.com/ocramz/htmx-intersect/actions/workflows/test.yml)

A lightweight HTMX extension that integrates the Intersection Observer API to simplify scroll-based web experiences like lazy loading, infinite scroll, and visibility tracking.

## Features

- 🚀 **Simple API** - Just add attributes to your HTML
- 🎯 **Lazy Loading** - Load content only when visible
- ♾️ **Infinite Scroll** - Automatically load more content
- 👁️ **Visibility Tracking** - Track when elements enter/exit viewport
- 🎨 **No Dependencies** - Works with vanilla HTMX
- ⚡ **Performant** - Uses native IntersectionObserver API
- 🔄 **Reusable Observers** - Shares observers across elements with same config

## Installation

### Via CDN

```html
<script src="https://unpkg.com/htmx.org@1.9.10"></script>
<script src="htmx-intersect.js"></script>
```

### Via npm

```bash
npm install htmx-intersect
```

```javascript
import 'htmx-intersect';
```

## Quick Start

### Basic Usage

```html
<div hx-ext="intersect"
     hx-get="/api/content"
     hx-trigger="intersect">
  This content will load when scrolled into view
</div>
```

### Lazy Loading Images

```html
<img hx-ext="intersect"
     hx-get="/api/image/123"
     hx-trigger="intersect once"
     hx-swap="outerHTML"
     src="placeholder.jpg"
     alt="Lazy loaded image">
```

### Infinite Scroll

```html
<div id="content">
  <!-- Your content here -->
</div>

<!-- Trigger element at the bottom -->
<div hx-ext="intersect"
     hx-get="/api/more?page=2"
     hx-trigger="intersect once"
     hx-target="#content"
     hx-swap="beforeend"
     intersect-threshold="0.5">
  Loading more...
</div>
```

## Configuration Attributes

### Core Attributes

#### `hx-trigger="intersect"`
Triggers an HTMX request when the element intersects with the viewport.

**Modifiers:**
- `once` - Trigger only the first time (perfect for lazy loading)
- Example: `hx-trigger="intersect once"`

### Extension-Specific Attributes

#### `intersect-root`
Specifies the root element to observe intersection against. If not set or set to `null` or `viewport`, uses the browser viewport.

```html
<div intersect-root="#scrollContainer">
  Observes intersection within #scrollContainer
</div>
```

#### `intersect-threshold`
The percentage of the element that must be visible to trigger. Can be:
- Single value: `0.5` (50% visible)
- Multiple values: `0,0.25,0.5,0.75,1` (triggers at each threshold)

```html
<!-- Trigger when 50% visible -->
<div intersect-threshold="0.5">

<!-- Trigger at 0%, 50%, and 100% -->
<div intersect-threshold="0,0.5,1.0">
```

**Default:** `0` (triggers as soon as any pixel is visible)

#### `intersect-margin`
Margin around the root element (similar to CSS margin). Positive values expand the root's area, negative values shrink it.

```html
<!-- Load content 200px before it enters viewport -->
<div intersect-margin="200px 0px 0px 0px">

<!-- Percentage-based -->
<div intersect-margin="10%">
```

**Default:** `"0px"`

#### `intersect-scroll-margin`
Margin around nested scroll containers. Useful when you have scrollable elements within the root.

```html
<div intersect-scroll-margin="50px">
```

**Default:** `"0px"`

#### `intersect-unload`
Controls whether and how to unload/remove elements when they exit the viewport. Great for memory management in infinite scroll scenarios.

**Values:**
- `"true"` or `"remove"` - Completely remove element from DOM
- `"content"` - Remove only innerHTML, keep element shell (content restored on re-entry)
- `"hide"` - Set `display: none` (faster than removal)
- `"false"` or omit - No unloading (default)

```html
<!-- Remove element when it exits viewport -->
<div intersect-unload="true">

<!-- Just hide the element -->
<div intersect-unload="hide">

<!-- Remove content but keep element -->
<div intersect-unload="content" 
     intersect-unload-placeholder="<div>Loading...</div>">
```

**Default:** Not set (no unloading)

#### `intersect-unload-delay`
Delay in milliseconds before unloading. Prevents flickering when scrolling quickly.

```html
<!-- Wait 2 seconds before unloading -->
<div intersect-unload="true" 
     intersect-unload-delay="2000">
```

**Default:** `0` (immediate)

#### `intersect-unload-placeholder`
HTML to show when using `intersect-unload="content"`. Only used with content mode.

```html
<div intersect-unload="content"
     intersect-unload-placeholder="<div class='skeleton'>Loading...</div>">
```

## Events

The extension emits custom events you can listen to:

### `intersect:enter`
Fired when element enters the viewport.

```javascript
element.addEventListener('intersect:enter', (event) => {
  console.log('Element entered!', event.detail);
  // detail: { ratio, time, bounds }
});
```

### `intersect:exit`
Fired when element exits the viewport.

```javascript
element.addEventListener('intersect:exit', (event) => {
  console.log('Element exited!', event.detail);
  // detail: { ratio, time }
});
```

### `intersect:visible`
Continuously fired with visibility updates.

```javascript
element.addEventListener('intersect:visible', (event) => {
  console.log('Visibility ratio:', event.detail.ratio);
  // detail: { ratio, isIntersecting }
});
```

### `intersect:beforeunload`
Fired before an element is unloaded (when using `intersect-unload`). Can be prevented.

```javascript
element.addEventListener('intersect:beforeunload', (event) => {
  console.log('About to unload', event.detail.mode);
  // Prevent unloading if needed
  if (shouldKeepElement) {
    event.preventDefault();
  }
});
```

### `intersect:unload`
Fired after an element is unloaded. Fired on the parent element.

```javascript
parent.addEventListener('intersect:unload', (event) => {
  console.log('Element unloaded:', event.detail.element);
  // detail: { mode, element }
});
```

## Use Cases & Examples

### 1. Lazy Loading Components

```html
<div class="lazy-component"
     hx-ext="intersect"
     hx-get="/components/widget"
     hx-trigger="intersect once"
     intersect-threshold="0.1">
  <div class="skeleton-loader">Loading...</div>
</div>
```

### 2. Infinite Scroll with Loading Indicator

```html
<div id="posts">
  <!-- Posts loaded here -->
</div>

<div hx-ext="intersect"
     hx-get="/api/posts"
     hx-trigger="intersect once"
     hx-target="#posts"
     hx-swap="beforeend"
     hx-indicator="#loading"
     intersect-margin="300px 0px 0px 0px">
  <div id="loading" class="htmx-indicator">
    <span>Loading more posts...</span>
  </div>
</div>
```

### 3. Analytics Tracking

```html
<div hx-ext="intersect"
     hx-post="/analytics/view"
     hx-trigger="intersect once"
     intersect-threshold="0.5"
     data-content-id="article-123">
  Article content here
</div>
```

### 4. Progressive Image Loading

```html
<picture hx-ext="intersect"
         hx-get="/images/high-res/photo.jpg"
         hx-trigger="intersect once"
         hx-swap="outerHTML"
         intersect-margin="100px">
  <img src="low-res-placeholder.jpg" alt="Photo">
</picture>
```

### 5. Video Autoplay on Scroll

```html
<video hx-ext="intersect"
       src="video.mp4"
       data-hx-on:intersect:enter="this.play()"
       data-hx-on:intersect:exit="this.pause()">
</video>
```

### 6. Sticky Header Detection

```html
<div id="header" 
     hx-ext="intersect"
     intersect-threshold="0,1"
     data-hx-on:intersect:visible="
       if (event.detail.ratio < 1) {
         this.classList.add('sticky');
       } else {
         this.classList.remove('sticky');
       }
     ">
  Header content
</div>
```

### 7. Content Loading in Scrollable Container

```html
<div id="scrollContainer" style="height: 400px; overflow-y: auto;">
  <div hx-ext="intersect"
       hx-get="/nested/content"
       hx-trigger="intersect once"
       intersect-root="#scrollContainer"
       intersect-threshold="0.5">
    Nested scrollable content
  </div>
</div>
```

### 8. Memory-Efficient Infinite Scroll (Unload Off-Screen Content)

```html
<div id="posts"></div>

<!-- Load new content -->
<div hx-ext="intersect"
     hx-get="/api/posts?page=2"
     hx-trigger="intersect once"
     hx-target="#posts"
     hx-swap="beforeend"
     intersect-margin="500px">
  Loading more...
</div>

<!-- Inside each post, enable unloading -->
<div class="post"
     hx-ext="intersect"
     intersect-unload="content"
     intersect-unload-delay="1000"
     intersect-unload-placeholder="<div class='skeleton'>Post removed from memory</div>">
  Post content here...
</div>
```

### 9. Virtual Scrolling with Content Unloading

```html
<!-- Each item unloads when far from viewport -->
<div class="list-item"
     hx-ext="intersect"
     hx-trigger="intersect"
     intersect-unload="content"
     intersect-margin="1000px"
     intersect-unload-placeholder="<div class='placeholder'>Item #{id}</div>">
  Heavy content here...
</div>
```

### 10. Remove Ads After Viewing

```html
<div class="advertisement"
     hx-ext="intersect"
     hx-post="/analytics/ad-viewed"
     hx-trigger="intersect once"
     intersect-threshold="0.5"
     intersect-unload="true"
     intersect-unload-delay="5000">
  Ad content (removed 5s after leaving viewport)
</div>
```

## Advanced Usage

### Manual Observer Control

For complex scenarios, you can use the JavaScript API:

```javascript
// Start observing an element
htmx.intersect.observe(element);

// Stop observing
htmx.intersect.unobserve(element);

// Create custom observer
const observer = htmx.intersect.createObserver(
  {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.5, 1]
  },
  (entries) => {
    entries.forEach(entry => {
      console.log('Intersection:', entry);
    });
  }
);

observer.observe(element);
```

### Combining with Other HTMX Features

```html
<!-- Intersect + Polling -->
<div hx-ext="intersect"
     hx-get="/live-data"
     hx-trigger="intersect once, every 5s">
  Start polling when visible
</div>

<!-- Intersect + WebSocket -->
<div hx-ext="intersect,ws"
     ws-connect="/live-feed"
     hx-trigger="intersect once">
  Connect to WebSocket when visible
</div>

<!-- Intersect + Animation -->
<div hx-ext="intersect"
     class="fade-in-element"
     data-hx-on:intersect:enter="this.classList.add('visible')">
  Animated content
</div>
```

## CSS Classes

The extension automatically adds/removes the `intersecting` class:

```css
.my-element {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
}

.my-element.intersecting {
  opacity: 1;
  transform: translateY(0);
}
```

## Browser Support

Works in all browsers that support:
- HTMX 1.9+
- IntersectionObserver API (all modern browsers)

For older browsers, consider using a [polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill).

## Performance Considerations

1. **Use `once` modifier** for one-time loads to automatically clean up observers
2. **Set appropriate thresholds** - Don't use too many threshold values
3. **Use root margins wisely** - Preload content just before it's needed
4. **Shared observers** - Elements with identical configs share observers

## Troubleshooting

### Element not triggering
- Ensure `hx-trigger="intersect"` is set
- Check that element has non-zero dimensions
- Verify `intersect-threshold` is appropriate
- Check browser console for errors

### Multiple triggers
- Add `once` modifier: `hx-trigger="intersect once"`
- Or use `intersect-threshold` to be more specific

### Not working in nested scrollers
- Set `intersect-root` to the scroll container
- Consider using `intersect-scroll-margin`

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT License - see LICENSE file for details

## Credits

Built with ❤️ for the HTMX community

- [HTMX](https://htmx.org/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
