/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import '../style/AudioPlayer.scss'

import { CapacitorMusicControls } from 'capacitor-music-controls-plugin-v3'


const AudioPlayer = ({ src, audRef, nextSong, previousSong, curSong}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    document.addEventListener('controlsNotification', (event) => {
      console.log('controlsNotification was fired');
      console.log(event);
      const info = { message : event.message, position: 0 };
      handleControlsEvent(info);
    });
  }, [])

  const handleLoadedData = () => {
    setDuration(audRef.current.duration);
    CapacitorMusicControls.create({
      track: curSong,
      hasSkipForward: true,
      hasSkipBackward: true,
    })
    .then()
    .catch();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audRef.current.currentTime);
  };

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


  const isPlaying = () => {
    if (audRef.current != null) {
      return !audRef.current.paused;
    }
    return 0;
  }

  return (
    <div className='container_music'>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <audio onLoadedData={handleLoadedData} onTimeUpdate={handleTimeUpdate} src="" ref={audRef} onEnded={() => {nextSong(); setCurrentTime(0)}} style={{display: 'none'}}></audio>

      <div>
        {curSong}
      </div>
      <div className='music_control_display'>
        <button onClick={() => previousSong()} className='music_previous'>
          <span className="material-symbols-outlined">
            skip_previous
          </span>
        </button>
        <button onClick={togglePlay} className='music_pause'>
          {isPlaying() ?
            <span className="material-symbols-outlined">pause</span> :
            <span className="material-symbols-outlined">play_arrow</span>
          }
        </button>
        <button onClick={() => nextSong()} className='music_next'>
          <span className="material-symbols-outlined">
            skip_next
          </span>
        </button>
        <button onClick={toggleMute} className='music_mute'>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      <div className='music_tempo_display'>
        <div className='tempo_container'>
          <div>{formatTime(currentTime)}</div>
          <div>{formatTime(duration)}</div>
        </div>

        <input className='music_duration'
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleTimeSeek}
        />
        <input className='music_volume'
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
