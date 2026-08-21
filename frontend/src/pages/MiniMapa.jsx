// src/components/MiniMapa.jsx
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MiniMapa({ lat, lon }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [parseFloat(lon), parseFloat(lat)],
      zoom: 14,
    });

    new maplibregl.Marker().setLngLat([parseFloat(lon), parseFloat(lat)]).addTo(map);

    return () => map.remove();
  }, [lat, lon]);

  return (
    <div
      ref={mapContainer}
      style={{ height: '200px', width: '100%', marginTop: '0.5rem' }}
    />
  );
}
