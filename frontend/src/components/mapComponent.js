import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ data, data2, newClickData }) => {
  const [images, setImages] = useState([]);
  const [accidentData, setAccidentData] = useState([]);
  const [cameras, setCameras] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Store markers by ID for dynamic updates

  // Add this to your CSS file or dynamically inject it into your JavaScript
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
@keyframes radiate {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}
`;
  document.head.appendChild(styleSheet);

  useEffect(() => {
    // Fetch the list of images from the backend
    const fetchImages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/image-list");
        if (response.ok) {
          const imageList = await response.json();
          // Construct the full URLs for the images
          const imageURLs = imageList.map(
            (filename) => `http://127.0.0.1:8000/images/${filename}`
          );
          setImages(imageURLs);
        } else {
          console.error("Failed to fetch image list");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    setAccidentData(data2);
  }, [data2]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCameras(data[0]);
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    console.log(newClickData);
    if (newClickData.click > 2) {
      var zoom = 13;
    } else {
      var zoom = 8;
    }
    zoomToLocation(newClickData.lng, newClickData.lat, zoom);
  }, [newClickData]);

  //updates marker, green == no accident, red == accident
  const changeMarkerColor = (newColor) => {
    accidentData.forEach((accident) => {
      const Id = accident.id;
      const marker = markersRef.current[Id];
      if (marker) {
        const markerElement = marker.getElement();
        markerElement.style.backgroundColor = newColor;
        markerElement.style.width = "28px";
        markerElement.style.height = "28px";

        const radiatingCircle = document.createElement("div");
        Object.assign(radiatingCircle.style, {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: newColor,
          opacity: 0.5,
          animation: "radiate 1.5s infinite",
        });

        // Append the circle to the marker
        markerElement.appendChild(radiatingCircle);
      }
    });
  };

  useEffect(() => {
    changeMarkerColor("red");
  }, [accidentData]);

  useEffect(() => {
    if (cameras.length > 0 && images.length > 0) {
      console.log("load");
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-79.3832, 43.6532],
        zoom: 9,
      });
      mapRef.current = map;

      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      cameras.forEach((camera) => {
        console.log(camera.id, camera.lat, camera.lng);
        var colour = "";
        var width = "22px";
        var height = "22px";
        var radiatingCircle;
        if (camera.Accident == "TRUE") {
          width = "28px";
          height = "28px";
          colour = "red";
          radiatingCircle = document.createElement("div");
          Object.assign(radiatingCircle.style, {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: colour,
            opacity: 0.5,
            animation: "radiate 1.5s infinite",
          });
        } else {
          colour = "green";
        }
        // Create a custom HTML element for the marker
        const markerElement = document.createElement("div");
        Object.assign(markerElement.style, {
          backgroundColor: colour,
          width: width,
          height: height,
          borderRadius: "50%",
          border: "1px solid white",
          cursor: "pointer",
        });
        if (camera.Accident == "TRUE") {
          markerElement.appendChild(radiatingCircle);
        }

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
  <div style="text-align: center;">
    <img 
src="${
          images.find((url) => url.includes(`camera_${camera.id}.jpg`)) ||
          "/path/to/placeholder.jpg"
        }?t=${Date.now()}"
      alt="Camera Image" 
      style="width: 150px; height: auto; border-radius: 8px; margin-bottom: 8px;" 
    />
    <p>${camera.description || "No description available"}</p>
    <p>Street id: ${camera.id}</p>
  </div>
`);

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

  const zoomToLocation = (longitude, latitude, zoom) => {
    console.log("THIS IS AN ISSUE, I FLIPPED THE LONG AND LAT");
    // center: [longitude, latitude], HOW IT WAS PREV

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: zoom, // You can adjust this zoom level
        essential: true,
      });
    }
  };

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </>
  );
};

export default Map;
