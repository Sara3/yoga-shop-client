# Google Maps Implementation

Use only when you need Places autocomplete, Street View, or traffic layers.

## Get Config

```tsx
import { getMapConfig } from "@dev-agents/sdk-client";

const [config, setConfig] = useState<{ googleMapsApiKey: string | null } | null>(null);
useEffect(() => { getMapConfig("google").then(setConfig); }, []);
```

## Load and Initialize

```tsx
const mapRef = useRef<HTMLDivElement>(null);
const mapInstanceRef = useRef<google.maps.Map | null>(null);

useEffect(() => {
  if (!config?.googleMapsApiKey || !mapRef.current || mapInstanceRef.current) return;

  const callbackName = "initGoogleMaps";
  (window as any)[callbackName] = () => {
    if (mapInstanceRef.current || !mapRef.current) return;
    const map = new google.maps.Map(mapRef.current, { center: { lat, lng }, zoom: 12 });
    mapInstanceRef.current = map;
    
    locations.forEach((loc) => {
      new google.maps.Marker({ map, position: { lat: loc.lat, lng: loc.lng }, title: loc.name });
    });
  };

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&callback=${callbackName}`;
  script.async = true;
  document.head.appendChild(script);

  return () => { delete (window as any)[callbackName]; };
}, [config?.googleMapsApiKey, locations]);

// Container MUST have explicit height
<div ref={mapRef} className="h-64 w-full" />
```

## Troubleshooting

- **Blank map**: Container needs explicit height (e.g., `h-64`, `style={{ height: "400px" }}`)
- **"importLibrary is not a function"**: Use callback-based loading (above), not async/importLibrary
