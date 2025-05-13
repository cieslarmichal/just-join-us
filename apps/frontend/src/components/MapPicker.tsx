import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { config } from '../config';

interface Props {
  setLatitude?: (latitude: number) => void;
  setLongitude?: (longitude: number) => void;
  latitude: number;
  longitude: number;
  readOnly: boolean;
  className?: string;
  zoom?: number;
}

export default function MapPicker({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  readOnly,
  className,
  zoom = 13,
}: Props) {
  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude], zoom);
      }
    }, [map]);

    map.on(
      'click',
      (e: {
        latlng: {
          lat: number;
          lng: number;
        };
      }) => {
        if (readOnly) {
          return;
        }

        const { lat, lng } = e.latlng;

        if (setLatitude !== undefined) {
          setLatitude(lat);
        }

        if (setLongitude !== undefined) {
          setLongitude(lng);
        }

        map.setView([lat, lng], map.getZoom(), { animate: true, duration: 0.5 });
      },
    );

    return null;
  };

  return (
    <MapContainer
      center={latitude && longitude ? { lat: latitude, lng: longitude } : { lat: 52.012373, lng: 19.038552 }}
      zoom={latitude && longitude ? zoom : 5}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${config.mapTiler.apiKey}`}
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
      />
      {latitude && longitude && <Marker position={{ lat: latitude, lng: longitude }} />}
      <MapEvents />
    </MapContainer>
  );
}
