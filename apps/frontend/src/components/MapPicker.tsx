import 'leaflet/dist/leaflet.css';
import { type LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { config } from '../config';

interface Props {
  setLatitude?: (latitude: number) => void;
  setLongitude?: (longitude: number) => void;
  latitude?: number;
  longitude?: number;
  readOnly?: boolean;
  className?: string;
  zoom?: number;
  pins?: LatLngLiteral[];
  onPinAdd?: (pin: LatLngLiteral) => void;
}

export default function MapPicker({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  readOnly = false,
  className,
  zoom = 13,
  pins = [],
  onPinAdd,
}: Props) {
  const [positions, setPositions] = useState<LatLngLiteral[]>(
    pins.length > 0
      ? pins
      : latitude && longitude
        ? [{ lat: latitude, lng: longitude }]
        : [{ lat: 51.75202, lng: 19.45356 }],
  );

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude], zoom);
      }
    }, [map, latitude, longitude, zoom]);

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

        const newPin = { lat, lng };
        setPositions((prev) => [...prev, newPin]); // Add the new pin to the state

        if (onPinAdd) {
          onPinAdd(newPin); // Trigger the callback for the new pin
        }

        if (setLatitude) {
          setLatitude(lat);
        }

        if (setLongitude) {
          setLongitude(lng);
        }

        map.setView([lat, lng], map.getZoom());
      },
    );

    return null;
  };

  return (
    <MapContainer
      center={positions[0]} // Center on the first pin
      zoom={zoom}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${config.mapTiler.apiKey}`}
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
      />
      {positions.map((position, index) => (
        <Marker
          key={index}
          position={position}
        />
      ))}
      <MapEvents />
    </MapContainer>
  );
}
