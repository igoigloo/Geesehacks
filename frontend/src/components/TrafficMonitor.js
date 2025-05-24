// TrafficMonitor.js THE FRONT PAGE
import React, { useEffect } from "react";
import "./TrafficMonitor.css";

const TrafficMonitor = ({ onGetStarted }) => {
  useEffect(() => {
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  };

  const startDemo = () => {
    document.getElementById("blurOverlay1").classList.remove("blurred");
    document.getElementById("blurOverlay2").classList.remove("blurred");

    const demoBtn = document.getElementById("demoBtn");
    demoBtn.innerHTML =
      '<i class="fas fa-check-circle mr-2"></i> SYSTEM ACTIVE';
    demoBtn.classList.add("bg-opacity-80");

    showNotification(
      "Surveillance system activated. Monitoring traffic patterns."
    );
  };

  //   const getStarted = () => {
  //     showNotification("Establishing secure connection to terminal...");
  //   };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
      <i class="fas fa-shield-alt mr-2"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <div className="container">
      <div className="theme-toggle">
        <span>Light</span>
        <div
          id="themeToggle"
          className="toggle-container"
          onClick={toggleTheme}
        >
          <div className="toggle-circle"></div>
          <i className="fas fa-sun sun-icon"></i>
          <i className="fas fa-moon moon-icon"></i>
        </div>
        <span>Dark</span>
      </div>

      <main className="main">
        <div className="card">
          <div className="header">
            <h1>TRAFFIC MONITOR</h1>
            <p>Real-time surveillance analytics</p>
          </div>

          <div className="videos">
            <div className="video-wrapper">
              <video className="video" autoPlay muted loop>
                <source src="/car-getting-hit.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div id="blurOverlay1" className="blurred">
                <i className="fas fa-database"></i>
                <p>Traffic Analysis</p>
              </div>
            </div>

            <div className="video-wrapper">
              <video className="video" autoPlay muted loop>
                <source src="/database-meme.mp4" type="video/mp4" />
              </video>

              <div id="blurOverlay2" className="blurred">
                <i className="fas fa-car-crash"></i>
                <p>Incident Detection</p>
              </div>
            </div>
          </div>

          <div className="buttons">
            <button id="demoBtn" onClick={startDemo} className="btn-primary">
              <i className="fas fa-play-circle"></i> ACTIVATE SYSTEM
            </button>
            <button onClick={onGetStarted} className="btn-outline">
              ACCESS TERMINAL <i className="fas fa-terminal"></i>
            </button>
          </div>
          <div className="stats">
            <div>
              <div>24/7</div>
              <div>SURVEILLANCE</div>
            </div>
            <div>
              <div>95%</div>
              <div>DETECTION RATE</div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>SECURE MONITORING SYSTEM © 2023</p>
      </footer>
    </div>
  );
};

export default TrafficMonitor;
