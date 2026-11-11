import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, ChevronRight } from 'lucide-react';
import { DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function DualAudioQuiz() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const audioCtxRef = useRef(null);
  const timerARef = useRef(null);
  const timerBRef = useRef(null);

  const current = DUAL_AUDIO_QUIZZES[index];

  const stopAudio = () => {
    if (timerARef.current) clearInterval(timerARef.current);
    if (timerBRef.current) clearInterval(timerBRef.current);
    setIsPlaying(false);
  };

  const playDualAudio = () => {
    stopAudio();
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    setIsPlaying(true);

    let stepA = 0;
    timerARef.current = setInterval(() => {
      const note = current.songA.notes[stepA % current.songA.notes.length];
      playSingleNote(ctx, note.f, note.d, 'triangle', 0.14);
      stepA++;
    }, 450);

    let stepB = 0;
    timerBRef.current = setInterval(() => {
      const note = current.songB.notes[stepB % current.songB.notes.length];
      playSingleNote(ctx, note.f, note.d, 'sine', 0.2);
      stepB++;
    }, 400);
  };

  const playSingleNote = (ctx, freq, duration, type, volume) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  };

  const handleNext = () => {
    stopAudio();
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % DUAL_AUDIO_QUIZZES.length);
  };

  useEffect(() => {
    return () => stopAudio();
  }, [index]);

  return (
    <div className="flex flex-col h-full justify-between items-center space-y-4 max-w-5xl mx-auto w-full">
      <div className="w-full flex justify-between items-center bg-white/90 backdrop-blur p-4 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <span className="bg-emerald-600 text-white font-black px-4 py-1.5 rounded-xl text-base shadow-sm">
          음악 퀴즈 {index + 1} / {DUAL_AUDIO_QUIZZES.length}
        </span>
        <span className="text-emerald-800 font-bold text-lg">🎄 두 곡 동시 재생 찬양 퀴즈</span>
      </div>

      <div className="w-full bg-white/95 backdrop-blur rounded-3xl p-8 md:p-12 border-4 border-emerald-400 shadow-xl text-center space-y-8 flex flex-col justify-center min-h-[440px]">
        <div>
          <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">DUAL HYMN QUIZ</span>
          <h3 className="text-3xl md:text-5xl font-black text-red-700 mt-2">{current.title}</h3>
          <p className="text-sm font-bold text-gray-500 mt-2">💡 힌트: {current.hint}</p>
        </div>

        <div className="max-w-md mx-auto w-full">
          <button
            onClick={isPlaying ? stopAudio : playDualAudio}
            className={`w-full py-6 rounded-2xl font-black text-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${
              isPlaying 
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-yellow-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-8 h-8 fill-current" /> 재생 중지하기
              </>
            ) : (
              <>
                <Play className="w-8 h-8 fill-current" /> 두 곡 동시에 재생 🎶
              </>
            )}
          </button>
        </div>

        {showAnswer ? (
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl shadow-lg grid md:grid-cols-2 gap-4">
            <div className="border-r border-white/20 pr-4">
              <span className="text-xs font-black uppercase text-yellow-300">곡 A 정답</span>
              <h4 className="text-2xl font-black mt-1">{current.songA.title}</h4>
              <p className="text-xs font-bold text-white/80 mt-1">{current.songA.artist}</p>
            </div>
            <div className="pl-4">
              <span className="text-xs font-black uppercase text-yellow-300">곡 B 정답</span>
              <h4 className="text-2xl font-black mt-1">{current.songB.title}</h4>
              <p className="text-xs font-bold text-white/80 mt-1">{current.songB.artist}</p>
            </div>
          </div>
        ) : (
          <div className="h-14 flex items-center justify-center text-gray-400 text-sm font-medium">
            하단 [정답 공개] 버튼을 누르면 두 찬양의 정답이 표시됩니다.
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-red-950 font-black text-xl rounded-2xl shadow-lg transition-all"
        >
          {showAnswer ? '정답 숨기기' : '정답 공개'}
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center gap-2 shadow-md"
        >
          다음 곡 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
