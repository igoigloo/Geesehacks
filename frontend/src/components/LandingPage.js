import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const [showVideos, setShowVideos] = useState(false);

  return (
    <div className="landing-container">
      <h1 className="title">Traffic Monitor</h1>
      <p className="subtitle">Monitor real-time traffic and accident data</p>
      
      <div className="videos-container">
        <div className={`video-wrapper ${!showVideos ? 'blurred' : ''}`}>
        <video className="video" autoPlay muted loop>
            <source src="/database-meme.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={`video-wrapper ${!showVideos ? 'blurred' : ''}`}>
        <video className="video" autoPlay muted loop>
            <source src="/car-getting-hit.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="buttons-container">
        <button 
          onClick={() => setShowVideos(true)}
          className="button demo-button"
        >
          Start Demo
        </button>
        <button 
          onClick={onGetStarted}
          className="button start-button"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;