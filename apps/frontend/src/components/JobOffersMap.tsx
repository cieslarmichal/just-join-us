import MapPicker from './MapPicker';

export default function JobOffersMap() {
  return (
    // TODO: make map full height
    <div className="flex-1/2">
      <MapPicker
        latitude={52.231641}
        longitude={21.00618}
        className="w-full h-full"
        readOnly
        zoom={6}
      />
    </div>
  );
}
