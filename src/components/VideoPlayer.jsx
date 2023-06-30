import React, { useEffect, useRef, useState } from 'react';
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core';

const VideoPlayer = ({ videoUrl, audioUrl }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    if (isPlaying) {
      videoRef.current.pause();
      audioRef.current.pause();
    } else {
      videoRef.current.play();
      audioRef.current.play();
    }
    setPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  return (
    <div>
      <video ref={videoRef} src={videoUrl}></video>
      <audio ref={audioRef} src={audioUrl}></audio>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={handleFullscreen}>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
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
    </div>
  );
};

export default VideoPlayer;

