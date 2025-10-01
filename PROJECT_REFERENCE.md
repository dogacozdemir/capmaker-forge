# Keycap Configurator - Project Reference

## Project Overview
A React-based mechanical keyboard keycap configurator built with Lovable. Features a full-width responsive layout with fixed control panel and flexible keyboard preview area. Allows users to design custom keycaps with 2D/3D previews, color customization, legend editing, and group management.

## Tech Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS 3.4.17
- **3D Graphics**: Three.js with @react-three/fiber & @react-three/drei
- **State Management**: React hooks (useState, useCallback)
- **Routing**: React Router DOM 6.30.1
- **Icons**: Lucide React 0.462.0
- **Forms**: React Hook Form 7.61.1 with Zod validation

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── ColorPicker.tsx  # Basic color picker
│   ├── DragSelection.tsx # Multi-key selection via drag
│   ├── EnhancedColorPicker.tsx # Advanced color picker with eyedropper
│   ├── EnhancedLegendEditor.tsx # Text/image legend editor
│   ├── ExportPanel.tsx  # Configuration export functionality
│   ├── FloatingToolbar.tsx # Compact floating toolbar (Canva-style)
│   ├── GroupManager.tsx # Key group management
│   ├── Keyboard3D.tsx   # 3D keyboard preview
│   ├── KeyboardPreview.tsx # 2D keyboard preview with layer preview
│   ├── KeycapPreview.tsx # Individual keycap component
│   ├── KeyLayerPreview.tsx # Compact layer preview above selected key
│   ├── LayerEditor.tsx  # Individual layer editing interface
│   ├── LayerManager.tsx # Multi-layer management interface
│   ├── LayoutSelector.tsx # Keyboard layout selection (legacy)
│   ├── CompactLayoutSelector.tsx # Compact layout dropdown
│   └── UnifiedSidebar.tsx # Merged sidebar with layout, groups, and layers
├── data/
│   └── layouts.ts       # Keyboard layout definitions
├── hooks/
│   ├── useKeyboardConfig.ts # Main state management hook
│   ├── useLayerManagement.ts # Layer management functionality
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notifications
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── pages/
│   ├── Index.tsx        # Main application page
│   └── NotFound.tsx     # 404 page
├── types/
│   └── keyboard.ts      # TypeScript type definitions
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and design system
```

## Core Types

### KeycapLayer
```typescript
interface KeycapLayer {
  id: string;
  type: 'text' | 'image';
  content: string; // text content or image data URL
  font?: string;
  fontSize?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  rotation?: number;
  mirrorX?: boolean;
  mirrorY?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
```

### KeycapConfig
```typescript
interface KeycapConfig {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  textColor: string;
  group?: string;
  layers: KeycapLayer[]; // Multi-layer support
}
```

### KeyboardLayout
```typescript
interface KeyboardLayout {
  id: string;
  name: string;
  keys: KeycapConfig[];
  totalKeys: number;
  width: number;
  height: number;
}
```

### KeyboardConfig
```typescript
interface KeyboardConfig {
  layout: KeyboardLayout;
  globalSettings: {
    theme: string;
    font: string;
  };
  selectedKeys: string[];
  groups: Record<string, string[]>;
  allLayouts: Record<LayoutType, KeyboardLayout>;
  currentLayoutType: LayoutType;
}
```

## Main Hook: useKeyboardConfig

### State
- `config`: Complete keyboard configuration
- `editingKeyId`: Currently editing key ID (null if none)

### Functions
- `changeLayout(layoutType: LayoutType)`: Switch keyboard layout
- `selectKey(keyId: string, multiSelect?: boolean)`: Select single/multiple keys
- `selectKeys(keyIds: string[])`: Select multiple keys at once
- `clearSelection()`: Clear all selected keys
- `updateKeycapColor(keyIds: string[], color: string)`: Update keycap colors
- `updateKeycapTextColor(keyIds: string[], textColor: string)`: Update legend colors
- `startEditingKey(keyId: string)`: Start editing a key's legend
- `stopEditingKey()`: Stop editing current key
- `getSelectedKey()`: Get currently editing key
- `getSelectedKeys()`: Get all selected keys
- `saveGroup(groupName: string, keyIds: string[])`: Save key selection as group
- `loadGroup(groupName: string)`: Load saved key group
- `deleteGroup(groupName: string)`: Delete saved group
- `addLayer(keyId: string, type: 'text' | 'image')`: Add new layer to keycap
- `deleteLayer(keyId: string, layerId: string)`: Delete layer from keycap
- `reorderLayer(keyId: string, layerId: string, direction: 'up' | 'down')`: Reorder layers
- `updateLayer(keyId: string, layerId: string, updates: Partial<KeycapLayer>)`: Update layer properties
- `getKeyLayers(keyId: string)`: Get all layers for a key
- `selectLayer(layerId: string | null)`: Select specific layer for editing

## Available Layouts

### Layout Types
- **60%**: 61 keys - Compact layout
- **TKL**: 87 keys - Tenkeyless (function row + nav cluster)
- **Full**: 104 keys - Complete layout with numpad

### Layout Generation
- `generate60Layout()`: Creates 60% layout with standard QWERTY
- `generateTKLLayout()`: Extends 60% with function row and navigation cluster
- `generateFullLayout()`: Extends TKL with numpad section

## Key Components

### KeyboardPreview
- **Purpose**: 2D keyboard visualization with full-width scaling and layer preview
- **Props**: layout, selectedKeys, onKeySelect, onKeyDoubleClick, editingKeyId, currentKeyLayers, selectedLayerId, onLayerSelect
- **Features**: Click selection, double-click editing, visual feedback, flexible container sizing, compact layer preview
- **Layout**: Flexbox-based container with centered keyboard preview and minimum width constraints
- **Layer Preview**: Shows compact layer buttons above selected key with theme-consistent styling

### Keyboard3D
- **Purpose**: 3D keyboard visualization using Three.js
- **Props**: layout, selectedKeys, onKeySelect, onKeyDoubleClick
- **Features**: Orbit controls, lighting, shadows, animations

### KeycapPreview
- **Purpose**: Individual keycap rendering with multi-layer support
- **Props**: keycap, selected, onClick, onDoubleClick, scale
- **Features**: Multi-layer rendering, legend positioning, font customization, image support
- **Layer Rendering**: Renders all layers with proper positioning, alignment, and styling

### EnhancedColorPicker
- **Purpose**: Advanced color selection
- **Features**: 
  - Color input (hex)
  - Preset color palettes
  - Eyedropper tool (browser API + fallback)
  - Separate keycap and text color controls

### EnhancedLegendEditor
- **Purpose**: Advanced legend customization
- **Features**:
  - Text/Image mode toggle
  - Font selection and sizing
  - Position controls (X/Y offset)
  - Alignment options
  - Rotation control
  - Mirror effects
  - Real-time preview

### DragSelection
- **Purpose**: Multi-key selection via drag
- **Features**: 
  - **DOM-Based Selection**: Uses actual DOM positions via `getBoundingClientRect()` for pixel-perfect selection
  - **Area-Based Selection**: Selects keys completely inside the selection rectangle (not directional)
  - **Real-time Visual Feedback**: Preview highlighting during drag with selection box overlay
  - **Multi-selection Support**: Ctrl/Cmd + click for individual key selection
  - **Layout Agnostic**: Works with any padding, scroll, zoom, or CSS transformations
  - **Key References**: Uses `keyRefs` to access actual DOM elements for precise positioning

### FloatingToolbar
- **Purpose**: Compact, centered toolbar for layer editing with multi-layer support
- **Features**:
  - **Layer-Based Editing**: Works with selected layer instead of key properties
  - **Always Visible**: Remains visible regardless of key selection state
  - **Content-Based Width**: Uses `w-fit` to size toolbar based on content, not full width
  - **Centered Layout**: Horizontally centered with `mx-auto` for optimal positioning
  - **Color Section**: Color picker with eyedropper, presets, separate keycap/text colors
  - **Aligning, Positioning & Sizing**: Alignment controls, transform tools, individual sliders
  - **Text Section**: Font selection, text styling (B/I/U), size control, text/image mode toggle
  - **Pop-up Panels**: Individual sliders for X/Y position, rotation, font size
  - **Compact Design**: Minimal spacing with `gap-1` between sections, `flex-shrink-0` to prevent stretching
  - **Responsive Sizing**: Smaller buttons and icons on mobile (`h-5 w-5`), larger on desktop (`sm:h-6 sm:w-6`)
  - **Minimal Separators**: Reduced height separators (`h-4`) for tighter layout
  - **Theme Integration**: Matches dark tech aesthetic with proper color tokens
  - **Layer Integration**: Updates layer properties instead of key properties
  - **Safe Guards**: All handlers check for key and layer selection before executing

### UnifiedSidebar
- **Purpose**: Merged sidebar containing layout selection, group management, and layer management
- **Features**:
  - **Single Container**: Combines CompactLayoutSelector, GroupManager, and LayerManager
  - **Section Organization**: Clear headings for Layout, Groups, and Components & Layers sections
  - **Visual Separators**: Consistent dividers between sections
  - **Full-Height Design**: Sticks to header/footer with internal scroll
  - **No Gaps**: Seamlessly connected to page edges
  - **Theme Integration**: Matches dark tech aesthetic with proper color tokens
  - **Responsive Width**: Fixed width (320px/384px) with scroll overflow
  - **Layer Management**: Integrated layer management with add/delete/reorder functionality

### CompactLayoutSelector
- **Purpose**: Compact layout selection dropdown (now integrated in UnifiedSidebar)
- **Features**:
  - **Section Title**: "Layout" header matching FloatingToolbar style
  - **Dropdown Interface**: Select component with layout options
  - **Layout Information**: Shows layout name, description, and key count
  - **Theme Integration**: Matches dark tech aesthetic with proper color tokens
  - **Space Efficient**: Replaces large button-based layout selector

### GroupManager
- **Purpose**: Save/load key groups
- **Features**: Create groups, load selections, delete groups

### KeyLayerPreview
- **Purpose**: Compact layer preview above selected key
- **Props**: layers, selectedLayerId, onLayerSelect, keyPosition, unit, padding
- **Features**: 
  - **Compact Design**: Only shows layer content without descriptive text
  - **Theme Integration**: Matches dark tech aesthetic with card/primary colors
  - **Interactive Selection**: Click to select different layers
  - **Positioned Above Key**: Appears 60px above selected key to avoid blocking
  - **Opacity & Blur**: Semi-transparent with backdrop blur for modern glass effect
  - **Circular Buttons**: Each layer as circular button with proper hover states

### LayerManager
- **Purpose**: Multi-layer management interface
- **Features**:
  - **Layer List**: Shows all layers for selected key
  - **Add Layers**: Create new text or image layers
  - **Layer Operations**: Delete, reorder layers
  - **Layer Selection**: Click to select specific layer for editing
  - **Visual Indicators**: Shows layer type and content preview

### LayerEditor
- **Purpose**: Individual layer editing interface
- **Features**:
  - **Text/Image Mode**: Toggle between text and image content
  - **Font Controls**: Font selection and size adjustment
  - **Positioning**: X/Y offset controls with sliders
  - **Alignment**: Horizontal and vertical alignment options
  - **Transform**: Rotation and mirror effects
  - **Real-time Preview**: Live updates during editing

### ExportPanel
- **Purpose**: Export configurations (now in header dropdown)
- **Features**: JSON export, summary export, download functionality
- **Location**: Moved from sidebar to header popover for better accessibility

## Routing

### Routes
- `/` - Main application (Index.tsx)
- `/*` - 404 page (NotFound.tsx)

### Navigation
- Single page application
- No nested routes
- Browser history support

## Styling System

### Design Tokens (HSL)
- **Background**: Dark tech aesthetic (217 33% 6%)
- **Primary**: Cyan blue (199 89% 48%)
- **Accent**: Orange (37 92% 50%)
- **Keycap**: Dark gray (217 33% 16%)

### Custom CSS Classes
- `gradient-primary`: Primary gradient
- `gradient-keycap`: Keycap gradient
- `gradient-surface`: Surface gradient
- `shadow-keycap`: Keycap shadow
- `shadow-elevated`: Elevated shadow

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Full-width layout utilizing entire browser width
- Flexbox-based layout system for optimal space utilization

## Key Features

### 1. Layout Selection
- Three keyboard layouts (60%, TKL, Full)
- Visual layout preview
- Key count display

### 2. Key Selection
- **Single Click Selection**: Automatically opens editing mode
- **Multi-Selection**: Ctrl/Cmd + click for individual key selection
- **Drag Selection**: Click and drag across keyboard area for area-based multi-selection
- **DOM-Based Precision**: Uses actual DOM positions for pixel-perfect selection
- **Real-time Preview**: Visual feedback during drag selection
- **Layout Agnostic**: Works with any padding, scroll, zoom, or CSS transformations

### 3. Color Customization
- Individual keycap colors
- Legend text colors
- Preset color palettes
- Eyedropper tool
- Real-time preview

### 4. Multi-Layer System
- **Layer Management**: Add multiple text and image layers to each keycap
- **Layer Preview**: Compact visual preview above selected key
- **Layer Selection**: Click to select specific layer for editing
- **Layer Operations**: Add, delete, and reorder layers
- **Individual Layer Editing**: Each layer has its own properties and settings
- **Real-time Preview**: Live updates during layer editing
- **FloatingToolbar Integration**: All editing tools work with selected layer

### 5. Legend Editing
- Text and image legends per layer
- Font selection and sizing
- Position and alignment controls
- Rotation and mirror effects
- Text styling (bold, italic, underline)
- Real-time preview
- Compact floating toolbar interface

### 6. Group Management
- Save key selections as groups
- Load saved groups
- Delete groups
- Visual group indicators

### 7. Export Functionality
- JSON configuration export
- Summary text export
- Download with timestamps
- Header-based export dropdown

### 8. 3D Visualization
- Three.js powered 3D preview
- Orbit controls
- Lighting and shadows
- Animated keycaps

## Development Scripts

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Build Configuration

### Vite Config
- React SWC plugin for fast compilation
- Path alias: `@` → `./src`
- Development server: `::` (all interfaces), port 8080
- Lovable tagger plugin (development only)

### TypeScript
- Strict mode enabled
- Path mapping configured
- React types included

## Dependencies

### Core
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19

### UI & Styling
- Tailwind CSS 3.4.17
- shadcn/ui components
- Lucide React icons
- Tailwind Merge & Class Variance Authority

### 3D Graphics
- Three.js 0.180.0
- @react-three/fiber 8.18.0
- @react-three/drei 9.122.0

### Forms & Validation
- React Hook Form 7.61.1
- Zod 3.25.76
- @hookform/resolvers 3.10.0

### Utilities
- React Router DOM 6.30.1
- TanStack React Query 5.83.0
- Sonner (toast notifications)
- Date-fns 3.6.0

## File Paths & Imports

### Component Imports
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig'
import { KeyboardLayout } from '@/types/keyboard'
```

### Asset Imports
- Static assets: `public/` directory
- Icons: Lucide React components
- Images: Import as modules or data URLs

## State Management Pattern

### Centralized State
- Single `useKeyboardConfig` hook manages all state
- Immutable updates using spread operators
- Callback functions for performance optimization

### State Structure
```typescript
{
  layout: KeyboardLayout,
  globalSettings: { theme, font },
  selectedKeys: string[],
  groups: Record<string, string[]>,
  allLayouts: Record<LayoutType, KeyboardLayout>,
  currentLayoutType: LayoutType
}
```

## Performance Optimizations

### React Optimizations
- `useCallback` for event handlers
- Memoized component props
- Efficient re-render patterns

### 3D Performance
- Instanced rendering for keycaps
- Optimized geometry
- Efficient lighting setup

## Browser Compatibility

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features
- EyeDropper API (with fallback)
- Canvas API for image processing
- WebGL for 3D rendering
- CSS Grid and Flexbox

## Recent Updates & Changes

### FloatingToolbar Implementation
- **Replaced**: EnhancedColorPicker and EnhancedLegendEditor with unified FloatingToolbar
- **UI Design**: Canva-style compact floating toolbar with section-based organization
- **Layout**: Three main sections (Color | Aligning, Positioning & Sizing | Text)
- **Features Added**:
  - Text styling controls (bold, italic, underline)
  - Individual slider popups for precise control
  - Icon-only buttons for compact design
  - Theme-consistent color scheme
  - Real-time value display on control buttons
- **Compact Optimization (January 2025)**:
  - Content-based width (`w-fit`) instead of full width
  - Centered positioning with `mx-auto`
  - Minimal spacing (`gap-1`) between sections
  - Responsive sizing (smaller on mobile, larger on desktop)
  - Reduced separators (`h-4`) for tighter layout
  - `flex-shrink-0` to prevent section stretching

### DragSelection Improvements
- **Enhanced**: Real-time visual feedback during drag selection
- **Fixed**: Multi-selection conflicts with individual key clicks
- **Added**: Preview highlighting for keys under selection box
- **DOM-Based Selection**: Replaced grid-based calculations with actual DOM positions using `getBoundingClientRect()`
- **Area-Based Selection**: Changed from directional selection to geometric area containment
- **Layout Agnostic**: Now works with any padding, scroll, zoom, or CSS transformations
- **Key References**: Added `keyRefs` system for accessing actual DOM elements

### KeycapConfig Type Updates
- **Added**: `legendBold`, `legendItalic`, `legendUnderline` properties
- **Purpose**: Support for text styling in keycap legends

### UX Improvements
- **Single-click editing**: Keys open editing mode on single click
- **Continuous slider dragging**: Fixed slider UX for smooth dragging
- **Compact interface**: Reduced visual clutter with popup panels
- **Theme consistency**: All colors match dark tech aesthetic
- **Always-visible toolbar**: FloatingToolbar remains visible between view changes
- **Integrated positioning**: Toolbar positioned between view toggle and keyboard preview
- **Status feedback**: Clear indication when no key is selected for editing
- **Pixel-perfect selection**: DOM-based drag selection for precise multi-selection

### Full-Width Layout Implementation
- **Layout System**: Converted from CSS Grid to Flexbox for better width control
- **Container Constraints**: Removed max-width limitations to utilize full browser width
- **Fixed Left Panel**: Controls panel maintains consistent width (320px/384px) across screen sizes
- **Flexible Right Panel**: Keyboard preview expands to fill remaining horizontal space
- **Enhanced Scaling**: Keyboard preview centers and scales appropriately within expanded space
- **Responsive Behavior**: Maintained mobile-first approach with stacked layout on smaller screens
- **Space Utilization**: Optimized for larger screens while preserving mobile experience

### UnifiedSidebar Implementation
- **Layout Consolidation**: Merged three separate left panel containers into single UnifiedSidebar
- **Full-Edge Connection**: Sidebar sticks to header, footer, and left edge with no gaps
- **Internal Scrolling**: Full-height sidebar with overflow scroll instead of page widening
- **Section Organization**: Clear visual hierarchy with Layout, Groups, and Export sections
- **Seamless Integration**: No visual gaps or padding around sidebar container
- **Responsive Design**: Fixed width with internal scroll for content overflow

## Development Notes

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Consistent naming conventions

### Component Patterns
- Functional components with hooks
- Props interfaces for type safety
- Consistent prop naming
- Error boundaries (implicit)
- Local state management for slider controls
- DOM-based selection using `getBoundingClientRect()`
- `forwardRef` pattern for DOM element access
- Key reference management for precise positioning
- Flexbox-based layout system for responsive design
- Full-width container utilization with fixed/flexible panel distribution

### File Organization
- Feature-based component grouping
- Shared utilities in `/lib`
- Type definitions in `/types`
- Hooks in `/hooks`

## Future Enhancement Areas

### Potential Features
- More keyboard layouts (65%, 75%, etc.)
- Custom layout creation
- Import/export of configurations
- Cloud storage integration
- Collaborative editing
- Advanced 3D materials
- Animation presets
- Keyboard sound simulation

### Technical Improvements
- State persistence (localStorage)
- Undo/redo functionality
- Performance monitoring
- Accessibility improvements
- Mobile optimization
- PWA capabilities

---

*This reference document should be updated as the project evolves. Last updated: January 2025*

## Recent Updates - Multi-Layer System & UI Improvements (January 2025)

### Multi-Layer Keycap System
- **Layer Architecture**: Implemented KeycapLayer interface for individual layer management
- **Layer Management**: Added useLayerManagement hook for layer operations (add, delete, reorder, update)
- **Layer Preview**: Created KeyLayerPreview component with compact design above selected key
- **Layer Integration**: Updated FloatingToolbar to work with selected layers instead of key properties
- **Visual Design**: Theme-consistent layer preview with opacity, backdrop blur, and circular buttons

### FloatingToolbar Enhancement
- **Layer-Based Editing**: Modified to work with selected layer properties instead of key properties
- **Multi-Layer Support**: All editing functions now operate on the currently selected layer
- **Improved Integration**: Seamless integration with layer selection and management
- **Consistent Styling**: Maintains theme consistency while supporting layer-specific editing

### UI/UX Improvements
- **Export Relocation**: Moved ExportPanel from sidebar to header dropdown for better accessibility
- **Sidebar Consolidation**: Integrated LayerManager into UnifiedSidebar below GroupManager
- **Compact Layer Preview**: Removed verbose text labels, showing only layer content
- **Positioning Fix**: Layer preview positioned above keycap to avoid blocking
- **Theme Integration**: All new components match dark tech aesthetic with proper color tokens

### Component Updates
- **KeyboardPreview**: Added layer preview functionality with proper positioning
- **UnifiedSidebar**: Now includes layer management section with full functionality
- **KeycapPreview**: Updated to render multiple layers with proper positioning and styling
- **Index.tsx**: Updated to pass layer management props and handle layer operations

### Layout Consolidation
- **Merged Components**: Combined CompactLayoutSelector, GroupManager, and LayerManager into single UnifiedSidebar
- **Eliminated Gaps**: Removed all padding and gaps around sidebar for seamless edge connection
- **Full-Height Design**: Sidebar now extends from header to footer with internal scrolling
- **Improved Organization**: Clear section divisions with consistent typography and separators
- **Enhanced UX**: Single cohesive container instead of multiple separate components

## Latest Updates - Image Upload & Layer Preview Fixes (January 2025)

### Image Upload System Improvements
- **Fixed Layer Type Change**: Image button no longer immediately changes layer type to 'image' when clicked
- **Preserved Layer Content**: Layer content and display remain unchanged until actual image is uploaded
- **Improved Button State**: Image button shows active state based on upload panel visibility, not layer type
- **Eliminated Broken Previews**: No more broken image placeholders when clicking image icon
- **Better UX Flow**: Users can click image icon to open upload panel without affecting current layer content

### Layer Preview Enhancements
- **Auto-Layer Selection**: Layer preview now appears immediately when clicking on a keycap
- **First Layer Auto-Select**: Automatically selects the first layer when a key with layers is clicked
- **Improved Visibility**: Layer preview appears above selected keycap without blocking the key
- **Click-Outside Functionality**: Layer preview closes when clicking outside of it
- **Compact Design**: Clean, minimal design showing only layer content without verbose labels

### Content Management Fixes
- **Empty Content Handling**: Fixed layer creation to use `undefined` instead of empty string for image layers
- **Proper Image Rendering**: Images only render when actual content exists and is not empty
- **Consistent State Management**: All components now properly handle empty/undefined content states
- **No Placeholder Artifacts**: Eliminated unwanted placeholder images on keycaps

### Component Architecture Updates
- **useLayerManagement**: Updated to create image layers with `undefined` content instead of empty string
- **KeycapPreview**: Enhanced image rendering conditions to check for valid, non-empty content
- **FloatingToolbar**: Improved image upload flow and button state management
- **KeyLayerPreview**: Updated to handle empty image content properly
- **Index.tsx**: Added auto-layer selection logic for better user experience

### User Experience Improvements
- **Intuitive Layer Selection**: Clicking a keycap immediately shows layer preview and selects first layer
- **Clean Image Upload**: Image upload panel opens without affecting current layer state
- **Visual Consistency**: All image-related UI elements work harmoniously together
- **Reduced Confusion**: No more unexpected layer type changes or broken displays
- **Smooth Workflow**: Seamless transition from text to image layers when needed
