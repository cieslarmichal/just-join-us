import 'leaflet/dist/leaflet.css';
import { type LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { config } from '../config';

interface Props {
  setLatitude?: (latitude: number) => void;
  setLongitude?: (longitude: number) => void;
  latitude: number;
  longitude: number;
  readOnly?: boolean;
  className?: string;
  zoom?: number;
}

export default function MapPicker({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  readOnly = false,
  className,
  zoom = 13,
}: Props) {
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: latitude || 51.75202,
    lng: longitude || 19.45356,
  });

  useEffect(() => {
    if (latitude && longitude) {
      setPosition({
        lat: latitude,
        lng: longitude,
      });
    }
  }, [latitude, longitude]);

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

        setPosition({
          lat,
          lng,
        });

        if (setLatitude !== undefined) {
          setLatitude(lat);
        }

        if (setLongitude !== undefined) {
          setLongitude(lng);
        }

        map.setView([lat, lng], map.getZoom());
      },
    );

    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${config.mapTiler.apiKey}`}
        attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
      />
      <Marker position={position} />
      <MapEvents />
    </MapContainer>
  );
}
