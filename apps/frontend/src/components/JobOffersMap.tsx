import MapPicker from './MapPicker';

export default function JobOffersMap() {
  return (
    <div className="flex-1/2">
      <MapPicker
        latitude={52.231641}
        longitude={21.00618}
        className="w-full h-dvh"
        readOnly
        zoom={6}
      />
    </div>
  );
}
