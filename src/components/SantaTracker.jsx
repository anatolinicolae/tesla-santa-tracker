import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { SantaMarker, SantaHomeMarker } from "./SantaMarker";
import { MapController } from "./MapController";
import { MapZoom } from "./MapZoom";
import usePosition from "../hooks/usePosition";
import config from "../config/config";
import "leaflet/dist/leaflet.css";

export function SantaTracker() {
  const { currentPosition, trail, loading, error } = usePosition();

  if (loading) {
    return <div className="loading">Loading Santa's location...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!currentPosition) {
    return <div>No position data available</div>;
  }

  return (
    <MapContainer
      attributionControl={false}
      preferCanvas
      center={currentPosition}
      zoom={config.zoomLevel}
      zoomControl={false}
      className="flex-grow w-full h-full overflow-hidden rounded-lg shadow-lg bg-black"
    >
      <MapZoom />
      <MapController position={currentPosition} />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <SantaMarker position={currentPosition} />
      <SantaHomeMarker />
      <Polyline
        positions={trail}
        color="#D42426"
        weight={4}
        smoothFactor={1}
        opacity={0.8}
        lineJoin="round"
        lineCap="round"
      />
    </MapContainer>
  );
}
