import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet marker icons
import iconUrl from "leaflet/dist/images/marker-icon.png"
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"
import shadowUrl from "leaflet/dist/images/marker-shadow.png"

// Configure default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

interface MapMarker {
  id: string
  lat: number
  lng: number
  color?: string
  popup?: React.ReactNode
  onClick?: () => void
}

interface MapComponentProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
  interactive?: boolean
}

export function MapComponent({ 
  markers, 
  center = [45.7640, 4.8357], // Lyon default
  zoom = 13, 
  height = "400px",
  className = "",
  interactive = true
}: MapComponentProps) {
  
  // Custom colored markers using divIcon
  const createIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    })
  }

  return (
    <div className={`rounded-xl overflow-hidden border shadow-sm ${className}`} style={{ height }}>
      <MapContainer 
        center={center} 
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
          className="map-tiles"
        />
        {interactive && <ZoomControl position="bottomright" />}
        
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={marker.color ? createIcon(marker.color) : new L.Icon.Default()}
            eventHandlers={{
              click: () => marker.onClick && marker.onClick()
            }}
          >
            {marker.popup && (
              <Popup className="rounded-lg">
                {marker.popup}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}