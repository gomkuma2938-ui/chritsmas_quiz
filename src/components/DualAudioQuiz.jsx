// src/components/DualAudioQuiz.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function DualAudioQuiz() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(false);
    setIndex((prev) => (prev + 1) % DUAL_AUDIO_QUIZZES.length);
  };

  const handlePrev = () => {
    stopAudio();
    setShowModal(false);
    setIndex((prev) => (prev - 1 + DUAL_AUDIO_QUIZZES.length) % DUAL_AUDIO_QUIZZES.length);
  };

  useEffect(() => {
    return () => stopAudio();
  }, [index]);

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[1700px] mx-auto relative select-none">
      
      {/* 뱃지 */}
      <div className="w-full max-w-[1450px] flex justify-start mb-2 px-2">
        <span className="bg-[#076327] text-white font-black px-5 py-1.5 rounded-xl text-lg shadow-sm">
          음악 퀴즈 {index + 1} / {DUAL_AUDIO_QUIZZES.length}
        </span>
      </div>

      <div className="w-full flex items-center justify-center gap-6 md:gap-8">
        {/* 이전 (<) */}
        <button
          onClick={handlePrev}
          className="w-20 h-20 md:w-24 md:h-24 bg-white hover:bg-[#feefde] text-[#076327] rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
        >
          <ChevronLeft className="w-12 h-12 stroke-[3]" />
        </button>

        {/* 메인 카드 */}
        <div className="w-full max-w-[1450px] bg-white/95 backdrop-blur-md rounded-3xl p-10 md:p-14 shadow-xl border border-[#fdc879] flex flex-col items-center justify-between min-h-[520px] text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-[#cb000b] mb-3">{current.title}</h3>
            <p className="text-lg font-bold text-gray-500">💡 힌트: {current.hint}</p>
          </div>

          {/* 재생/정지 버튼 (플랫 솔리드) */}
          <div className="w-full max-w-md my-8">
            <button
              onClick={isPlaying ? stopAudio : playDualAudio}
              className={`w-full py-6 rounded-2xl font-black text-2xl shadow-md flex items-center justify-center gap-3 transition-all ${
                isPlaying 
                  ? 'bg-[#fa4134] text-white animate-pulse' 
                  : 'bg-[#076327] hover:bg-[#239b48] text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-7 h-7 fill-current" /> 재생 중지하기
                </>
              ) : (
                <>
                  <Play className="w-7 h-7 fill-current" /> 두 곡 동시에 재생 🎶
                </>
              )}
            </button>
          </div>

          {/* 정답 공개 버튼 */}
          <button
            onClick={() => setShowModal(true)}
            className="px-10 py-3.5 bg-[#cb000b] hover:bg-[#fa4134] text-white font-black text-xl rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <Eye className="w-6 h-6" /> 정답 공개
          </button>
        </div>

        {/* 다음 (>) */}
        <button
          onClick={handleNext}
          className="w-20 h-20 md:w-24 md:h-24 bg-[#076327] hover:bg-[#239b48] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
        >
          <ChevronRight className="w-12 h-12 stroke-[3]" />
        </button>
      </div>

      {/* 정답 모달 */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#cb000b] rounded-3xl p-10 md:p-14 max-w-3xl w-full text-center shadow-2xl relative cursor-default text-white"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>
            <span className="text-sm font-black uppercase tracking-widest text-[#fdc879] block mb-6">
              찬양 2곡 정답
            </span>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="bg-black/20 p-6 rounded-2xl">
                <span className="text-xs text-[#fdc879] font-bold block mb-1">곡 A</span>
                <h4 className="text-3xl font-black">{current.songA.title}</h4>
                <p className="text-sm text-white/80 mt-1">{current.songA.artist}</p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl">
                <span className="text-xs text-[#fdc879] font-bold block mb-1">곡 B</span>
                <h4 className="text-3xl font-black">{current.songB.title}</h4>
                <p className="text-sm text-white/80 mt-1">{current.songB.artist}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
