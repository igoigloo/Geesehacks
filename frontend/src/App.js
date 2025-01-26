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
    const data = {
      id: 832,
      lat: -79,
      lng: -79,
      description: "Brampton Highway 401",
      accident: true,
    };
    setAccidentData((accidentData) => [...accidentData, data]);
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarComponent data={accidentData} />
      <MapComponent data={cameras} data2={accidentData} />
      <button onClick={createAccident}>Create an accident</button>
    </div>
  );
}

export default App;
