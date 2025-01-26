import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ data }) => {
  const mapContainerRef = useRef(null);

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
  const [accidentData, setAccidentData] = useState([
    {
      id: 100,
      lng: -79.3832,
      lat: 43.6532,
      description: "Accident at Main St.",
    },
    {
      id: 200,
      lng: -79.3872,
      lat: 43.6572,
      description: "Collision near Dundas.",
    },
  ]);

  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCameras(data[0]);
    }
  }, [data]);

  useEffect(() => {
    if (cameras.length > 0) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-79.3832, 43.6532],
        zoom: 12,
      });

      // Add markers for accidents
      cameras.forEach((accident) => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          accident.description
        );

        new mapboxgl.Marker({ color: "red" })
          .setLngLat([accident.lng, accident.lat])
          .setPopup(popup)
          .addTo(map);
      });

      return () => map.remove();
    }
  }, [cameras]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
  );
};

export default Map;
