import React from 'react';
import Lottie from 'lottie-react'; 
import './Homepage.css';
import animated from '../../assets/animation.json';
import download from "../../assets/downloadButton.png" 

const Homepage = () => {
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
          <input type="text" placeholder='paste your link' />
         <button className='download'>Download</button>
        </div>
      </div>
    </>
  );
}

export default Homepage;
