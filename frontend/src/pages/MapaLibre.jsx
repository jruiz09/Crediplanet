// src/pages/MapaLibre.jsx
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapaLibre() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-58.4, -34.6],
      zoom: 12,
    });

    new maplibregl.Marker().setLngLat([-58.4, -34.6]).addTo(map);

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />;
}
