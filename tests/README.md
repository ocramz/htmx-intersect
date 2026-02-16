# HTMX Intersect - Test Suite

This directory contains the Playwright end-to-end test suite for the htmx-intersect library.

## Setup

Install dependencies:

```bash
npm install
npx playwright install chromium
```

## Running Tests

Run all tests:

```bash
npm test
```

Run tests in headed mode (see browser):

```bash
npm run test:headed
```

Run tests in UI mode (interactive):

```bash
npm run test:ui
```

## Test Server

The test server is an Express application that serves:
- Static files from the repository root
- API endpoints for loading content
- Test HTML pages

The server starts automatically when running tests via Playwright's webServer configuration.

To start the server manually:

```bash
npm run test:server
```

The server runs on `http://localhost:3000`

## Test Structure

### Test Files

- `htmx-intersect.spec.js` - Main test suite with 7 tests covering:
  - Initial content loading
  - Viewport-based content loading
  - Content unloading when out of viewport
  - Intersection class application
  - Sequential item loading
  - Infinite scroll behavior

### Test Page

- `index.html` - Test page with infinite scroll implementation
- Uses local htmx.min.js (no external dependencies)
- Implements the htmx-intersect extension

### Server Endpoints

- `GET /api/load?page=N&count=N` - Load more items
- `POST /api/unload` - Track unload events
- `POST /api/reset` - Reset item counter
- `GET /api/health` - Health check endpoint

## CI Integration

Tests run automatically on:
- Push to main/master branches
- Pull requests to main/master branches

See `.github/workflows/test.yml` for CI configuration.

## Test Coverage

The test suite validates:

1. **Core Functionality**
   - Content loads only when scrolled into viewport
   - Initial content renders correctly
   - Multiple items load sequentially

2. **Infinite Scroll**
   - Continuous loading as user scrolls
   - Proper item structure and attributes
   - Load trigger mechanism

3. **Visual Feedback**
   - Intersecting class added to visible elements
   - Proper element visibility tracking

4. **Content Management**
   - Content unloading when out of viewport
   - Memory-efficient operation with many items

## Notes

- Tests use local htmx file (`htmx.min.js`) to work in offline environments
- Default timeout is 30 seconds per test
- Tests are configured to retry up to 2 times in CI
- Screenshots and traces are captured on failure
