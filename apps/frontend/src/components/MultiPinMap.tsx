import 'leaflet/dist/leaflet.css';
import { type LatLngLiteral } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { config } from '../config';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  zoom?: number;
  pins?: LatLngLiteral[];
}

export default function MultiPinMap({ className, style, zoom = 13, pins = [] }: Props) {
  const MapEvents = () => {
    const map = useMap();
    map.on(
      'click',
      (e: {
        latlng: {
          lat: number;
          lng: number;
        };
      }) => {
        const { lat, lng } = e.latlng;

        map.setView([lat, lng], map.getZoom());
      },
    );

    return null;
  };

  return (
    <MapContainer
      center={{ lat: 52.012373, lng: 19.038552 }}
      zoom={zoom}
      scrollWheelZoom
      className={className}
      style={style}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${config.mapTiler.apiKey}`}
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
      />
      {pins.map((position, index) => (
        <Marker
          key={index}
          position={position}
        />
      ))}
      <MapEvents />
    </MapContainer>
  );
}
