---
name: frontend-design
description: REQUIRED for all UI work. Design patterns and aesthetic guidelines for App.tsx—covers typography, color themes, responsive design, dark/light mode, and creative direction.
license: Complete terms in LICENSE.txt
---


# Design Thinking

Before writing code, answer these questions:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Commit to a specific aesthetic direction: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Differentiation**: What single element will someone remember?

**Key principle**: Bold maximalism and refined minimalism both work. The key is *intentionality*, not intensity. Match implementation complexity to the vision—elaborate animations for maximalist designs, restraint and precision for minimal ones.


# Interface priority

The priority with which you build views depends on your agent's primary focus:

**App-first approach:**
- If the app is the primary focus, set `defaultView: app` in `agent.yaml`
- Build the full app first with all features and interactions
- If desired, build the widget after the app is complete, with a focus on bold, simple interface that provides a quick glimpse of the app's value

**Widget-first approach:**
- If the widget is the primary focus, set `defaultView: widget` in `agent.yaml`
- Build the widget first with a focus on visual impact and immediate information
- Build the app view as a configuration/setup interface that complements the widget


# Aesthetics

## Typography
Choose distinctive fonts that match the aesthetic. Avoid generic fonts like Arial and Inter. 

**Using custom fonts:**
```tsx
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Font+Name:wght@400;500;700&display=swap');
`}</style>
```
Then use with Tailwind: `font-['Font_Name']`

**Font pairing strategies by mood** (examples for inspiration—explore Google Fonts for alternatives):
- **Professional/Clean**: Neutral sans (DM Sans, Plus Jakarta Sans, Geist) + clean mono for data
- **Editorial/Sophisticated**: Refined serif (Crimson Pro, Playfair Display) + neutral sans for UI
- **Playful/Friendly**: Rounded sans (Nunito, Quicksand) + quirky display (Fredoka, Baloo)
- **Tech/Modern**: Geometric sans (Outfit, Syne) + monospace accents
- **Luxury/Refined**: High-contrast serif (Cormorant, Bodoni Moda) + elegant sans (Jost, Tenor Sans)
- **Entertainment/Gaming**: Angular/aggressive (Rajdhani, Audiowide, Orbitron) + technical sans

Explore Google Fonts—these are starting points, not the only options

## Color & Theme
Use semantic Tailwind colors as your foundation:  `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, etc.

**When to add expressive color:**

- **Professional/Productivity**: Subtle accents for status. Data-driven palettes (emerald/amber).
- **Social/Community**: Bold, saturated primaries. Signature brand colors.
- **Creative**: Unexpected combinations. Let content inspire the palette.
- **Health/Wellness**: Soft, organic palettes. Muted greens, warm neutrals.
- **Entertainment/Gaming**: Vibrant accents (neon cyan, electric purple). Glow effects like `shadow-[0_0_20px_rgba(34,211,238,0.5)]`.

**Gradients add energy:**
```tsx
// Dramatic hero gradient
<div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">

// Text gradient
<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
```

## Visual Style Patterns

**Glassmorphism:**
```tsx
<div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl">
```

**Gradient border:**
```tsx
<div className="p-[1px] bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl">
  <div className="bg-background rounded-xl p-4">Content</div>
</div>
```

**Colored shadows:** `shadow-lg shadow-violet-500/25`

**Hover glow:** `hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]`

## Motion
Prioritize high-impact moments over scattered micro-interactions.

**Best approaches:**
- One well-orchestrated page load with staggered reveals (`animation-delay`)
- Scroll-triggered animations that surprise
- Hover states with personality
- CSS animations when possible; Motion library for complex sequences

## Spatial Composition
Break predictable patterns:
- Asymmetric layouts
- Overlapping elements
- Diagonal flow
- Grid-breaking focal points
- Generous negative space OR controlled density (commit to one)

## Domain-Driven Aesthetics
**Let the app's purpose shape its visual identity.** Draw inspiration from the domain:

**Social/Community:** Personality-forward (avatars, reactions), playful animations, bold colors, card-heavy layouts, rounded shapes.

**Finance/Productivity:** Dense information hierarchy, green/red for gains/losses, monospace for numbers, precise grid layouts, minimal decoration.

**Creative/Design:** Bold whitespace, artistic palettes, large typography, grain textures, delightful micro-animations.

**Health/Fitness:** Organic shapes, calming palettes (sage, terracotta), generous padding, progress visualizations, friendly typography.

**Music/Audio:** Waveform elements, dark + vibrant accents, equalizer visualizations, album-art color extraction.

**Entertainment/Gaming:** Dark backgrounds + neon accents, angular shapes, glow effects on interaction, HUD-inspired layouts, aggressive typography.

## Creative License

**You have permission to be bold.** The semantic color system and component libraries are guardrails, not cages. For apps with strong personality—entertainment, social, creative tools—feel free to:

- Break from minimal aesthetics when the domain calls for it
- Use dramatic color combinations that match the app's energy
- Add atmospheric effects (glows, gradients, textures)
- Embrace maximalism when it serves the experience

Conservative design fits productivity tools and enterprise software. For apps meant to engage or excite—**lean into the aesthetic**. Trust your judgment about what the app wants to be.

**The goal is memorable, not safe.** Each project should feel distinct—vary your font choices, color approaches, and layouts. If you find yourself reaching for the same patterns repeatedly, push yourself to explore something new.


# Dark and Light Mode

All interfaces must work in both themes. The system handles switching—never add a theme toggle.

**The default background is `bg-card`.** To customize, use a wrapper div (the platform overrides `body`). If keeping the default, `bg-card` on elements won't create separation—use borders, shadows, or other colors instead.

**Test in both modes.** Always check your UI in both light and dark mode. Ensure there's enough contrast between the page background and your elements.

**Semantic colors available:**
`bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `text-accent-foreground`, `bg-destructive`, `text-destructive-foreground`, `border`

Use explicit colors only for data visualization or when users specifically request them. When using explicit colors, include dark mode variants: `text-emerald-600 dark:text-emerald-400`.


# Responsive Design & Render Modes

Your app renders in different modes (check `renderContext.type`):

**Widget Mode** (`type: "widget"`): ~300x300px dashboard widget. Show only essential information, compact text, content starts at top. Design for passive consumption, not active use. Avoid scrolling unless necessary.

**App Mode** (`type: "app"`): Full screen, must be responsive across mobile and desktop.

## Shared Logic Pattern

**CRITICAL:** Share business logic between widget and app modes. Only separate the presentation layer. If you duplicate logic, bugs only get fixed in one view.

```tsx
function useItemsData() {
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => call<typeof getItems>('getItems', {}),
  });
  return { data, isLoading };
}

export default function App({ renderContext }: { renderContext: RenderContext }) {
  const { data, isLoading } = useItemsData();
  if (isLoading) return <LoadingIcon />;

  if (renderContext.type === "widget") {
    return <CompactWidgetView data={data} />;
  }
  return <FullInteractiveView data={data} />;
}
```


# Views Configuration

Configure which views your agent supports in `agent.yaml`. All views must be registered in the `views:` property otherwise they may not be shown to the user.

## Basic Configuration

```yaml
# Default view shown in the gallery and on install
defaultView: widget

# UI Views configuration
views:
  - type: app
  - type: widget
    name: Single Note
    identifier: note-widget
    constraints:
      minWidth: 72
      minHeight: 168
      maxWidth: 360
      maxHeight: 360
      defaultWidth: 168
      defaultHeight: 168
  - type: feed
```

**Key points:**
- **`defaultView`**: Sets which view is presented when the agent is installed (options: `widget`, or `app`)
- **`views`**: Array of all view types your agent supports. Each view must be registered here to be available
- **View types**: `app` (full screen), `widget` (dashboard widget)
- **Widget constraints**: Optional size constraints for widget views
  - `minWidth`/`minHeight`: Minimum dimensions (in pixels)
  - `maxWidth`/`maxHeight`: Maximum dimensions (in pixels) 
  - `defaultWidth`/`defaultHeight`: Default dimensions when the widget is first added to the dashboard (in pixels). If not present, Small dimensions will be used.


Standard widget sizes: (base, these may be scaled depending on device size)
- Icon - ~72x72
- Icon wide - ~72x168
- Small - ~168x168
- Medium - ~168x360
- Large - ~360x360
- Extra Large - ~360x744

## View Options

**`borderStyle: borderless`**
Removes the default background and border, allowing your content to extend to the edges:

```yaml
views:
  - type: widget
    borderStyle: borderless
```

When `borderStyle: borderless` is set, outer containers should not have a background set so that the underlying system wallpaper is visible. This allows non-rectangular views.

**`viewportFit: cover`**
Extends content under system UI (status bar, notch, etc.) for immersive full-screen experiences. This only applies to 'app' views.

```yaml
views:
  - type: app
    viewportFit: cover
```

**Important:** Only set `viewportFit: cover` once you've implemented safe area support. Without proper safe area handling, content will be hidden behind system UI.

## Safe Areas

Safe area support is critical for responsive apps, especially on mobile devices with notches, status bars, and home indicators. Content must be positioned to avoid these system UI elements. Widgets DO NOT use safe areas. Widgets are already inset, so don't include safe area markup in them.

**Using Tailwind CSS Safe Area (Recommended)**

Safe area utility classes from `tailwindcss-safe-area` are provided with the default base CSS. Use the `pt-safe` and `pb-safe` utilities to ensure content can be scrolled effectively:

```tsx
export default function App({ renderContext }: { renderContext: RenderContext }) {
  return (
    <div className="pt-safe pb-safe">
      {/* Your content */}
    </div>
  );
}
```

**Manual Safe Area Management**

To manage safe areas manually, use CSS environment variables:
- `env(safe-area-inset-top)` - Top safe area (status bar, notch)
- `env(safe-area-inset-right)` - Right safe area
- `env(safe-area-inset-bottom)` - Bottom safe area (home indicator)
- `env(safe-area-inset-left)` - Left safe area

### Best Practices

- **`pt-safe`** is a great way to have a toolbar to extend its background color up to the top of the screen on mobile. Use `pt-safe-or-4` to ensure a minimum value if needed for a desktop browser.
- **`pb-safe`** helps scrollable content not get lost behind a system navigation bar. Include it on top-level or full-screen scroll areas.
- Use safe areas on any elements that touch screen edges like drawers or toolbars.
- Fixed positioned elements should also use these insets (rather than right:4px, bottom:4px) to make sure they're not blocked by system UI.
- If your app works in landscape, ensure that left and right insets are handled with pl/pr or ml/mr classes.


# Widgets

Widgets are compact, dashboard-embedded views (~300x300px) designed for passive consumption. They should be visually rich and immediately informative, not complex-apps.

**IMPORTANT: Fitting the view:** Ensure that the entire viewport is fully used. Use responsive CSS (flexbox, grid, media queries, w-full, h-full). If you are making a widget, read `skills/reading-container-dimensions/SKILL.md` for ResizeObserver patterns. Often the CSS techniques alone will not fill the full height of the widget view.

## File Structure

**Use a separate `Widget.tsx` file** for widget-specific components. This keeps your code organized and makes the widget implementation clear:

```tsx
// Widget.tsx
export default function Widget({ renderContext }: { renderContext: RenderContext }) {
  const { data, isLoading } = useItemsData();
  if (isLoading) return <LoadingIcon />;
  
  return (
    <div className="flex w-screen h-screen">
      {/* Widget content - make sure it covers the full area*/}
    </div>
  );
}

// App.tsx
import Widget from './Widget';

export default function App({ renderContext }: { renderContext: RenderContext }) {
  if (renderContext.type === "widget") {
    return <Widget renderContext={renderContext} />;
  }
  return <FullAppView renderContext={renderContext} />;
}
```

**Component sharing:** Share components between widget and app views when appropriate (e.g., data visualization components, status indicators). However, widgets may be more visual and less interactive than their app counterparts—adapt components accordingly or create widget-specific variants when needed.

## Design Principles

**Highly visual, full-area content:**
- Fill the entire widget area—use `h-full w-full` on the root container
- Prioritize visual elements (charts, images, large numbers, status indicators) over text
- Make the most important information immediately visible without scrolling
- Use bold typography and high-contrast colors for readability at small sizes

**Minimal interactions:**
- The default behavior for any click/tap should be opening the full app
- Avoid complex forms, multi-step flows, or nested navigation within the widget
- If you need interactive elements, keep them to simple text fields, toggles or single-click actions. Any non-interactive element will open the full app

## Launching the Full App

Use `showInView()` to launch the full app from the widget, optionally navigating to a specific piece of content:

```tsx
import { showInView } from '@dev-agents/sdk-client';

export default function Widget({ renderContext }: { renderContext: RenderContext }) {
  const handleClick = () => {
    showInView('/items/123', 'app');
  };

  return (
    <div 
      className="h-full w-full cursor-pointer"
      onClick={handleClick}
    >
      {/* Widget content that opens the app when clicked */}
    </div>
  );
}
```

**Function signature:**
```tsx
export function showInView(path?: string, viewType?: "app" | "widget")
```

- `path`: Optional route or content identifier to navigate to in the full app (e.g., `/items/123`, `/dashboard`)
- `viewType`: Optional target view type (`"app"` for full screen, `"widget"` for widget). Defaults to `"app"` if omitted


# Navigation & Deep Linking

Apps need to manage their own routing and URL state. Use the browser's native History API (`window.history.pushState` and `window.history.replaceState`) to update the URL and enable deep linking—allowing users to bookmark specific views and share direct links.

**Note:** Both `window.history.pushState`/`replaceState` and React Router's `navigate()` are seamlessly bridged to work with the parent window's browser history. Use whichever approach fits your app—both work equally well. These only work in app mode (not widget mode).

## History API

**Available functions:**
```tsx
import { getLocation, setChangeHandler } from '@dev-agents/sdk-client';

const currentUrl = await getLocation();

// Listen for browser back/forward navigation
setChangeHandler((event) => {
  // event.state contains the state object
  // event.location.url contains the new URL
});
```


# Rendering Markdown

When displaying markdown content, use `react-markdown` with custom component styling:

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    a: ({ href, children }) => <a href={href} className="text-primary underline">{children}</a>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-muted pl-4 italic">{children}</blockquote>,
  }}
>
  {content}
</ReactMarkdown>
```

`react-markdown` and `remark-gfm` are both installed by default in the standard development setup.

# Components

## Component Libraries
- **Use shadcn/ui components** when available
- Standard components are in `examples/components/`—use these first
- Customize components to match your aesthetic vision

## Icons & Visual Elements
- **Use Lucide icons** (`lucide-react`) for all interface icons
- **Never use emoji** as decoration or interface icons unless explicitly requested
- Maintain consistent icon sizing throughout the UI, usually the 24px default


# Interactions and flows

## Micro-interactions & Feedback
- Button states: normal, active, disabled, loading
- Form validation: inline feedback, clear error messages
- Smooth transitions between states

## Design for touch
- Because these interfaces can be used on mobile, aim to have touchable buttons—usually a minimum of 40px. Use the same, touch-compatible, sizes on both desktop and mobile.
- Avoid hover states because that only work in desktop environments

## Cursors
- Use cursor:default for most interactive elements in a view, including buttons. Use cursor:pointer for text and graphic links that will open an external link or navigate the view. 

## Loading States
- Use the `LoadingIcon` component from `examples/components/LoadingIcon.tsx`
- Always show loading feedback for async operations

## Empty States & Error Handling
- Design thoughtful empty states ("No items yet" with helpful next steps)
- Handle error states gracefully with clear, actionable messages
- Use `text-destructive` color for error messages

