import { type Location } from '../types/location';

interface SearchResponse {
  features: {
    geometry: {
      coordinates: [number, number];
    };
    properties: {
      place_id: string;
      display_name: string;
    };
  }[];
}

export const searchLocations = async (term: string): Promise<Location[]> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${term},Poland&format=geojson&addressdetails=1&layer=address&limit=5`,
  );

  const data: SearchResponse = await response.json();

  return data.features.map((feature) => ({
    id: feature.properties.place_id,
    name: feature.properties.display_name,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
};
