import React, { useState } from 'react';
import Lottie from 'lottie-react'; 
import './Homepage.css';
import animated from '../../assets/animation.json';
import axios from "axios";

const Homepage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [convertedVideoUrl, setConvertedVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleConvert = async () => {
    try {
      setError('');
      setConvertedVideoUrl('');

      const response = await axios.post("http://localhost:8000/convert", { url: videoUrl });

      if (response.data.videoUrl) {
        setConvertedVideoUrl(response.data.videoUrl);
      } else {
        setError('Failed to convert video.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while converting the video.');
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
            placeholder='Paste your link'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button className='download' onClick={handleConvert}>Convert</button>
        </div>
        {/* {convertedVideoUrl && (
          <div className="result">
            <p>Converted video available at:</p>
            <a href={convertedVideoUrl} target="_blank" rel="noopener noreferrer">{convertedVideoUrl}</a>
          </div>
        )} */}
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Homepage;
