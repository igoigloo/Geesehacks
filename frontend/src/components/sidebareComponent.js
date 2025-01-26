import React from "react";
import "./SidebarComponent.css";

const SidebarComponent = ({ data }) => {
  const reportAccident = async (accidentDescription) => {
    const API_KEY = "VF.DM.679610b36d87d3a9603037f2.RTMd2ySsr8EjM2uw"; // Replace with your API key
    const PROJECT_ID = "6796107770f1b9c43e43aec6"; // Replace with your Voiceflow project ID
    const ENDPOINT = `https://general-runtime.voiceflow.com/state/${PROJECT_ID}/user`;

    const payload = {
      action: {
        type: "text",
        payload: `Report an accident: ${accidentDescription}`,
      },
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Response from Voiceflow:", result);
    } catch (error) {
      console.error("Error contacting Voiceflow:", error);
    }
  };

  const text = async (accident) => {
    const response = await fetch("http://127.0.0.1:8000/make-txt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: accident.lat,
        lng: accident.lng,
        description: accident.description,
      }),
    });

    console.log(response);
  };

  return (
    <div className="sidebar">
      <h2>Accident Logs</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {data.map((accident) => (
          <li key={accident.id} className="log-item">
            <strong>{accident.description} ⚠️</strong>
            <p>
              <strong>Location:</strong> {accident.lat}, {accident.lng}
            </p>
            <button className="report-button" onClick={() => text(accident)}>
              Report
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarComponent;
