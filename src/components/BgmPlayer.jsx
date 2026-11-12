// src/components/BgmPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BgmPlayer({ isMuted, setIsMuted, volume, setVolume, isQuizPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // 퀴즈 틀기 전에 BGM이 켜져 있었는지 기억하는 플래그
  const wasPlayingBeforeQuizRef = useRef(false);

  const bgmSrc = `${import.meta.env.BASE_URL}audio/bgm.mp3`;

  // 오디오 인스턴스 초기화
  useEffect(() => {
    const audio = new Audio(bgmSrc);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [bgmSrc]);

  // 볼륨 및 음소거 반영
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // BGM 수동 토글 버튼
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
      }).catch(err => console.warn("BGM 파일이 없거나 재생이 차단되었습니다.", err));
    }
  };

  // 🔥 핵심: 찬양 퀴즈 재생 시 BGM 자동 일시정지, 퀴즈 멈추면 이어서 자동 재생!
  useEffect(() => {
    if (!audioRef.current) return;

    if (isQuizPlaying) {
      // 퀴즈 시작됨 -> BGM이 켜져 있었다면 멈추고 기억
      if (isPlaying) {
        wasPlayingBeforeQuizRef.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      // 퀴즈 멈춤 -> 퀴즈 전에 BGM 켜고 있었으면 멈춘 지점부터 다시 재생
      if (wasPlayingBeforeQuizRef.current) {
        wasPlayingBeforeQuizRef.current = false;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  }, [isQuizPlaying]);

  return (
    <div className="flex items-center gap-3 bg-white/95 border border-[#fdc879] px-4 py-2 rounded-2xl shadow-sm text-gray-800">
      <button 
        onClick={toggleBgm}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          isPlaying ? 'bg-[#076327] text-white animate-pulse' : 'bg-[#cb000b] hover:bg-[#fa4134] text-white'
        }`}
      >
        <Music className="w-4 h-4" />
        {isPlaying ? 'BGM 켜짐 🎶' : 'BGM 재생 ▶'}
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
        className="w-20 md:w-28 accent-[#cb000b] h-2 bg-red-100 rounded-lg cursor-pointer"
      />
      <span className="text-xs font-bold w-8 text-[#cb000b]">{isMuted ? '0%' : `${volume}%`}</span>
    </div>
  );
}
