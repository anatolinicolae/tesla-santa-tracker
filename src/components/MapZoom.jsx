import { useMemo } from "react";
import { useMap } from "react-leaflet";
import { control } from "leaflet";

export function MapZoom() {
  const map = useMap();

  const zoomControl = useMemo(() => {
    return control.zoom({ position: "bottomright" });
  }, []);

  zoomControl.addTo(map);

  return null;
}
