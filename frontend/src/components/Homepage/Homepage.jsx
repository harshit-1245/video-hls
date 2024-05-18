import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import './Homepage.css';
import animated from '../../assets/animation.json';
import CookieConsent from "react-cookie-consent";

const Homepage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
    if (consent && consent.split('=')[1] === 'true') {
      setCookieConsent(true);
    }
  }, []);

  useEffect(() => {
    if (videoUrl) {
      const id = getVideoId(videoUrl);
      if (id) {
        setVideoId(id);
      }
    }
  }, [videoUrl]);

  const getVideoId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
  };

  const handleConvert = async () => {
    if (!cookieConsent) {
      alert('Please accept cookies to download videos.');
      return;
    }

    try {
      // Here you can handle the video download logic
      console.log("Video URL:", videoUrl);
      console.log("Converted Video ID:", videoId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="content">
          <div className="text-content">
            <h1>Welcome to Youtofy</h1>
            <p>Download YouTube videos into 4k,1080p,720p,480p,360p,240p,144p</p>
          </div>
          <Lottie animationData={animated} loop={true} className="animation" />
        </div>
        <div className="download-section">
          <input
            type="text"
            placeholder="paste your link"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        {videoId && (
          <div className="video-details">
            <iframe
              width="120"
              height="90"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allowFullScreen
              className="thumbnail"
            ></iframe>
            <div className="video-info">
              <h2 className="title">Video Title</h2>
              <p className="duration">Video Duration</p>
              <div className="download-options">
                <button className="download-button" onClick={handleConvert}>Download</button>
                <select className="format-select">
                  <option value="mp4_720">MP4 720</option>
                  <option value="mp4_1080">MP4 1080</option>
                  <option value="mp4_1440">MP4 1440</option>
                  <option value="mp4_2160">MP4 4K</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <CookieConsent
      debug={true}
        // location="bottom"
        buttonText="Accept"
        cookieName="cookieConsent"
        style={{ background: "#2B373B", color: "white" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        onAccept={() => setCookieConsent(true)}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </>
  );
}

export default Homepage;
