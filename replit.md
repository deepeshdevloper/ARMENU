# AR Menu WebXR Application

## Overview

This is an AR-enabled restaurant menu application that allows customers to scan a QR code and experience food items in augmented reality. The application provides an immersive, Gen-Z-friendly interface with Snapchat-inspired category selection ("Lens Rings"), creative dish browsing, and WebXR-powered AR placement of 3D food models onto detected surfaces.

**Core Features:**
- QR code-based restaurant menu access
- Visual category selection using 3D ring interface
- Dish browsing with detailed information
- WebXR AR experience for placing 3D food models on real surfaces
- Mobile-first, touch-optimized UX with haptic feedback and gyroscope parallax

**Scope:**
- MVP focuses purely on menu browsing and AR visualization
- No user authentication, payment processing, or restaurant admin functionality
- Single-page application with state-driven navigation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- **React 18** with TypeScript for component-based UI development
- **Vite** as the build tool and development server with HMR support
- **TailwindCSS** for utility-first styling with custom design tokens
- **Framer Motion** for declarative animations and screen transitions

**3D & AR Rendering:**
- **Three.js** via `@react-three/fiber` for declarative 3D scene composition
- **@react-three/drei** for common 3D utilities (OrbitControls, useGLTF, Text)
- **@react-three/xr** for WebXR integration enabling AR experiences on mobile devices
- **@react-three/postprocessing** for visual effects and rendering enhancements
- Supports GLTF/GLB 3D model loading for food items
- GLSL shader support via `vite-plugin-glsl`

**State Management:**
- **Zustand** for lightweight, hook-based global state management
- Three main stores:
  - `useARMenu`: Application navigation, category/dish selection
  - `useAudio`: Sound effects and background music control
  - `useGame`: Game phase management (legacy - may be unused in AR menu)

**Routing & Navigation:**
- Custom screen-based navigation system using `currentScreen` state
- No traditional routing library - all screens render conditionally based on state
- Five main screens: Loading → Categories → DishList → DishDetail → AR

**UI Component Library:**
- Extensive Radix UI primitives for accessible, unstyled components
- Custom-styled components in `client/src/components/ui/`
- Mobile-first responsive design with custom breakpoints for touch/no-touch detection

### Backend Architecture

**Server Framework:**
- **Express.js** running on Node.js for HTTP server
- Serves static React build in production
- Vite middleware integration in development for HMR

**API Layer:**
- RESTful API structure (prefix: `/api`)
- Routes registered via `server/routes.ts`
- Currently minimal - designed for future expansion (menu data, analytics, etc.)

**Development Setup:**
- TypeScript with ESNext modules throughout
- Path aliases: `@/*` (client), `@shared/*` (shared types/schemas)
- Development server runs both Vite dev server and Express concurrently

### Data Storage Solutions

**Database:**
- **PostgreSQL** via Neon serverless driver (`@neondatabase/serverless`)
- **Drizzle ORM** for type-safe database operations and schema management
- Configuration: `drizzle.config.ts` with migrations in `./migrations`
- Schema defined in `shared/schema.ts`

**Current Schema:**
- `users` table (id, username, password) - appears to be boilerplate
- Designed for extensibility - menu data (categories, dishes) currently hardcoded in `client/src/data/menuData.ts`

**In-Memory Fallback:**
- `MemStorage` class provides local storage implementation for development/testing
- Implements `IStorage` interface with CRUD operations
- Production would use Drizzle-based storage layer

### Authentication and Authorization

**Current State:**
- No authentication or authorization implemented
- Public access to all menu content
- User schema exists but not actively used in MVP

**Design Considerations:**
- Future expansion could add restaurant admin authentication
- Session management prepared via `connect-pg-simple` dependency
- Security headers and CORS would need configuration for production

### External Dependencies

**Third-Party Services:**
- **Neon Database** - Serverless PostgreSQL hosting (via `DATABASE_URL` environment variable)
- **Replit** - Development platform with runtime error overlay plugin

**3D Assets & Models:**
- GLTF/GLB files stored in `/public/models/` directory
- Model references hardcoded in category/dish data (burger.glb, cake.glb, cocktail.glb, salad.glb)
- Stock images in `/attached_assets/stock_images/`

**Font Dependencies:**
- Inter font via `@fontsource/inter` for consistent typography

**Key NPM Packages:**
- **@tanstack/react-query** - Server state management (prepared but not actively used)
- **zod** - Schema validation via `drizzle-zod`
- **nanoid** - ID generation
- **cmdk** - Command palette component
- **class-variance-authority** & **clsx** - Conditional className utilities

**Build & Development Tools:**
- **tsx** - TypeScript execution for server
- **esbuild** - Server-side bundling for production
- **PostCSS** with Autoprefixer for CSS processing

**Mobile Enhancements:**
- Device orientation/gyroscope API for parallax effects
- Vibration API for haptic feedback
- Safe area insets for notch/home indicator handling
- Touch-specific media queries

## Recent Changes

### November 20, 2025 - AR Information Overlays
**Feature:** Added floating information boxes to AR and WebXR views

**Implementation:**
- `ARScreen.tsx`: Added three toggle buttons (Ingredients, Allergens, Recipe) that appear after the initial info card disappears
- `WebcamARViewer.tsx`: Already had the floating info boxes implemented
- Information boxes display:
  - **Ingredients Box** (green gradient): Lists all dish ingredients with bullet points
  - **Allergens Box** (orange/red gradient): Shows allergen warnings or "No common allergens" message
  - **Recipe Video Box** (purple/pink gradient): Embedded iframe player for preparation videos (if available)

**UX Details:**
- Toggle buttons only appear when the initial dish info card is hidden (after 3 seconds)
- Buttons are mutually exclusive - clicking one hides the others
- Smooth animations using Framer Motion for enter/exit transitions
- Mobile-responsive with icon-only buttons on small screens, full labels on larger screens
- Positioned to avoid overlap with AR controls and model viewer