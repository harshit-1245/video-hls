import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import './Homepage.css';
import animated from '../../assets/animation.json';

const Homepage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');

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
    return urlObj.searchParams.get('v') || urlObj.pathname.split('/')[1];
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
                <button className="download-button">Download</button>
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
    </>
  );
}

export default Homepage;
