import MapComponent from "./components/mapComponent";
import SidebarComponent from "./components/sidebareComponent";
import LandingPage from "./components/LandingPage";
import React, { useState, useEffect } from "react";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [accidentData, setAccidentData] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const handleGetStarted = () => {
    setShowLanding(false);
    console.log("Landing page hidden"); // Debug log
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/cameras", {});
        const data = await response.json();
        setItems(data);
        setLoaded(true);
        console.log("Initial data loaded"); // Debug log
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    if (!showLanding) {
      loadData();
    }
  }, [showLanding]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount((prevCount) => prevCount + 1); // Trigger a refresh
    }, 10 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval); // Clear the interval on unmount
  }, []);

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
      const loadData = async () => {
        // Fetch data from the API
        const response = await fetch(
          "http://127.0.0.1:8000/toronto-cameras",
          {}
        );
        const data = await response.json();
        setItems(data);

        setLoaded(true);
      };

      loadData();
    }
  }, [refreshCount]);

  useEffect(() => {
    if (loaded) {
      var list = [];
      items.forEach((camera) => {
        const newData = {
          id: camera?.Id,
          lng: camera?.Longitude,
          lat: camera?.Latitude,
          description: `${camera?.Location}`,
          Accident: camera?.Accident,
        };
        list.push(newData);
      });

      setCameras((cameras) => [list]);
      //setAccidentData((accidentData) => [...accidentData, newData]);

      //console.log(accidentData);
      //setAccidentData((accidentData) => [...accidentData, newData]);
      //console.log(accidentData);
    }
  }, [items]);

  const createAccident = () => {
    if (accidentData.length == 1) {
      const data = {
        id: 818,
        lat: -79.3371,
        lng: 42.3273,
        description: "Lake Shore Boulevard near Sunnyside Beach",
        accident: true,
      };
      setAccidentData((accidentData) => [...accidentData, data]);
      return;
    }

    if (accidentData.length == 2) {
      const data = {
        id: 839,
        lat: -78.3371,
        lng: 44.3273,
        description: "Don Valley Parkway near Eastern Avenue",
        accident: true,
      };
      setAccidentData((accidentData) => [...accidentData, data]);
      return;
    }

    if (accidentData.length == 3) {
      const data = {
        id: 813,
        lat: -79.3371,
        lng: 45.3473,
        description: "Lake Shore Boulevard near Ontario Drive",
        accident: true,
      };
      setAccidentData((accidentData) => [...accidentData, data]);
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
    <>
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
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
      )}
    </>
  );
}

export default App;