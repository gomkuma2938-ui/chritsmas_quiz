// src/components/BgmPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react';

// 🔥 src/assets/audio/ 폴더 안에 있는 bgm1.mp3 ~ bgm6.mp3 직접 import
import bgm1 from '../assets/audio/bgm1.mp3';
import bgm2 from '../assets/audio/bgm2.mp3';
import bgm3 from '../assets/audio/bgm3.mp3';
import bgm4 from '../assets/audio/bgm4.mp3';
import bgm5 from '../assets/audio/bgm5.mp3';
import bgm6 from '../assets/audio/bgm6.mp3';

export default function BgmPlayer({ isMuted, setIsMuted, volume, setVolume, isQuizPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  
  const wasPlayingBeforeQuizRef = useRef(false);

  // 6곡 플레이리스트 배열
  const playlist = [bgm1, bgm2, bgm3, bgm4, bgm5, bgm6];

  useEffect(() => {
    if (!playlist[currentTrackIndex]) return;
    
    const audio = new Audio(playlist[currentTrackIndex]);
    audioRef.current = audio;

    // 한 곡이 끝나면 자동으로 다음 곡 번호로 순환 (bgm1 -> bgm2 -> ... -> bgm6 -> bgm1)
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

  // 트랙이 바뀌었는데 재생 중 상태였다면 이어서 다음 곡 재생
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex]);

  // 볼륨 및 음소거 실시간 반영
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
      }).catch(err => {
        console.warn("음원 파일을 불러오지 못했거나 브라우저가 차단했습니다.", err);
        alert("bgm1.mp3 ~ bgm6.mp3 파일이 src/assets/audio/ 폴더에 정확히 들어있는지 확인해주세요.");
      });
    }
  };

  // 수동으로 다음 곡으로 스킵하는 버튼
  const handleNextTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  // 퀴즈 재생 시 BGM 자동 일시정지 / 복구 연동
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

      {/* 수동으로 다음 BGM 넘기기 버튼 */}
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
