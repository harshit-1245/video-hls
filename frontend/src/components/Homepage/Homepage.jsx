import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react'; 
import './Homepage.css';
import animated from '../../assets/animation.json';
import axios from "axios";
import CookieConsent from 'react-cookie-consent';

const Homepage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
    if (consent && consent.split('=')[1] === 'true') {
      setCookieConsent(true);
    }
  }, []);

  const handleLinkChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);

    // Extract video ID from YouTube link
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      setVideoUrl(videoId.substring(0, ampersandPosition));
    } else {
      setVideoUrl(videoId);
    }

    setShowVideo(true);
  };

  const handleConvert = async () => {
    if (!cookieConsent) {
      alert('Please accept cookies to download videos.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/convert", { url: videoUrl });
      console.log(response.data);
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
          <input type="text" placeholder='paste your link' onChange={handleLinkChange} />
          {showVideo && (
            <div className="video-container">
              <iframe 
                width="560" 
                height="315" 
                src={`https://www.youtube.com/embed/${videoUrl}`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
              <div className="download-options">
                <button className='download' onClick={handleConvert}>Download</button>
                <select className='format-select'>
                  <option>MP4 720p</option>
                  <option>MP4 1080p</option>
                  <option>MP4 4K</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <CookieConsent
        location="bottom"
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
