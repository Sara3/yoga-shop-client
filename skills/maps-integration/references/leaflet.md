# Leaflet Implementation

## Setup

```bash
bun add leaflet react-leaflet
bun add -D @types/leaflet
cp node_modules/leaflet/dist/leaflet.css src/leaflet.css
cp node_modules/leaflet/dist/images/marker-icon.png static/
cp node_modules/leaflet/dist/images/marker-shadow.png static/
```

**IMPORTANT:** Do NOT load Leaflet CSS from CDN (unpkg, cdnjs, etc). Copy it locally as shown above, then import with `import "./leaflet.css"`. CDN loading can break and is unreliable.

## Basic Map

```tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./leaflet.css"; // Local copy - NOT from CDN

// Fix marker icons (use relative path, no leading slash)
const defaultIcon = L.icon({
  iconUrl: "static/marker-icon.png",
  shadowUrl: "static/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

function LocationMap({ locations, center }: { locations: Location[]; center: { lat: number; lng: number } }) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={12} className="h-64 w-full">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {locations.map((loc, i) => (
        <Marker key={i} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

## Tile Providers

```tsx
const TILES = {
  // CartoDB (recommended) - clean, modern
  voyager: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  cartoLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  cartoDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  
  // OpenStreetMap - standard
  osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  
  // ESRI - satellite imagery
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

// Dark mode support
<TileLayer url={isDark ? TILES.cartoDark : TILES.voyager} />
```

## Fit Bounds

```tsx
import { useMap } from "react-leaflet";

function FitBounds({ locations }: { locations: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      map.fitBounds(L.latLngBounds(locations.map(l => [l.lat, l.lng])), { padding: [20, 20] });
    }
  }, [locations, map]);
  return null;
}
```

## Routes

```tsx
import { Polyline } from "react-leaflet";

<Polyline positions={route.map(p => [p.lat, p.lng])} pathOptions={{ color: "#3b82f6", weight: 4 }} />
```
