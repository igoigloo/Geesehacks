import React, { useState } from "react";
import "./LandingPageComponent.css";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation

const LandingPageComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for input field
  const navigate = useNavigate(); // Hook for navigation

  const startDemo = () => {
    if (!isPlaying) {
      const video1 = document.getElementById("video1");
      const video2 = document.getElementById("video2");
      video1.play();
      video2.play();
      video1.classList.remove("blur");
      video2.classList.remove("blur");
      document.querySelectorAll(".video-overlay").forEach((overlay) => {
        overlay.style.display = "none";
      });
      setIsPlaying(true);
    }
  };

  const handleGetStarted = () => {
    if (inputValue.trim()) {
      navigate(`/${inputValue}`); // Redirect to the page specified in the input field
    } else {
      alert("Please enter a valid page name!"); // Show an alert if the input is empty
    }
  };

  return (
    <section className="video-section">
      <div className="container">
        <h2>See Our System in Action</h2>
        <div className="video-grid">
          <div className="video-card">
            <div className="video-container">
              <video id="video1" className="blur" muted>
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay">
                <p>Real-time Monitoring</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter your thoughts..."
              className="video-input"
            />
          </div>
          <div className="video-card">
            <div className="video-container">
              <video id="video2" className="blur" muted>
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay">
                <p>Data Analysis</p>
              </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={startDemo} disabled={isPlaying}>
            {isPlaying ? "Demo Started" : "Start Demo"}
          </button>
        </div>
        <div className="get-started-container">
          <input
            type="text"
            placeholder="Enter page to navigate..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="get-started-input"
          />
          <button onClick={handleGetStarted} className="get-started-button">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingPageComponent;
