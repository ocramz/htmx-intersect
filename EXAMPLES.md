# Usage Examples

This directory contains practical examples of using the HTMX Intersection Observer extension.

## Quick Examples

### 1. Basic Lazy Loading

```html
<img hx-ext="intersect"
     hx-get="/api/image"
     hx-trigger="intersect once"
     src="placeholder.jpg">
```

### 2. Infinite Scroll

```html
<div id="content">
  <!-- existing content -->
</div>

<div hx-ext="intersect"
     hx-get="/api/next-page"
     hx-trigger="intersect once"
     hx-target="#content"
     hx-swap="beforeend"
     intersect-margin="300px 0px 0px 0px">
  Loading...
</div>
```

### 3. Analytics/Impression Tracking

```html
<div hx-ext="intersect"
     hx-post="/analytics/impression"
     hx-trigger="intersect once"
     intersect-threshold="0.5"
     data-content-id="article-123">
  Article content
</div>
```

### 4. Progressive Component Loading

```html
<section hx-ext="intersect"
         hx-get="/components/heavy-widget"
         hx-trigger="intersect once"
         intersect-threshold="0.1">
  <div class="placeholder">Loading widget...</div>
</section>
```

### 5. Scroll-Triggered Animations

```html
<div hx-ext="intersect"
     hx-trigger="intersect"
     class="animate-on-scroll"
     data-hx-on:intersect:enter="this.classList.add('visible')">
  Animated content
</div>

<style>
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
```

### 6. Video Autoplay

```html
<video hx-ext="intersect"
       src="video.mp4"
       intersect-threshold="0.5"
       data-hx-on:intersect:enter="this.play()"
       data-hx-on:intersect:exit="this.pause()">
</video>
```

### 7. Load More Button Alternative

```html
<!-- Traditional approach -->
<button onclick="loadMore()">Load More</button>

<!-- Intersection Observer approach -->
<div hx-ext="intersect"
     hx-get="/api/more"
     hx-trigger="intersect once"
     intersect-threshold="1.0">
  Auto-loads when you scroll here
</div>
```

### 8. Nested Scroll Container

```html
<div id="scrollable" style="height: 400px; overflow-y: auto;">
  <div hx-ext="intersect"
       hx-get="/nested/content"
       hx-trigger="intersect once"
       intersect-root="#scrollable"
       intersect-threshold="0.3">
    Content loads within scrollable container
  </div>
</div>
```

### 9. Staggered Animations

```html
<div hx-ext="intersect"
     hx-trigger="intersect"
     style="transition-delay: 0s">
  Item 1
</div>

<div hx-ext="intersect"
     hx-trigger="intersect"
     style="transition-delay: 0.1s">
  Item 2
</div>

<div hx-ext="intersect"
     hx-trigger="intersect"
     style="transition-delay: 0.2s">
  Item 3
</div>
```

### 10. Loading Images with Fade-In

```html
<img hx-ext="intersect"
     hx-trigger="intersect once"
     hx-get="/api/image/high-res"
     src="thumbnail.jpg"
     style="opacity: 0.3; transition: opacity 0.5s"
     data-hx-on:intersect:enter="this.style.opacity = '1'">
```

### 11. Unload Content When Out of View (Memory Management)

```html
<!-- Remove only content, keep element (auto-restores) -->
<div hx-ext="intersect"
     intersect-unload="content"
     intersect-unload-delay="1000"
     intersect-unload-placeholder="<div class='skeleton'>Loading...</div>">
  Heavy content here
</div>
```

### 12. Remove Element Completely

```html
<!-- For one-time content like ads -->
<div hx-ext="intersect"
     hx-post="/analytics/viewed"
     hx-trigger="intersect once"
     intersect-unload="remove"
     intersect-unload-delay="5000">
  Ad content (removed 5s after leaving viewport)
</div>
```

### 13. Hide Element (Fastest Option)

```html
<video hx-ext="intersect"
       intersect-unload="hide"
       src="video.mp4">
  <!-- Video hidden when scrolled away -->
</video>
```

## Advanced Examples

### Custom Threshold Handling

```html
<div hx-ext="intersect"
     intersect-threshold="0,0.25,0.5,0.75,1.0"
     data-hx-on:intersect:visible="
       const ratio = event.detail.ratio;
       if (ratio === 0) {
         this.classList.add('not-visible');
       } else if (ratio < 0.5) {
         this.classList.add('partially-visible');
       } else if (ratio < 1.0) {
         this.classList.add('mostly-visible');
       } else {
         this.classList.add('fully-visible');
       }
     ">
  Content with state-based styling
</div>
```

### Progressive Image Loading

```html
<!-- Low quality placeholder -->
<picture>
  <source srcset="placeholder-mobile.jpg" media="(max-width: 600px)">
  <img src="placeholder.jpg" alt="Image"
       hx-ext="intersect"
       hx-trigger="intersect once"
       hx-get="/image/full-resolution"
       hx-swap="outerHTML"
       intersect-margin="50px">
</picture>
```

### Combining with Other HTMX Features

```html
<!-- Intersect + Polling -->
<div hx-ext="intersect"
     hx-get="/live-updates"
     hx-trigger="intersect once, every 5s"
     hx-swap="innerHTML">
  Starts polling when visible
</div>

<!-- Intersect + Indicator -->
<div hx-ext="intersect"
     hx-get="/content"
     hx-trigger="intersect once"
     hx-indicator=".spinner">
  Content
</div>
<div class="spinner htmx-indicator">Loading...</div>
```

### Performance Monitoring

```html
<div hx-ext="intersect"
     hx-trigger="intersect"
     intersect-threshold="0.5"
     data-hx-on:intersect:enter="
       console.time('content-visible-' + this.id);
     "
     data-hx-on:intersect:exit="
       console.timeEnd('content-visible-' + this.id);
     ">
  Track visibility duration
</div>
```

## Best Practices

1. **Use `once` for one-time loads** to prevent multiple requests
2. **Set appropriate thresholds** based on your use case
3. **Use root margins** to preload content before it's visible
4. **Combine with CSS** for smooth visual transitions
5. **Consider mobile** - adjust thresholds for different screen sizes
6. **Test performance** - use browser DevTools to verify efficient loading

## Common Patterns

### Blog Post Lazy Loading
```html
<article hx-ext="intersect"
         hx-get="/posts/{id}"
         hx-trigger="intersect once"
         intersect-threshold="0.1"
         intersect-margin="200px">
  <h2>Post Title</h2>
  <div class="post-body">Loading...</div>
</article>
```

### Product Grid Lazy Loading
```html
<div class="product-grid">
  <div class="product"
       hx-ext="intersect"
       hx-get="/products/1"
       hx-trigger="intersect once"
       intersect-threshold="0">
    Product 1
  </div>
  <!-- More products -->
</div>
```

### Comment Section Lazy Loading
```html
<div id="comments">
  <button hx-ext="intersect"
          hx-get="/comments"
          hx-trigger="intersect once"
          hx-target="#comments"
          hx-swap="innerHTML">
    Comments will auto-load when visible
  </button>
</div>
```

## Memory Management Patterns

### Infinite Scroll with Content Unloading

```html
<!-- Container -->
<div id="feed"></div>

<!-- Each loaded item includes unload config -->
<div class="post"
     hx-ext="intersect"
     intersect-unload="content"
     intersect-margin="1500px"
     intersect-unload-delay="1000"
     intersect-unload-placeholder="<div class='placeholder'>Post #{id}</div>">
  <h3>Post Title</h3>
  <p>Post content...</p>
  <!-- Heavy content: images, videos, etc -->
</div>

<!-- Load more trigger -->
<div hx-ext="intersect"
     hx-get="/api/posts?page=2"
     hx-trigger="intersect once"
     hx-target="#feed"
     hx-swap="beforeend">
  Loading more posts...
</div>
```

### Virtual Scrolling Pattern

```html
<!-- Works like a virtual list -->
<div class="virtual-list">
  <!-- Items load as needed -->
  <div class="list-item"
       hx-ext="intersect"
       hx-get="/api/item/1"
       hx-trigger="intersect"
       intersect-unload="content"
       intersect-margin="800px"
       intersect-unload-placeholder="<div class='item-shell'>Item 1</div>">
    <!-- Content populated on first load, unloaded when far away -->
  </div>
</div>
```

### Prevent Unloading Conditionally

```html
<div hx-ext="intersect"
     intersect-unload="content"
     data-hx-on:intersect:beforeunload="
       // Prevent unload if element has unsaved changes
       if (this.classList.contains('has-changes')) {
         event.preventDefault();
         console.log('Unload prevented - unsaved changes');
       }
     ">
  Form or editable content
</div>
```
