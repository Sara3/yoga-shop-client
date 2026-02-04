---
name: maps-integration
description: Patterns for adding interactive maps to agents. Use when displaying locations, routes, or geographic data. Covers Leaflet and Google Maps.
---

# Maps Integration

## Provider Selection

When implementing maps, briefly inform the user of the available options:

> "I'll add a map to display [locations/routes/etc]. There are two providers available:
> - **Leaflet** - Supports markers, popups, custom styles, routes, and dark mode
> - **Google Maps** - Additionally supports Places autocomplete, Street View, and live traffic
>
> I'll use Leaflet unless you need those Google-specific features."

Then proceed with Leaflet unless the user asks for Google Maps features.

→ **[Leaflet Reference](references/leaflet.md)** - Default choice, covers most use cases

→ **[Google Maps Reference](references/google-maps.md)** - Only when Places, Street View, or traffic needed

## Maps-Specific Patterns

### Separate Component

Put map logic in its own component file (e.g., `src/components/MapView.tsx`).

### Guard Against Double Initialization

Maps load external scripts that should only initialize once:

```tsx
const mapInstanceRef = useRef<google.maps.Map | null>(null);

useEffect(() => {
  if (mapInstanceRef.current) return; // Already initialized
  // ... initialize map
  mapInstanceRef.current = map;
}, []);
```

### Use Refs for Map Instances

Store map instances in refs, not state. State changes trigger re-renders which cause initialization loops.

## Widgets

For maps in widgets, disable interactions so tapping opens the full app:

```tsx
<div onClick={() => showInView(undefined, "app")} className="cursor-pointer">
  <MapContainer
    center={[lat, lng]}
    zoom={10}
    zoomControl={false}
    dragging={false}
    scrollWheelZoom={false}
    doubleClickZoom={false}
    touchZoom={false}
  />
</div>
```

To pass context from widget to app (e.g., selected location), store it in the database and read it when the app loads.

## User Location

The browser's `navigator.geolocation` API is not available in the agent iframe sandbox. Use the `get_location` tool instead to get the user's saved locations:

```ts
import { get_location } from "@tools/user-location";

// In your server function
const location = await get_location(sdk, { type: "latest" }); // or "home", "work"
// Returns { latitude, longitude, description, ... }
```

Then pass the coordinates to your map component via props or React Query.

## Provider Comparison

| Aspect | Leaflet | Google Maps |
|--------|---------|-------------|
| **Features** | Markers, polylines, popups, custom styles | + Street View, Places autocomplete, traffic |
| **Dark Mode** | CartoDB dark tiles | Native support |
| **Bundle** | ~42KB | External script |
