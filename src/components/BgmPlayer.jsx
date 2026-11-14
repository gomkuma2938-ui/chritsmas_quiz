// src/components/BgmPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react';

export default function BgmPlayer({ isMuted, setIsMuted, volume, setVolume, isQuizPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  
  const wasPlayingBeforeQuizRef = useRef(false);

  const BASE = import.meta.env.BASE_URL;

  // 🔥 public/audio/ 경로를 직접 문자열 URL로 참조 (빌드 에러 원천 차단)
  const playlist = [
    `${BASE}audio/bgm1.mp3`,
    `${BASE}audio/bgm2.mp3`,
    `${BASE}audio/bgm3.mp3`,
    `${BASE}audio/bgm4.mp3`,
    `${BASE}audio/bgm5.mp3`,
    `${BASE}audio/bgm6.mp3`,
  ];

  useEffect(() => {
    if (!playlist[currentTrackIndex]) return;
    
    const audio = new Audio(playlist[currentTrackIndex]);
    audioRef.current = audio;

    const handleEnded = () => {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const toggleBgm = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      wasPlayingBeforeQuizRef.current = false;
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        wasPlayingBeforeQuizRef.current = true;
      }).catch(err => {
        console.warn("재생 실패", err);
        alert("public/audio/ 폴더에 bgm1.mp3 파일이 있는지 확인해주세요.");
      });
    }
  };

  const handleNextTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (isQuizPlaying) {
      if (isPlaying) {
        wasPlayingBeforeQuizRef.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      if (wasPlayingBeforeQuizRef.current) {
        wasPlayingBeforeQuizRef.current = false;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  }, [isQuizPlaying]);

  return (
    <div className="flex items-center gap-2.5 bg-white/95 border border-[#fdc879] px-4 py-2 rounded-2xl shadow-sm text-gray-800">
      <button 
        onClick={toggleBgm}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          isPlaying ? 'bg-[#076327] text-white animate-pulse' : 'bg-[#cb000b] hover:bg-[#fa4134] text-white'
        }`}
      >
        <Music className="w-4 h-4" />
        {isPlaying ? `BGM (${currentTrackIndex + 1}/6)` : 'BGM 재생 ▶'}
      </button>

      <button 
        onClick={handleNextTrack}
        className="p-1.5 hover:bg-[#feefde] rounded-lg text-[#076327] transition-colors"
        title="다음 BGM으로 넘기기"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="p-1 hover:bg-[#feefde] rounded-lg text-[#cb000b] transition-colors"
      >
        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-[#cb000b]" />}
      </button>

      <input 
        type="range" 
        min="0" 
        max="100" 
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          setVolume(Number(e.target.value));
          if (isMuted) setIsMuted(false);
        }}
        className="w-20 md:w-24 accent-[#cb000b] h-2 bg-red-100 rounded-lg cursor-pointer"
      />
      <span className="text-xs font-bold w-7 text-[#cb000b]">{isMuted ? '0%' : `${volume}%`}</span>
    </div>
  );
}
