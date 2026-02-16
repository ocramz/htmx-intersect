# Quick Start Guide

Get started with the HTMX Intersection Observer extension in under 5 minutes!

## 1. Installation

### Option A: CDN (Fastest)

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <script src="htmx-intersect.js"></script>
</head>
<body>
    <!-- Your content here -->
</body>
</html>
```

### Option B: NPM

```bash
npm install htmx-intersect
```

```javascript
import 'htmx-intersect';
```

## 2. Your First Intersection

Let's create a simple lazy-loading image:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <script src="htmx-intersect.js"></script>
    <style>
        .content {
            height: 1000px;
            background: linear-gradient(to bottom, #667eea, #764ba2);
        }
        .lazy-element {
            opacity: 0;
            transition: opacity 0.5s;
        }
        .lazy-element.intersecting {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>Scroll down to see the magic! ↓</h1>
    </div>

    <div hx-ext="intersect"
         hx-get="/api/content"
         hx-trigger="intersect once"
         class="lazy-element">
        This content loads when you scroll to it!
    </div>
</body>
</html>
```

## 3. Common Use Cases

### Lazy Load Images

```html
<img hx-ext="intersect"
     hx-get="/api/image"
     hx-trigger="intersect once"
     src="placeholder.jpg">
```

### Infinite Scroll

```html
<div id="posts">
    <!-- Your posts -->
</div>

<div hx-ext="intersect"
     hx-get="/api/more-posts"
     hx-trigger="intersect once"
     hx-target="#posts"
     hx-swap="beforeend">
    Loading more...
</div>
```

### Fade In Animation

```html
<style>
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    .fade-in.intersecting {
        opacity: 1;
        transform: translateY(0);
    }
</style>

<div hx-ext="intersect"
     hx-trigger="intersect"
     class="fade-in">
    I fade in when visible!
</div>
```

### Memory-Efficient Infinite Scroll

```html
<!-- Each item unloads when scrolled past -->
<div class="post"
     hx-ext="intersect"
     intersect-unload="content"
     intersect-unload-delay="1000"
     intersect-margin="1500px"
     intersect-unload-placeholder="<div class='skeleton'>Loading...</div>">
  Heavy content here (images, videos, etc)
</div>

<!-- Load more trigger -->
<div hx-ext="intersect"
     hx-get="/api/more"
     hx-trigger="intersect once">
  Load more...
</div>
```

## 4. Key Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `hx-trigger="intersect"` | Trigger when element intersects | Required |
| `hx-trigger="intersect once"` | Trigger only once | For lazy loading |
| `intersect-threshold="0.5"` | Trigger at 50% visible | `0` to `1.0` |
| `intersect-margin="200px"` | Trigger 200px early | CSS margin format |
| `intersect-root="#container"` | Observe within container | Selector |
| `intersect-unload="content"` | Unload when not visible | Memory management |
| `intersect-unload-delay="1000"` | Delay before unload | Milliseconds |

## 5. Events You Can Use

```html
<div hx-ext="intersect"
     data-hx-on:intersect:enter="console.log('Entered!')"
     data-hx-on:intersect:exit="console.log('Exited!')"
     data-hx-on:intersect:visible="console.log(event.detail.ratio)">
    Content
</div>
```

## 6. Tips & Tricks

### ✅ DO:
- Use `once` for one-time loads (lazy loading)
- Set appropriate thresholds for your use case
- Use root margins to preload content
- Combine with CSS for smooth animations

### ❌ DON'T:
- Use too many threshold values (performance)
- Forget the `intersecting` class for CSS
- Set threshold > 1.0 (invalid)

## 7. Debugging

Open your browser console:

```javascript
// Check if extension loaded
console.log(htmx.intersect); // Should output object

// Listen to events globally
document.addEventListener('intersect:enter', (e) => {
    console.log('Element entered:', e.target);
});
```

## 8. Next Steps

- 📖 Read the [full documentation](README.md)
- 🎮 Try the [interactive demo](demo.html)
- 💡 Browse [examples](EXAMPLES.md)
- 🧪 Run the [test suite](test.html)

## Common Issues

### Element not triggering?
- Ensure `hx-trigger="intersect"` is set
- Check element has non-zero dimensions
- Verify threshold is appropriate (default is 0)

### Triggering multiple times?
- Add `once` modifier: `hx-trigger="intersect once"`
- Or set higher threshold: `intersect-threshold="0.5"`

### Not working in scrollable div?
- Set `intersect-root` to the container ID
- Example: `intersect-root="#myContainer"`

## Need Help?

- 📚 [Full Documentation](README.md)
- 💬 [GitHub Issues](https://github.com/yourusername/htmx-intersect/issues)
- 🌐 [HTMX Discord](https://htmx.org/discord)

---

**That's it!** You're ready to create amazing scroll-based experiences with HTMX! 🚀
