// src/components/DualAudioQuiz.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function DualAudioQuiz({ index, setIndex }) {
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
    <div className="w-full flex items-center justify-center gap-4 md:gap-6 select-none">
      
      {/* 이전 화살표 (<) */}
      <button
        onClick={handlePrev}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#076327] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
        title="이전 곡"
      >
        <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 문제 카드 (h-[680px]로 동일하게 꽉 채움) */}
      <div className="w-full max-w-[1500px] h-[680px] bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-[#fdc879] flex flex-col items-center justify-between text-center">
        <div className="pt-4">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#cb000b] mb-4">{current.title}</h3>
          <p className="text-xl font-bold text-gray-500">💡 힌트: {current.hint}</p>
        </div>

        {/* 재생 버튼 */}
        <div className="w-full max-w-lg my-auto">
          <button
            onClick={isPlaying ? stopAudio : playDualAudio}
            className={`w-full py-8 rounded-3xl font-black text-3xl shadow-lg flex items-center justify-center gap-4 transition-all ${
              isPlaying 
                ? 'bg-[#fa4134] text-white animate-pulse' 
                : 'bg-[#076327] hover:bg-[#239b48] text-white'
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

        {/* 정답 공개 버튼 */}
        <button
          onClick={() => setShowModal(true)}
          className="px-11 py-4 bg-[#cb000b] hover:bg-[#fa4134] text-white font-black text-2xl rounded-2xl shadow-sm transition-all flex items-center gap-2 mb-2"
        >
          <Eye className="w-7 h-7" /> 정답 공개
        </button>
      </div>

      {/* 다음 화살표 (>) */}
      <button
        onClick={handleNext}
        className="w-16 h-16 md:w-20 md:h-20 bg-[#076327] hover:bg-[#239b48] text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
        title="다음 곡"
      >
        <ChevronRight className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 정답 모달 */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#cb000b] rounded-3xl p-12 max-w-3xl w-full text-center shadow-2xl relative cursor-default text-white"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <span className="text-base font-black uppercase tracking-widest text-[#fdc879] block mb-6">
              찬양 2곡 정답
            </span>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="bg-black/20 p-8 rounded-2xl">
                <span className="text-sm text-[#fdc879] font-bold block mb-2">곡 A</span>
                <h4 className="text-3xl md:text-4xl font-black">{current.songA.title}</h4>
                <p className="text-base text-white/80 mt-2">{current.songA.artist}</p>
              </div>
              <div className="bg-black/20 p-8 rounded-2xl">
                <span className="text-sm text-[#fdc879] font-bold block mb-2">곡 B</span>
                <h4 className="text-3xl md:text-4xl font-black">{current.songB.title}</h4>
                <p className="text-base text-white/80 mt-2">{current.songB.artist}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
