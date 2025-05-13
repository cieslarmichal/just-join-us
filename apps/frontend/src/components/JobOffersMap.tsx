import MultiPinMap from './MultiPinMap';

interface Props {
  pins: {
    latitude: number;
    longitude: number;
  }[];
}

export default function JobOffersMap({ pins }: Props) {
  return (
    <div className="flex-1/2">
      <MultiPinMap
        pins={pins.map((pin) => ({
          lat: pin.latitude,
          lng: pin.longitude,
        }))}
        className="w-full"
        style={{ height: 'calc(100vh - 150px)' }}
        zoom={6}
      />
    </div>
  );
}
