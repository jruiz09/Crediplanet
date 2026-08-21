// src/components/MiniMapaModal.jsx
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  height: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 1,
};

export default function MiniMapaModal({ open, handleClose, lat, lon }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!open) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [lon, lat],
      zoom: 14,
    });

    new maplibregl.Marker().setLngLat([lon, lat]).addTo(map);

    return () => map.remove();
  }, [open, lat, lon]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
      </Box>
    </Modal>
  );
}
