import React, { useEffect, useRef, useState } from 'react';
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core';
import '../style/VideoPlayer.scss'

const ResolutionSelector = ({allResRef, allVideo, setVideoUrl, videoRef, audioRef}) => {
  const handleSelectResolution = (res) => {
    setVideoUrl(res.url);
    audioRef.current.pause();
    videoRef.current.addEventListener('loadeddata', () => {
      audioRef.current.play();
      videoRef.current.play();
    }, { once: true})

  }

  return <div ref={allResRef} style={{display: "none"}}>
    {console.log("inside resolution selector")}
    {allVideo.map((res) => {
      return <button key={res.url} onClick={() => handleSelectResolution(res)}>{res.resolution}</button>
    })}
  </div>
}

const VideoPlayer = ({ allVideo, audioUrl }) => {

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(allVideo[0].url);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const allResRef = useRef();
  const videoContainerRef = useRef();


  useEffect(() => {
    if (Capacitor.getPlatform() == "android") {
      const handleAppStateChange = (state) => {
        if (videoRef.current !== null && videoRef.current !== undefined && audioRef.current !== null && audioRef.current != undefined) {
          if (state.isActive) {
            videoRef.current.play()
            audioRef.current.play();
          }

          else {
            videoRef.current.pause();
            audioRef.current.play()
          }
        }
        console.log('state.isActive = ' + String(state.isActive))
      }

      App.addListener('appStateChange', handleAppStateChange);
    }
  }, []);

  useEffect(() => {
    if (videoRef.current !== null) {
      videoRef.current.volume = 0;
    }
  }, [videoRef.current]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadedData = () => {
      videoRef.current.currentTime = audioRef.current.currentTime;
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoElement.duration);
    };


    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handlePlayPause = () => {
    if (isPlaying()) {
      videoRef.current.pause();
      audioRef.current.pause();
    } else {
      videoRef.current.play();
      audioRef.current.play();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const isPlaying = () => {
    if (audioRef.current !== null && audioRef.current !== undefined) {
      return !audioRef.current.paused;
    }
    return 0;
  }


  const isFullscreen = () => {
    return document.fullscreenElement;
  }

  return (
    <div className="video-player-container" ref={videoContainerRef}>
      <video ref={videoRef} src={videoUrl}></video>
      <div className="video-controls">
        <audio ref={audioRef} src={audioUrl}></audio>
        <button onClick={handlePlayPause}>{isPlaying() ? 'Pause' : 'Play'}</button>
        <button onClick={handleFullscreen}>{isFullscreen() ? 'Exit Fullscreen' : 'Fullscreen'}</button>
        <button type="button" onClick={() => allResRef.current.style.display = 'flex'}>Resolutions</button>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
        />

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <ResolutionSelector 
          allVideo={allVideo} 
          allResRef={allResRef}
          setVideoUrl={setVideoUrl}
          audioRef={audioRef}
          videoRef={videoRef}
          setCurrentTime={setCurrentTime}
          />
      </div>
    </div>
  );
};

export default VideoPlayer;

