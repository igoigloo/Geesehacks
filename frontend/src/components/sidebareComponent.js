import React, { useState } from "react";
import "./SidebarComponent.css";

const SidebarComponent = ({ data, onDataClickChange }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [clicks, setClicks] = useState(0);

  const reportAccident = async (accidentDescription) => {
    const API_KEY = process.env.API_KEY;
    const ENDPOINT = process.env.ENDPOINT;

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
    setLoadingId(accident.id);
    try {
      const response = await fetch("http://127.0.0.1:8000/make-txt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: accident.lat,
          lng: accident.lng,
          description: accident.description,
        }),
      });

      if (!response.ok) throw new Error("Failed to send report");
      console.log("Report sent:", response);
    } catch (error) {
      console.error("Error sending report:", error);
    } finally {
      setLoadingId(null);
    }
  };
  const click = (accident) => {
    setClicks((clicks) => clicks + 1);
    accident.click = clicks;
    onDataClickChange(accident);
  };
  return (
    <aside className="sidebar">
      <h2>Accident Logs</h2>
      {data.length === 0 ? (
        <p className="no-logs">No accidents detected 🚦</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }} className="log-list">
          {data.map((accident) => (
            <li
              key={accident.id}
              className="log-item"
              onClick={() => click(accident)}
            >
              <div className="log-header">
                <strong>{accident.description} ⚠️</strong>
              </div>
              <p>
                <span className="label">Location:</span> {accident.lat},{" "}
                {accident.lng}
              </p>
              <button
                className="report-button"
                onClick={() => text(accident)}
                disabled={loadingId === accident.id}
              >
                {loadingId === accident.id ? "Reporting..." : "Report"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default SidebarComponent;
