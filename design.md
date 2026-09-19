# 🎨 Warm Clay & Bento Chassis Design System (nitec. Theme)

> **Theme Name:** Warm Clay Bento Chassis (Next-Gen Luxury Minimalist)  
> **Aesthetic Profile:** Warm Clay Canvas + Neumorphic Bento Cards + Pill Geometries + High-Voltage Lime & Cobalt Accents + Dark Studio Contrast.  
> **Use Cases:** Luxury E-commerce, Modern SaaS Landing Pages, High-Tech Hardware Showcases, Portfolios, Design Systems, Dashboard Overviews.

---

## 📑 Table of Contents
1. [Core Design Philosophy](#1-core-design-philosophy)
2. [Color Palette & Tokens](#2-color-palette--tokens)
3. [Typography Hierarchy](#3-typography-hierarchy)
4. [Elevation, Depth & Shadows](#4-elevation-depth--shadows)
5. [Corner Radii & Spacing Matrix](#5-corner-radii--spacing-matrix)
6. [Micro-Interactions & Animation Keyframes](#6-micro-interactions--animation-keyframes)
7. [Component Patterns & HTML/CSS Blueprints](#7-component-patterns--htmlcss-blueprints)
   - [A. App Viewport & Floating Chassis](#a-app-viewport--floating-chassis)
   - [B. Glassmorphic Utility & Pill Navbar](#b-glassmorphic-utility--pill-navbar)
   - [C. High-Voltage Hero CTA & Buttons](#c-high-voltage-hero-cta--buttons)
   - [D. Bento Showcase Grid Layout](#d-bento-showcase-grid-layout)
   - [E. Product / Feature Card with Colorways](#e-product--feature-card-with-colorways)
   - [F. Dark Tech Visualizer Screen](#f-dark-tech-visualizer-screen)
   - [G. Filter Toolbar & Pill Tabs](#g-filter-toolbar--pill-tabs)
   - [H. Comparison Matrix Table](#h-comparison-matrix-table)
   - [I. Slide-Over Drawer & Modal Dialog](#i-slide-over-drawer--modal-dialog)
   - [J. Floating Toast Notification](#j-floating-toast-notification)
8. [Copy-Paste Starter Templates](#8-copy-paste-starter-templates)
   - [Native CSS Variables (`theme.css`)](#native-css-variables-themecss)
   - [Tailwind CSS Configuration (`tailwind.config.js`)](#tailwind-css-configuration-tailwindconfigjs)
9. [How to Apply This Theme to Any New Project](#9-how-to-apply-this-theme-to-any-new-project)

---

## 1. Core Design Philosophy

This theme merges **three high-converting modern aesthetics**:
1. **The Floating Chassis (Chassis Framework):** Rather than full-bleed edge-to-edge white backgrounds, the entire application sits inside an elevated, rounded warm-clay window (`#eceae3`) surrounded by a cool slate radial studio backlight. This provides a tactile "hardware console" feel.
2. **Bento Grid Architecture:** Clean, modular cards (`#ffffff`) with generous radii (`24px`–`32px`) organized in asymmetrical rhythms (`2.2fr : 1fr`).
3. **Pill-Centric Micro UI:** All actions, searches, badges, filters, and toolbars adopt pill geometry (`border-radius: 999px`) with soft ambient shadows (`--shadow-pill`).
4. **Deliberate High-Voltage Sparks:** 90% muted warm tones and monochrome graphite, punctuated by sharp **Electric Lime (`#d9ff36`)** and **Cobalt Tech Blue (`#2d62ed`)** for immediate visual guidance and CTA conversion.

---

## 2. Color Palette & Tokens

### Core Color Palette

| Token Name | Hex Code | Purpose / Usage | Preview |
| :--- | :--- | :--- | :--- |
| `--canvas-bg` | `radial-gradient(...)` | Outer viewport studio atmosphere | `#9cb2c9` → `#687989` |
| `--chassis-bg` | `#eceae3` | Main warm clay chassis panel | 🟫 Warm Clay |
| `--chassis-border` | `rgba(255, 255, 255, 0.75)` | Translucent frosted glass chassis rim | ⚪ Frosted White |
| `--card-bg` | `#ffffff` | Bento card and modal surface | ⬜ Pure White |
| `--card-bg-subtle` | `#f9f8f5` / `#f6f5f0` | Secondary wells, review cards, spec chips | ◽ Soft Cream |
| `--card-dark` | `#111111` | Inverted VIP bento, footer, active buttons | ⬛ Carbon Black |
| `--text-main` | `#121316` | Primary headings, titles, active labels | ⬛ Dark Charcoal |
| `--text-muted` | `#6b7280` / `#777777` | Body copy, secondary information | 🔘 Neutral Grey |
| `--text-sub` | `#9ca3af` / `#aaaaaa` | Placeholders, timestamps, borders | ⚪ Light Grey |
| `--accent-lime` | `#d9ff36` | Primary high-voltage CTA button, active cart badge | 🟩 Neon Lime |
| `--accent-lime-hover` | `#cbff14` | Lime CTA button hover state | 🟩 Bright Lime |
| `--accent-blue` | `#2d62ed` | Tech highlights, pricing, secondary links | 🟦 Cobalt Blue |
| `--status-emerald` | `#10b981` | Live indicator dot, verified badge, success | 🟩 Emerald |
| `--status-ruby` | `#ef4444` / `#fee2e2` | Sale/Hot badge, live recording pulse | 🟥 Signal Red |
| `--dark-visualizer` | `#0f172a` | Audio spectrum screen, code window, terminal | 🟦 Dark Slate |

---

## 3. Typography Hierarchy

Import from Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

### Font Roles
- **Display Font (`--font-display`):** `'Outfit', sans-serif`  
  *Usage:* Hero titles, card headings, prices, modal titles. High tracking compression (`letter-spacing: -0.5px` to `-1.6px`), heavy weights (`700`, `800`, `900`).
- **Main Body Font (`--font-main`):** `'Plus Jakarta Sans', sans-serif`  
  *Usage:* Navigation links, body copy, descriptions, form inputs. Balanced readability, weights (`400`, `500`, `600`, `700`).
- **Mono / Tech Font (`--font-mono`):** `'Space Grotesk', monospace`  
  *Usage:* Technical specs, Hz frequencies, timers, deal countdowns, badges.

### Typography Scale Table

| Role | Font Family | Size | Weight | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | Outfit | `46px` (Desktop) / `34px` (Mobile) | 800 | `-1.6px` | `1.08` |
| **Section Title** | Outfit | `32px` | 800 | `-0.8px` | `1.2` |
| **Bento Card Title** | Outfit | `20px` - `24px` | 700 / 800 | `-0.5px` | `1.25` |
| **Eyebrow Tag** | Plus Jakarta Sans | `11px` - `12px` | 800 | `+1px` (UPPERCASE) | `1.0` |
| **Body Standard** | Plus Jakarta Sans | `13.5px` - `14px` | 500 / 600 | `normal` | `1.5` |
| **Caption / Subtitle**| Plus Jakarta Sans | `12px` - `12.5px` | 500 | `normal` | `1.4` |
| **Tech Metric** | Space Grotesk | `16px` - `18px` | 800 | `0px` | `1.0` |

---

## 4. Elevation, Depth & Shadows

```css
:root {
  /* Grand outer chassis shadow: lifts the main app off the studio backdrop */
  --shadow-chassis: 0 40px 100px -20px rgba(22, 30, 46, 0.28), 
                    0 20px 40px -15px rgba(0, 0, 0, 0.08);

  /* Resting bento card shadow: soft, elegant, non-intrusive */
  --shadow-card: 0 8px 30px -4px rgba(0, 0, 0, 0.04), 
                 0 2px 6px -1px rgba(0, 0, 0, 0.02);

  /* Hover bento card shadow: lifts the card towards the viewer */
  --shadow-card-hover: 0 20px 45px -10px rgba(0, 0, 0, 0.09), 
                       0 8px 16px -4px rgba(0, 0, 0, 0.04);

  /* Floating pill element shadow: searches, buttons, chips */
  --shadow-pill: 0 4px 14px rgba(0, 0, 0, 0.04);

  /* Neon CTA glow */
  --shadow-lime-cta: 0 8px 25px rgba(217, 255, 54, 0.45);
  --shadow-lime-cta-hover: 0 14px 30px rgba(217, 255, 54, 0.6);

  /* Deep modal shadow */
  --shadow-modal: 0 35px 80px rgba(0, 0, 0, 0.25);
}
```

---

## 5. Corner Radii & Spacing Matrix

| Level | Size | Target Element |
| :--- | :--- | :--- |
| **Chassis** | `40px` (Desktop) / `28px` (Mobile) | Main outer container (`.nitec-chassis`) |
| **Section & Modals**| `32px` | Comparison section, Acoustic Lab, Modals |
| **Bento Cards** | `24px` – `28px` | Hero card, side cards, product cards |
| **Nested Wells** | `16px` – `20px` | Inner image stages, mode detail cards, review cards |
| **Micro Badges** | `6px` – `8px` | Discount tags, category micro-chips |
| **Pills (Full Round)**| `999px` | Buttons, inputs, search bar, filter tabs, avatar chips |

---

## 6. Micro-Interactions & Animation Keyframes

### 1. Arrow Circle Rotation on Hover
Any CTA with an embedded arrow circle rotates `45deg` smoothly when the parent button or card is hovered:
```css
.card-arrow-btn, .cta-arrow-circle {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
}
.bento-card:hover .card-arrow-btn,
.cta-lime-btn:hover .cta-arrow-circle {
  transform: rotate(45deg);
}
```

### 2. Equalizer Audio Wave Bounce
```css
@keyframes eqBounce {
  0% { transform: scaleY(0.3); }
  100% { transform: scaleY(1); }
}
.eq-bar {
  width: 3px;
  border-radius: 2px;
  animation: eqBounce 0.8s infinite ease-in-out alternate;
}
.eq-bar:nth-child(1) { height: 6px; animation-delay: 0.1s; }
.eq-bar:nth-child(2) { height: 14px; animation-delay: 0.3s; }
.eq-bar:nth-child(3) { height: 8px; animation-delay: 0.2s; }
.eq-bar:nth-child(4) { height: 12px; animation-delay: 0.4s; }
```

### 3. Floating Stage Particles (Orbs)
```css
@keyframes orbFloat {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-12px) scale(1.08); }
}
.floating-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: orbFloat 4s infinite ease-in-out alternate;
}
```

### 4. Recording Pulse Beacon
```css
@keyframes recPulse {
  0% { opacity: 0.35; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1.1); }
}
.rec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: recPulse 1s infinite alternate;
}
```

### 5. Drawer & Modal Entrance Animations
```css
@keyframes slideDrawer {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes modalScale {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes toastIn {
  from { transform: translate(-50%, 20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
```

---

## 7. Component Patterns & HTML/CSS Blueprints

### A. App Viewport & Floating Chassis

```html
<div class="app-viewport">
  <main class="nitec-chassis">
    <!-- Content goes here -->
  </main>
</div>
```

```css
body {
  font-family: var(--font-main);
  background: radial-gradient(circle at 50% 15%, #9cb2c9 0%, #7d8f9f 50%, #687989 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 16px 64px 16px;
  color: var(--text-main);
}

.app-viewport {
  width: 100%;
  max-width: 1280px;
  position: relative;
  margin: 0 auto;
}

.nitec-chassis {
  background-color: var(--chassis-bg);
  border: 1.5px solid var(--chassis-border);
  border-radius: 40px;
  padding: 24px 36px 40px 36px;
  box-shadow: var(--shadow-chassis);
  display: flex;
  flex-direction: column;
  gap: 36px;
}
```

---

### B. Glassmorphic Utility & Pill Navbar

```html
<header class="nitec-header-wrapper">
  <!-- Top Utility Bar -->
  <div class="utility-bar">
    <div class="utility-left">
      <span class="live-bullet"></span>
      <span>Live Acoustic Lab Demo Active</span>
    </div>
    <div class="utility-right">
      <span>Free Worldwide Express Shipping</span>
      <span class="utility-sep">|</span>
      <div class="currency-selector-chip">USD ($)</div>
    </div>
  </div>

  <!-- Main Navbar -->
  <nav class="nitec-navbar">
    <div class="brand-logo">
      <div class="brand-icon">N</div>
      <span class="brand-text">nitec.</span>
    </div>

    <div class="desktop-nav-links">
      <a href="#" class="nav-link-item">Headphones</a>
      <a href="#" class="nav-link-item">Earbuds</a>
      <a href="#" class="nav-link-item">Lab</a>
      <a href="#" class="nav-link-item">About</a>
    </div>

    <!-- Search Pill -->
    <div class="search-container">
      <div class="search-pill">
        <input type="text" placeholder="Search acoustic gear..." />
        <button class="search-action-btn">🔍</button>
      </div>
    </div>

    <!-- Action Icons -->
    <div class="nav-actions">
      <button class="nav-icon-circle">❤️</button>
      <button class="nav-icon-circle dark-pill">
        🛍️
        <span class="cart-count-badge">2</span>
      </button>
    </div>
  </nav>
</header>
```

---

### C. High-Voltage Hero CTA & Buttons

```html
<!-- Primary High-Voltage Lime Button with Rotating Arrow -->
<button class="cta-lime-btn">
  <span>Explore Flagship</span>
  <div class="cta-arrow-circle">↗</div>
</button>

<!-- Audio Demo Player Pill -->
<button class="audio-demo-pill">
  <span>Spatial Audio Sample</span>
  <div class="equalizer-wave">
    <div class="eq-bar" style="background:#2d62ed"></div>
    <div class="eq-bar" style="background:#2d62ed"></div>
    <div class="eq-bar" style="background:#2d62ed"></div>
    <div class="eq-bar" style="background:#2d62ed"></div>
  </div>
</button>
```

```css
.cta-lime-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--accent-lime);
  color: #0d0e11;
  font-family: var(--font-main);
  font-size: 14px;
  font-weight: 800;
  padding: 8px 8px 8px 22px;
  border-radius: 999px;
  box-shadow: var(--shadow-lime-cta);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
}

.cta-lime-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-lime-cta-hover);
  background: var(--accent-lime-hover);
}

.cta-arrow-circle {
  width: 38px;
  height: 38px;
  background: #111;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.cta-lime-btn:hover .cta-arrow-circle {
  transform: rotate(45deg);
}
```

---

### D. Bento Showcase Grid Layout

```html
<section class="bento-grid">
  <!-- Large Hero Bento (Left) -->
  <article class="bento-card hero-card">
    <div class="hero-left-content">
      <span class="hero-tag-badge">Flagship 2026</span>
      <h1 class="hero-title">Studio Purity.<br>Untethered.</h1>
      <!-- Steps / Spec summary -->
      <button class="cta-lime-btn">Order Now</button>
    </div>

    <!-- 3D Stage with Product & Ambient Glow -->
    <div class="hero-product-stage">
      <div class="hero-glow-ambient" style="background: rgba(45, 98, 237, 0.35);"></div>
      <img src="product.png" class="floating-product-img" alt="Hero Audio" />
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="preview-360-pill">↻ 360° View</div>
    </div>
  </article>

  <!-- Right Stack (2 Bento Tiles) -->
  <div class="right-column-stack">
    <!-- Bento Tile 1 -->
    <article class="bento-card xbud-card">
      <div class="xbud-card-info">
        <h3 class="card-title-heavy">XBuds Gen 2</h3>
        <span class="card-arrow-btn">↗</span>
      </div>
      <div class="xbud-img-wrap">
        <img src="earbuds.jpg" class="xbud-img" alt="Earbuds" />
      </div>
    </article>

    <!-- Bento Tile 2 -->
    <article class="bento-card tall-surface-card">
      <div class="tall-card-img-wrap">
        <img src="headphones.jpg" class="tall-card-img" alt="Headphones" />
        <span class="tall-card-floating-arrow">↗</span>
      </div>
      <div class="surface-bottom-info">
        <h4 class="title">Surface Sound ANC</h4>
        <p class="subtitle">40-Hour Pure Battery</p>
      </div>
    </article>
  </div>
</section>
```

```css
.bento-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 20px;
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

.bento-card {
  background: var(--card-bg);
  border-radius: 28px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover {
  box-shadow: var(--shadow-card-hover);
}
```

---

### E. Product / Feature Card with Colorways

```html
<article class="catalog-product-card">
  <!-- Top Bar: Badge & Wishlist -->
  <div class="product-card-top-bar">
    <span class="product-badge-chip hot">🔥 Best Seller</span>
    <button class="card-wishlist-btn">♡</button>
  </div>

  <!-- Image Stage with Quick View Pill -->
  <div class="product-card-img-stage">
    <img src="headphone.jpg" class="product-catalog-img" alt="Product" />
    <span class="card-quick-view-btn">👁️ Quick View</span>
  </div>

  <!-- Colorway Swatches -->
  <div class="card-colorways-row">
    <span class="card-color-dot active" style="background:#1a202c"></span>
    <span class="card-color-dot" style="background:#94a3b8"></span>
    <span class="card-color-dot" style="background:#3b82f6"></span>
  </div>

  <!-- Info -->
  <div class="product-category-sub">Over-Ear Headphone</div>
  <h3 class="product-card-name">Aether Sound Pro</h3>
  <div class="product-card-rating">
    <span class="rating-score">★ 4.9</span>
    <span class="rating-count">(128 reviews)</span>
  </div>

  <!-- Footer: Price & Add to Bag -->
  <div class="product-card-footer">
    <div class="product-price-block">
      <span class="current-price">$349</span>
      <span class="original-price">$419</span>
    </div>
    <button class="card-add-cart-btn">+ Bag</button>
  </div>
</article>
```

---

### F. Dark Tech Visualizer Screen

```html
<div class="visualizer-screen">
  <div class="screen-header">
    <span>SPECTRUM FREQ: 96kHz / 24-BIT</span>
    <span class="rec-dot"></span>
  </div>

  <!-- Animated Frequency Bars -->
  <div class="audio-spectrum-bars">
    <div class="spectrum-bar" style="height: 60%; background: #d9ff36;"></div>
    <div class="spectrum-bar" style="height: 85%; background: #38bdf8;"></div>
    <div class="spectrum-bar" style="height: 40%; background: #818cf8;"></div>
    <div class="spectrum-bar" style="height: 95%; background: #d9ff36;"></div>
    <div class="spectrum-bar" style="height: 70%; background: #38bdf8;"></div>
  </div>

  <div class="visualizer-footer">
    <span>LATENCY: 1.2MS</span>
    <span>STATUS: CALIBRATED</span>
  </div>
</div>
```

---

### G. Filter Toolbar & Pill Tabs

```html
<div class="toolbar-top-row">
  <div>
    <span class="section-eyebrow">Curated Collection</span>
    <h2 class="section-main-title">Acoustic Gear & Precision Audio</h2>
  </div>
  <div class="sort-dropdown-box">
    <span>Sort:</span>
    <select class="sort-select-input">
      <option>Featured First</option>
      <option>Price: Low to High</option>
      <option>Highest Rated</option>
    </select>
  </div>
</div>

<div class="category-pills-row">
  <button class="category-pill-btn active">
    <span class="cat-dot"></span>
    <span>All Products</span>
  </button>
  <button class="category-pill-btn">Over-Ear</button>
  <button class="category-pill-btn">Wireless Buds</button>
  <button class="category-pill-btn">DAC & Amps</button>
</div>
```

---

### H. Comparison Matrix Table

```html
<div class="comparison-table-wrapper">
  <table class="comparison-table">
    <thead>
      <tr>
        <th class="feature-col-header">Acoustic Spec</th>
        <th class="product-col-header">
          <div class="comp-product-name">Sequoia Pro</div>
          <div class="comp-product-price">$349</div>
        </th>
        <th class="product-col-header">
          <div class="comp-product-name">Surface ANC</div>
          <div class="comp-product-price">$279</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="spec-name">Driver Tech</td>
        <td class="spec-val highlight">50mm Beryllium</td>
        <td class="spec-val">40mm Graphene</td>
      </tr>
      <tr>
        <td class="spec-name">ANC Depth</td>
        <td class="spec-val highlight">-45 dB Hybrid</td>
        <td class="spec-val">-38 dB Active</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### I. Slide-Over Drawer & Modal Dialog

```html
<!-- Slide-Over Drawer -->
<div class="cart-drawer-overlay">
  <div class="cart-drawer-panel">
    <div class="cart-header">
      <h3 class="cart-title">Your Audio Bag</h3>
      <button class="close-btn">✕</button>
    </div>
    <div class="cart-items-list">
      <!-- Item Cards -->
    </div>
    <div class="cart-footer">
      <div class="cart-total-row">
        <span class="cart-total-label">Subtotal</span>
        <span class="cart-total-value">$349.00</span>
      </div>
      <button class="cart-checkout-btn">Proceed to Express Checkout</button>
    </div>
  </div>
</div>
```

---

### J. Floating Toast Notification

```html
<div class="toast-banner">
  <span>✓</span>
  <span>Item added to your audio bag</span>
</div>
```

```css
.toast-banner {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #111111;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1100;
  animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 8. Copy-Paste Starter Templates

### Native CSS Variables (`theme.css`)

Drop this into `theme.css` or `:root` of any new project:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

:root {
  /* Fonts */
  --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Grotesk', monospace;

  /* Theme Tokens */
  --chassis-bg: #eceae3;
  --chassis-border: rgba(255, 255, 255, 0.75);
  --card-bg: #ffffff;
  --card-bg-subtle: #f9f8f5;
  --text-main: #121316;
  --text-muted: #6b7280;
  --text-sub: #9ca3af;
  --accent-lime: #d9ff36;
  --accent-lime-hover: #cbff14;
  --accent-blue: #2d62ed;
  --card-dark: #111111;

  /* Shadows */
  --shadow-chassis: 0 40px 100px -20px rgba(22, 30, 46, 0.28), 0 20px 40px -15px rgba(0, 0, 0, 0.08);
  --shadow-card: 0 8px 30px -4px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
  --shadow-card-hover: 0 20px 45px -10px rgba(0, 0, 0, 0.09), 0 8px 16px -4px rgba(0, 0, 0, 0.04);
  --shadow-pill: 0 4px 14px rgba(0, 0, 0, 0.04);
}

body {
  font-family: var(--font-main);
  background: radial-gradient(circle at 50% 15%, #9cb2c9 0%, #7d8f9f 50%, #687989 100%);
  min-height: 100vh;
  margin: 0;
  padding: 32px 16px;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}
```

---

### Tailwind CSS Configuration (`tailwind.config.js`)

If you are using Tailwind CSS in your other project:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        chassis: {
          DEFAULT: '#eceae3',
          border: 'rgba(255, 255, 255, 0.75)',
        },
        brand: {
          dark: '#111111',
          charcoal: '#121316',
          lime: '#d9ff36',
          'lime-hover': '#cbff14',
          blue: '#2d62ed',
          subtle: '#f9f8f5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      borderRadius: {
        'chassis': '40px',
        'chassis-sm': '28px',
        'bento': '28px',
        'pill': '999px',
      },
      boxShadow: {
        'chassis': '0 40px 100px -20px rgba(22, 30, 46, 0.28), 0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'bento': '0 8px 30px -4px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'bento-hover': '0 20px 45px -10px rgba(0, 0, 0, 0.09), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'pill': '0 4px 14px rgba(0, 0, 0, 0.04)',
        'lime-glow': '0 8px 25px rgba(217, 255, 54, 0.45)',
      }
    },
  },
  plugins: [],
}
```

---

## 9. How to Apply This Theme to Any New Project

Follow these 4 simple steps to transplant this exact theme to your new project:

### Step 1: Copy Google Fonts
In the `<head>` of your `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
```

### Step 2: Establish the Outer Frame Layout
Every page should be wrapped inside:
```html
<body style="background: radial-gradient(circle at 50% 15%, #9cb2c9 0%, #7d8f9f 50%, #687989 100%);">
  <div style="max-width: 1280px; margin: 0 auto; width: 100%;">
    <main style="background: #eceae3; border: 1.5px solid rgba(255,255,255,0.75); border-radius: 40px; box-shadow: 0 40px 100px -20px rgba(22,30,46,0.28); padding: 36px;">
      <!-- Your project components here -->
    </main>
  </div>
</body>
```

### Step 3: Apply the Bento & Card Rules
- **Backgrounds:** Keep cards pure white (`#ffffff`) on the warm clay chassis (`#eceae3`).
- **Corners:** Use large rounded corners (`border-radius: 24px` to `28px`).
- **Interactive Pills:** Turn all filter tabs, badges, search bars, and secondary buttons into pills (`border-radius: 999px`).
- **Hover Motion:** Add `transform: translateY(-4px)` with soft ease cubic-bezier.

### Step 4: Inject the Brand Accent Spark
- Use `#d9ff36` (Electric Lime) on your **Primary Action Button** and **Cart/Counter Badges**.
- Use `#2d62ed` (Cobalt Tech Blue) for active links, ratings, prices, or technical tags.
- Use `#111111` (Carbon Black) for navbar pills, icons, and contrast CTA buttons.

---
*Created for seamless multi-project reuse — Nitec Design System.*
