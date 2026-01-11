# Website Architecture Overview

## 🏗️ High-Level Structure

### Tech Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 7.11.0
- **Styling**: CSS (modular per component)
- **Email Service**: EmailJS (@emailjs/browser)
- **Deployment**: Vercel (based on vercel.json)

---

## 📁 Project Structure

```
personalwebsite/
├── public/
│   └── assets/
│       └── images/          # Static images (10 images)
│
├── src/
│   ├── main.jsx            # Entry point - React root
│   ├── App.jsx              # Main router & layout
│   ├── App.css              # Global styles (2000+ lines)
│   ├── index.css            # Base styles & CSS variables
│   │
│   └── components/
│       ├── Home.jsx         # Main landing page (1100+ lines)
│       ├── Blog.jsx         # Blog listing & detail view
│       ├── J0InTheWrld.jsx  # Social posts page
│       ├── Navigation.jsx   # Hamburger menu navigation
│       ├── GlobalCursor.jsx # Soccer ball cursor (non-home pages)
│       └── *.css            # Component-specific styles
│
├── index.html               # HTML entry with critical CSS
├── vite.config.js           # Build configuration
└── package.json             # Dependencies
```

---

## 🔄 Application Flow

### 1. **Entry Point** (`main.jsx`)
- Creates React root
- Renders `<App />` component
- Loads CSS asynchronously
- Error boundary for render failures

### 2. **App Component** (`App.jsx`)
- **Router Setup**: React Router with BrowserRouter
- **Code Splitting**: All routes lazy-loaded with `React.lazy()`
  - `/` → Home component
  - `/blog` → Blog component
  - `/j0-in-the-wrld` → J0InTheWrld component
- **Global Components**:
  - `<GlobalCursor />` - Soccer ball cursor (only on non-home pages)
  - `<Navigation />` - Hamburger menu
- **Loading Fallback**: Minimal loading state during code splitting

### 3. **Route Components**

#### **Home.jsx** (Main Landing Page)
**Purpose**: Interactive personal portfolio with physics animations

**Key Features**:
- **Lava Lamp Blobs**: 8 animated organic shapes (background)
- **Bubble Physics**: 10 "secret" bubbles with spring-follow physics
- **Experience Pills**: Text labels that follow bubbles with spring physics
- **Document View**: Essay/contact form (opens via "open" button)
- **Life Quotes**: Appears after 8 seconds
- **Image Placeholders**: 6 organic frames for future images
- **Custom Cursor**: Soccer ball cursor with glow effect

**State Management**:
- `showBubbles` - Controls bubble visibility (hides after 8s)
- `showQuotes` - Shows quotes after bubbles
- `documentOpen` - Controls essay/document view
- `selectedSecret` - Modal for secret details
- `formData` - Contact form state
- `isMobile` - Device detection

**Physics System**:
- **Bubble Physics**: Simplified drift animation (30fps)
  - No collision detection (removed for performance)
  - Gentle drift back to base positions
  - Boundary constraints
- **Pill Spring Physics**: Pills follow bubbles with spring physics
  - Spring strength: 0.06
  - Damping: 0.85
  - Velocity-based offset for "string" effect

**Performance Optimizations**:
- Throttled to 30fps (from 60fps)
- Removed collision detection (O(n²) complexity)
- Removed pill separation (O(n²) complexity)
- Direct DOM manipulation via refs
- Visibility API pauses animations when tab hidden
- Memoized expensive calculations

#### **Blog.jsx**
**Purpose**: Blog post listing and detail view

**Features**:
- Category filtering (All, Neuroscience & AI, Venture Essays, Lessons & Experiences)
- 5 blog posts with full content
- Click to expand full post view
- Back button to return to list

**State**:
- `selectedPost` - Currently viewed post
- `selectedCategory` - Active filter

#### **J0InTheWrld.jsx**
**Purpose**: Social media posts showcase (currently "coming soon")

**Features**:
- Banner with 10 images
- Placeholder for future social posts integration

#### **Navigation.jsx**
**Purpose**: Site navigation menu

**Features**:
- Hamburger menu toggle
- Slide-down navigation
- Active route highlighting
- Mobile-responsive

#### **GlobalCursor.jsx**
**Purpose**: Custom cursor for Blog and J0InTheWrld pages

**Features**:
- Soccer ball cursor (⚽)
- Glow effect (desktop only)
- Only shows on non-home pages
- Hidden on mobile
- Direct DOM manipulation for performance

---

## 🎨 Styling Architecture

### CSS Organization

1. **index.css** - Base styles
   - CSS variables (colors)
   - Body/HTML base styles
   - Background gradients

2. **App.css** - Global component styles (2000+ lines)
   - Lava lamp blobs
   - Glass overlay (kglass)
   - Cursor styles
   - Secret items/pills
   - Image frames
   - Document/essay styles
   - Modal styles
   - Animations (all composited - transform/opacity only)

3. **Component CSS** - Scoped styles
   - `Blog.css` - Blog-specific styles
   - `Navigation.css` - Nav menu styles
   - `J0InTheWrld.css` - Social page styles

### Design System

**Color Palette** (Natural Supernatural Theme):
- `--ng-green`: #008753 (Nigeria green)
- `--us-red`: #B22234 (US red)
- `--earth-brown`: #8B4513 (replaced blue)
- Dark backgrounds: `#1a1a0a` (earth tone, not black)

**Typography**:
- Primary: Inter (sans-serif)
- Headings: Space Mono, Neue Machina (monospace)
- Body: Inter, Crimson Text

**Animations**:
- All use composited properties only (transform, opacity)
- GPU-accelerated with `will-change` hints
- Throttled to 30fps for performance
- No non-composited animations (removed border-radius, filter animations)

---

## ⚡ Performance Architecture

### Code Splitting
- **Route-based**: Each route lazy-loaded
- **Vendor chunks**: React, EmailJS separated
- **CSS splitting**: Enabled in Vite config

### Loading Strategy
- **Critical CSS**: Inlined in `<head>` of index.html
- **Non-critical CSS**: Loaded asynchronously
- **Fonts**: Preloaded with `font-display: swap`
- **Images**: Lazy-loaded with `loading="lazy"`

### Build Optimizations
- **Minification**: Terser with aggressive settings
- **Tree-shaking**: Enabled
- **Dead code elimination**: Enabled
- **Console removal**: In production builds

### Runtime Optimizations
- **Memoization**: useMemo for expensive calculations
- **Callback optimization**: useCallback for event handlers
- **Direct DOM manipulation**: For animations (bypasses React)
- **RequestAnimationFrame**: Throttled to 30fps
- **Visibility API**: Pauses animations when tab hidden

---

## 🔌 Data Flow

### State Management
- **Local State**: useState for component-specific state
- **No Global State**: No Redux/Context (not needed)
- **Props**: Minimal prop drilling (mostly self-contained components)

### Data Sources
- **Static Data**: 
  - `essayContent` - Array of strings (Home.jsx)
  - `hiddenSecrets` - Array of 10 secret objects (Home.jsx)
  - `lifeQuotes` - Array of 3 quotes (Home.jsx)
  - `blogPosts` - Array of 5 blog posts (Blog.jsx)
- **External APIs**: 
  - EmailJS for contact form submissions
  - Google Fonts (async loaded)

### Event Flow
1. User interaction → Event handler
2. State update → React re-render
3. Animation loop → Direct DOM updates (bypasses React)
4. Physics calculations → Ref updates → DOM transforms

---

## 🎯 Key Architectural Patterns

### 1. **Separation of Concerns**
- Physics/animation logic separate from React state
- Direct DOM manipulation for performance-critical animations
- React state only for UI state (modals, forms, visibility)

### 2. **Performance-First**
- Lazy loading everywhere
- Code splitting
- Memoization
- Throttled animations
- GPU-accelerated transforms

### 3. **Mobile Optimization**
- Device detection
- Conditional rendering (cursors, animations)
- Touch event handlers
- Responsive breakpoints

### 4. **Error Handling**
- Try-catch in main.jsx
- Error boundaries
- Graceful fallbacks

---

## 🔄 Component Lifecycle

### Home Component Flow:
1. **Mount**: Initialize physics, start animations
2. **8 seconds**: Hide bubbles, show quotes
3. **User clicks "open"**: Show document/essay view
4. **User clicks secret**: Show modal with details
5. **User submits form**: EmailJS API call

### Animation Lifecycle:
1. **Initialization**: Bubbles start off-screen
2. **Entering Phase**: Bezier curve animation to target positions
3. **Floating Phase**: Physics-based drift animation
4. **Pill Follow**: Spring physics tethers pills to bubbles

---

## 📦 Dependencies

### Production:
- `react` & `react-dom`: UI framework
- `react-router-dom`: Client-side routing
- `@emailjs/browser`: Email service

### Development:
- `vite`: Build tool & dev server
- `@vitejs/plugin-react`: React plugin for Vite

---

## 🚀 Build & Deploy

### Build Process:
1. Vite bundles React app
2. Code splitting creates separate chunks
3. CSS extracted and optimized
4. Assets copied to `dist/`
5. Terser minifies JavaScript

### Deployment:
- **Platform**: Vercel (vercel.json config)
- **Static assets**: Served from `public/`
- **Routing**: Client-side (React Router)

---

## 🎨 Visual Layers (Z-Index Hierarchy)

```
z-index: 0    → Lava lamp blobs (background)
z-index: 1    → Glass overlay (kglass)
z-index: 3    → Image frames
z-index: 5    → Experience pills layer
z-index: 10000 → Navigation
z-index: 10010 → Secret items/pills (top layer)
```

---

## 🔧 Key Configuration Files

### `vite.config.js`
- Manual chunk splitting
- Terser minification
- Tree-shaking
- CSS code splitting

### `index.html`
- Critical CSS inlined
- Font preloading
- Resource hints (preconnect, dns-prefetch)

### `vercel.json`
- Deployment configuration

---

## 📝 Notes

- **No state management library**: Uses React hooks only
- **No CSS-in-JS**: Traditional CSS files
- **Performance optimized**: Removed heavy animations, optimized physics
- **Natural theme**: Earth tones, no purple/black
- **Mobile-first**: Responsive design with mobile optimizations

