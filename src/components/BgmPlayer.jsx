// src/components/BgmPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react';

export default function BgmPlayer({ isMuted, setIsMuted, volume, setVolume, isQuizPlaying }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  
  const wasPlayingBeforeQuizRef = useRef(false);

  // 🎶 플레이리스트 목록 (public/audio/ 폴더 안에 있는 파일명들을 여기에 계속 추가하시면 됩니다!)
  const playlist = [
    `${import.meta.env.BASE_URL}audio/bgm1.mp3`,
    `${import.meta.env.BASE_URL}audio/bgm2.mp3`,
    `${import.meta.env.BASE_URL}audio/bgm3.mp3`,
    `${import.meta.env.BASE_URL}audio/bgm4.mp3`,
    `${import.meta.env.BASE_URL}audio/bgm5.mp3`,
    `${import.meta.env.BASE_URL}audio/bgm6.mp3`,
  ];

  // 오디오 인스턴스 초기화 및 플레이리스트 자동 다음 곡 넘기기 설정
  useEffect(() => {
    const audio = new Audio(playlist[currentTrackIndex]);
    audioRef.current = audio;

    // 현재 곡이 끝나면 자동으로 다음 트랙으로 넘어가기 (플레이리스트 루프)
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

  // 트랙이 바뀌었는데 BGM이 켜져 있는 상태였다면 바로 재생
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex]);

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
      }).catch(err => console.warn("음원 파일을 찾을 수 없거나 재생이 차단되었습니다.", err));
    }
  };

  // 수동으로 다음 곡으로 넘기는 버튼
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
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          isPlaying ? 'bg-[#076327] text-white animate-pulse' : 'bg-[#cb000b] hover:bg-[#fa4134] text-white'
        }`}
      >
        <Music className="w-4 h-4" />
        {isPlaying ? `BGM 재생중 (${currentTrackIndex + 1}/${playlist.length})` : 'BGM 재생 ▶'}
      </button>

      {/* 수동으로 다음 곡 스킵 버튼 */}
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
