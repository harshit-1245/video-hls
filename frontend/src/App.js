import React, { useRef, useEffect } from "react";
import VideoJS from "./videoPlayer/VideoPlayer";
import videojs from "video.js"; // Import videojs here

import "./App.css";

function App() {
  const playerRef = useRef(null);
  const videoLink =
    "http://localhost:8000/uploads/courses/de6dba71-45b5-4065-a7b6-6d1d7362eb75/index.m3u8";

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL",
      },
    ],
  };

  useEffect(() => {
    // Cleanup function to dispose player when component unmounts
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("Player is waiting");
    });
    player.on("dispose", () => {
      videojs.log("Player will dispose");
    });
  };

  return (
    <>
    <div className="App">
      <div>
        <h1>Video Player</h1>
      </div>

      <VideoJS options={videoPlayerOptions} onReady={handlePlayerReady} />
      </div>
    </>
  );
}

export default App;
