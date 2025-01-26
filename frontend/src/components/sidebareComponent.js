import React from "react";
import "./SidebarComponent.css";

const SidebarComponent = ({ data }) => {
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
            <button className="report-button">Report</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarComponent;
