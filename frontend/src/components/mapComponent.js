import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ data, data2 }) => {
  const mapContainerRef = useRef(null);
  const markersRef = useRef({}); // Store markers by ID for dynamic updates

  // Sample accident data
  // const accidentData = [
  //   { id: 1, lng: -79.3832, lat: 43.6532, description: "Accident at Main St." },
  //   {
  //     id: 2,
  //     lng: -79.3872,
  //     lat: 43.6572,
  //     description: "Collision near Dundas.",
  //   },
  // ];
  const [accidentData, setAccidentData] = useState([]);

  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    setAccidentData(data2);
  }, [data2]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCameras(data[0]);
    }
  }, [data]);

  const changeMarkerColor = (newColor) => {
    accidentData.forEach((accident) => {
      const Id = accident.id;
      const marker = markersRef.current[Id];
      if (marker) {
        const markerElement = marker.getElement();
        markerElement.style.backgroundColor = newColor;
        markerElement.style.width = "28px";
        markerElement.style.height = "28px";
      }
    });
  };

  useEffect(() => {
    changeMarkerColor("red");
  }, [accidentData]);

  useEffect(() => {
    if (cameras.length > 0) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-79.3832, 43.6532],
        zoom: 12,
      });

      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      cameras.forEach((camera) => {
        // Create a custom HTML element for the marker
        const markerElement = document.createElement("div");
        Object.assign(markerElement.style, {
          backgroundColor: "green",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: "1px solid white",
          cursor: "pointer",
        });

        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          camera.description
        );

        // Create and add the marker to the map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([camera.lng, camera.lat])
          .setPopup(popup)
          .addTo(map);

        // Store the marker reference
        markersRef.current[camera.id] = marker;
      });

      return () => {
        Object.values(markersRef.current).forEach((marker) => marker.remove());
      };
    }
  }, [cameras]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default Map;
