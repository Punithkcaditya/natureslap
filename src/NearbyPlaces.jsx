import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const homestay = {
  name: 'Nature’s Lap Homestay',
  point: [12.3141, 75.63414],
  address: 'Nelaji, Madikeri, Coorg, Karnataka 571214',
};

const places = [
  homestay,
  { name: 'Padi Igguthappa Temple', point: [12.28988, 75.62756], distance: 10 },
  { name: 'Nalknad Palace', point: [12.23493, 75.64093], distance: 12 },
  { name: 'Kabbe Hills', point: [12.1941, 75.66808], distance: 14 },
  { name: 'Chelavara Falls', point: [12.20609, 75.67358], distance: 16 },
  { name: 'Tadiandamol Trek', point: [12.21745, 75.60893], distance: 18, destination: 'Tadiandamol Trek starting point, Yavakapadi, Karnataka' },
  { name: 'Raja’s Seat', point: [12.41387, 75.737], distance: 30 },
  { name: 'Abbey Falls', point: [12.459205, 75.719668], distance: 32 },
  { name: 'Mandalpatti Viewpoint', point: [12.5461, 75.7019], distance: 46, destination: 'Mandalpatti last jeep point, Karnataka' },
];

export function directionsTo(place) {
  const query = new URLSearchParams({
    api: '1',
    destination: place.destination ?? place.point.join(','),
  });
  if (place !== homestay) query.set('origin', homestay.point.join(','));
  return `https://www.google.com/maps/dir/?${query}`;
}

export default function NearbyPlaces() {
  const mapElement = useRef(null);
  const markers = useRef([]);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const place = places[selected];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(mapElement.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const map = L.map(mapElement.current, { scrollWheelZoom: false });
    map.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 19,
    }).addTo(map);

    markers.current = places.map((item, index) => {
      const icon = L.divIcon({
        className: `nearby-pin${index === 0 ? ' nearby-pin-home' : ''}`,
        html: `<span aria-hidden="true">${index === 0 ? '⌂' : index}</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 30],
        popupAnchor: [0, -30],
      });
      return L.marker(item.point, { icon, title: item.name })
        .addTo(map)
        .bindPopup(item.name)
        .on('click', () => setSelected(index));
    });
    map.fitBounds(places.map(item => item.point), { padding: [35, 44], maxZoom: 12 });
    return () => {
      map.remove();
      markers.current = [];
    };
  }, [visible]);

  useEffect(() => {
    markers.current[selected]?.openPopup();
  }, [selected, visible]);

  return (
    <section className="nearby-section" id="nearby" aria-labelledby="nearby-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="nearby-title">Nearby Places</h2>
          <p className="eyebrow">Explore Coorg from Nelaji</p>
        </div>
        <div className="nearby-layout">
          <div className="nearby-map" ref={mapElement} role="region" aria-label="Interactive map of the homestay and nearby attractions" />
          <div className="nearby-panel">
            <div className="nearby-selection">
              <h3>{place.name}</h3>
              <p>{place.address ?? `About ${place.distance} km from the homestay`}</p>
              <a className="text-link" href={directionsTo(place)} target="_blank" rel="noreferrer">
                Get directions <ArrowUpRight size={16} />
              </a>
            </div>
            <ul className="nearby-list" aria-label="Select a place on the map">
              {places.map((item, index) => (
                <li key={item.name}>
                  <button type="button" aria-pressed={selected === index} onClick={() => {
                    setSelected(index);
                    markers.current[index]?.openPopup();
                  }}>
                    <span className="nearby-list-number">{index === 0 ? <MapPin size={14} /> : index}</span>
                    <span>{item.name}</span>
                    {item.distance && <small>{item.distance} km</small>}
                  </button>
                </li>
              ))}
            </ul>
            <p className="nearby-note">Distances are approximate. Ask your host about the coffee plantation walk, listed about 5 km away.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
