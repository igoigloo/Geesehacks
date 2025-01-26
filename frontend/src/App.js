import MapComponent from "./components/mapComponent";
import SidebarComponent from "./components/sidebareComponent";
import React, { useState, useEffect } from "react";

function App() {
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
          description: camera?.Location,
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
  const click = () => {
    const newData = {
      id: items[1]?.Id,
      lng: -79.3832,
      lat: 43.6562,
      description: `Accident at ${items[1]?.Location}.`,
    };
    setCameras((cameras) => [...cameras, newData]);
  };

  return (
    <div style={{ display: "flex" }}>
      <button onClick={click}>click</button>
      <SidebarComponent data={accidentData} />
      <MapComponent data={cameras} />
    </div>
  );
}

export default App;
