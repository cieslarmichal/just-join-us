import MapPicker from './MapPicker';

export default function JobOffersMap() {
  return (
    <div className="flex-1/2">
      <MapPicker
        latitude={52.544782}
        longitude={18.970385}
        className="w-full h-dvh"
        readOnly
        zoom={7}
      />
    </div>
  );
}
