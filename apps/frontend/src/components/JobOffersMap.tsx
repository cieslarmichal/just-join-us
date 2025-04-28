import MapPicker from './MapPicker';

export default function JobOffersMap() {
  return (
    <div className="flex-1/2">
      <MapPicker
        latitude={52.544782}
        longitude={19.26208}
        className="w-full h-dvh"
        readOnly
        zoom={7}
      />
    </div>
  );
}
