import MapPicker from './MapPicker';

interface Props {
  locations: {
    latitude: number;
    longitude: number;
  }[];
}

export default function JobOffersMap({ locations }: Props) {
  return (
    <div className="flex-1/2">
      <MapPicker
        pins={locations.map((location) => ({
          lat: location.latitude,
          lng: location.longitude,
        }))}
        className="w-full h-dvh"
        readOnly
        zoom={7}
      />
    </div>
  );
}
