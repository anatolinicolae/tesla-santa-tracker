import { Icon } from 'leaflet'
import { Marker } from 'react-leaflet'
import useSettings from '../hooks/useSettings'
import santaIcon from '../assets/santa-icon.png'
import homeIcon from '../assets/santa-home.png'

const SANTA_ICON = new Icon({
  iconUrl: santaIcon,
  iconSize: [128, 128],
  iconAnchor: [64, 64]
})

const HOME_ICON = new Icon({
  iconUrl: homeIcon,
  iconSize: [128, 128],
  iconAnchor: [64, 64]
})

export function SantaMarker({ position }) {
  return <Marker position={position} icon={SANTA_ICON} />
}

export function SantaHomeMarker() {
  return <Marker position={[66.3236, 25.5051]} icon={HOME_ICON} />
}
