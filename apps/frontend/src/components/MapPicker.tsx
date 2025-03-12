// import styles from './mapPicker.module.css';

import 'leaflet/dist/leaflet.css';
import { type LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';

interface Props {
  setLatitude?: (latitude: number) => void;
  setLongitude?: (longitude: number) => void;
  latitude: number;
  longitude: number;
  readOnly: boolean;
  className?: string;
}

export default function MapPicker({ setLatitude, setLongitude, latitude, longitude, readOnly, className }: Props) {
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 52.231641,
    lng: 21.00618,
  });

  const zoom = 13;

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
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
      <MapEvents />
    </MapContainer>
  );
}
