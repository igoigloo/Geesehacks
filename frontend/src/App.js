import MapComponent from "./components/mapComponent";
import SidebarComponent from "./components/sidebareComponent";
import React, { useState, useEffect } from "react";

function App() {
  const [accidentData, setAccidentData] = useState([]);

  const [cameras, setCameras] = useState([]);

  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Fetch data from the API
      const response = await fetch("http://127.0.0.1:8000/cameras", {});
      const data = await response.json();
      setItems(data);
      setLoaded(true);
    };
    loadData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (loaded) {
      var list = [];
      items.forEach((camera) => {
        const newData = {
          id: camera?.Id,
          lng: camera?.Longitude,
          lat: camera?.Latitude,
          description: `${camera?.Location} id: ${camera?.Id}`,
        };
        list.push(newData);
      });

      setCameras((cameras) => [...cameras, list]);
      //setAccidentData((accidentData) => [...accidentData, newData]);

      //console.log(accidentData);
      //setAccidentData((accidentData) => [...accidentData, newData]);
      //console.log(accidentData);
    }
  }, [items]);

  const createAccident = () => {
    if (accidentData.length > 0) {
      setAccidentData((accidentData) => []);
      return;
    }
    const data = {
      id: 832,
      lat: -79.3471,
      lng: 43.3273,
      description: "Lake Shore Boulevard near Lower Simcoe Street",
      accident: true,
    };
    setAccidentData((accidentData) => [...accidentData, data]);
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarComponent data={accidentData} />
      <MapComponent data={cameras} data2={accidentData} />
      <button
        onClick={createAccident}
        style={{
          height: "50px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease, transform 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      >
        Create an Accident
      </button>
    </div>
  );
}

export default App;
