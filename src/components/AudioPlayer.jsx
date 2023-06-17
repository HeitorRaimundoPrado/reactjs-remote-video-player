import React, { useState, useEffect, useCallback } from 'react';

const AudioPlayer = ({ src, audRef, nextSong, previousSong}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const handleLoadedData = () => {
      setDuration(audRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audRef.current.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audRef.current.addEventListener('loadeddata', handleLoadedData);
    audRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audRef.current.addEventListener('ended', handleEnded);

    return () => {
      audRef.current.removeEventListener('loadeddata', handleLoadedData);
      audRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audRef.current.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audRef.current.paused) {
      audRef.current.pause();
    } else {
      audRef.current.play();
    }
  };

  const toggleMute = () => {
    audRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeSeek = (event) => {
    const seekTime = event.target.value;
    audRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (event) => {
    const volumeLevel = parseFloat(event.target.value);
    audRef.current.volume = volumeLevel;
    setVolume(volumeLevel);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  return (
    <div>
      <audio src="" ref={audRef} onEnded={() => nextSong()} style={{display: 'none'}}></audio>
      <button onClick={togglePlay}>
        Pause
      </button>
      <button onClick={() => previousSong()}>Previous Song</button>
      <button onClick={() => nextSong()}>Next Song</button>
      <button onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleTimeSeek}
      />
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={volume}
        onChange={handleVolumeChange}
      />

      <div>{formatTime(currentTime)}</div>
      <div>{formatTime(duration)}</div>
    </div>
  );
};

export default AudioPlayer;
