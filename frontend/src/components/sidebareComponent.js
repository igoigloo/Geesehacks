import React from "react";

const SidebarComponent = ({ data }) => {
  return (
    <div
      style={{
        width: "300px",
        height: "100vh",
        overflowY: "scroll",
        backgroundColor: "#f4f4f4",
        padding: "10px",
      }}
    >
      <h2>Accident Logs</h2>
      <ul>
        {data.map((accident) => (
          <li key={accident.id}>
            <strong>{accident.description}</strong>
            <p>
              Location: {accident.lat}, {accident.lng}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarComponent;
