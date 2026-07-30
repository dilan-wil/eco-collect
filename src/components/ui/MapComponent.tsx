"use client";
import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Configure default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color?: string;
  popup?: React.ReactNode;
  onClick?: () => void;
}

interface MapComponentProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  interactive?: boolean;
}

// Component to auto-fit bounds
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (markers.length > 0) {
      const validMarkers = markers.filter(
        (m) =>
          m.lat &&
          m.lng &&
          !isNaN(m.lat) &&
          !isNaN(m.lng) &&
          m.lat !== 0 &&
          m.lng !== 0,
      );

      if (validMarkers.length === 1) {
        map.setView([validMarkers[0].lat, validMarkers[0].lng], 15);
      } else if (validMarkers.length > 1) {
        const bounds = validMarkers.map(
          (m) => [m.lat, m.lng] as [number, number],
        );
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
        });
      }
    }
  }, [markers, map]);

  return null;
}

export function MapComponent({
  markers,
  center,
  zoom = 13,
  height = "400px",
  className = "",
  interactive = true,
}: MapComponentProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default center: Douala, Cameroon
  const defaultCenter: [number, number] = [4.0511, 9.7679];
  const mapCenter = center || defaultCenter;

  const validMarkers = markers.filter(
    (m) =>
      m.lat &&
      m.lng &&
      !isNaN(m.lat) &&
      !isNaN(m.lng) &&
      m.lat !== 0 &&
      m.lng !== 0,
  );

  const createIcon = (color: string) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  // Don't render on server
  if (!isMounted) {
    return (
      <div
        className={`rounded-xl overflow-hidden border shadow-sm bg-muted ${className}`}
        style={{ height }}
      />
    );
  }

  return (
    <div
      className={`rounded-xl overflow-hidden border shadow-sm ${className}`}
      style={{ height }}
    >
      <MapContainer
        key={JSON.stringify(mapCenter)}
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <ZoomControl position="bottomright" />}

        <FitBounds markers={validMarkers} />

        {validMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={marker.color ? createIcon(marker.color) : undefined}
            eventHandlers={{
              click: () => marker.onClick && marker.onClick(),
            }}
          >
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
