# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-16

### Added
- Initial release of HTMX Intersection Observer extension
- Core `intersect` trigger support for HTMX
- Support for `once` modifier for one-time triggers
- `intersect-root` attribute for custom root elements
- `intersect-threshold` attribute for visibility thresholds
- `intersect-margin` attribute for root margin configuration
- `intersect-scroll-margin` attribute for nested scroll containers
- **`intersect-unload` attribute for memory-efficient content unloading**
  - **`remove` mode**: Completely remove element from DOM
  - **`content` mode**: Remove innerHTML only (auto-restores on re-entry)
  - **`hide` mode**: Set display:none
- **`intersect-unload-delay` attribute for delayed unloading**
- **`intersect-unload-placeholder` attribute for placeholder content**
- Custom events: `intersect:enter`, `intersect:exit`, `intersect:visible`
- **New events: `intersect:beforeunload`, `intersect:unload`**
- Automatic `intersecting` CSS class management
- Observer reuse for elements with identical configurations
- TypeScript type definitions
- Comprehensive documentation and examples
- Interactive demo page
- **Memory management demo page**
- Test suite for manual verification

### Features
- ✨ Lazy loading support
- ♾️ Infinite scroll capability
- 📊 Visibility tracking
- 🎨 Animation integration
- 🔄 Observer lifecycle management
- 🎯 Multiple threshold support
- 📱 Nested scroll container support
- 🚀 Performance optimized with shared observers
- **♻️ Memory-efficient content unloading for long lists**
- **🎮 Virtual scrolling capability**
- **⚡ Preventable unload events**

### Documentation
- Complete README with usage examples
- API documentation
- Use case examples
- Best practices guide
- Interactive demo
- TypeScript definitions

[1.0.0]: https://github.com/yourusername/htmx-intersect/releases/tag/v1.0.0
