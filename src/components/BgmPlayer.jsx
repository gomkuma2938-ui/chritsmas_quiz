// src/components/BgmPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BgmPlayer({ isMuted, setIsMuted, volume, setVolume }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const bgmTimerRef = useRef(null);

  const toggleBgm = () => {
    if (isPlaying) {
      if (bgmTimerRef.current) clearInterval(bgmTimerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playChristmasBgm();
    }
  };

  const playChristmasBgm = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    const bellNotes = [
      [523.25, 659.25, 783.99], 
      [392.00, 493.88, 587.33], 
      [440.00, 523.25, 659.25], 
      [349.23, 440.00, 523.25]
    ];
    let step = 0;

    bgmTimerRef.current = setInterval(() => {
      if (isMuted) return;
      const now = ctx.currentTime;
      const currentChord = bellNotes[Math.floor(step / 4) % 4];
      const noteFreq = currentChord[step % 3];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      const volLevel = (volume / 100) * 0.1;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volLevel, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);

      step++;
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (bgmTimerRef.current) clearInterval(bgmTimerRef.current);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white/95 border-2 border-red-300 px-4 py-2 rounded-2xl shadow-md text-gray-800">
      <button 
        onClick={toggleBgm}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
          isPlaying ? 'bg-emerald-600 text-white animate-pulse' : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        <Music className="w-4 h-4" />
        {isPlaying ? 'BGM 재생 중 🎶' : 'BGM 재생 ▶'}
      </button>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
      >
        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-red-600" />}
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
        className="w-20 md:w-28 accent-red-600 h-2 bg-red-100 rounded-lg cursor-pointer"
      />
      <span className="text-xs font-black w-8 text-red-700">{isMuted ? '0%' : `${volume}%`}</span>
    </div>
  );
}