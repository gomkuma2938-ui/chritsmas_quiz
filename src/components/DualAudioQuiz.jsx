// src/components/DualAudioQuiz.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, ChevronLeft, ChevronRight, Eye, HelpCircle, X, Lightbulb, Music2, Disc3 } from 'lucide-react';
import { DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function DualAudioQuiz({ index, setIndex }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

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
    setActiveModal(null);
    setIndex((prev) => (prev + 1) % DUAL_AUDIO_QUIZZES.length);
  };

  const handlePrev = () => {
    stopAudio();
    setActiveModal(null);
    setIndex((prev) => (prev - 1 + DUAL_AUDIO_QUIZZES.length) % DUAL_AUDIO_QUIZZES.length);
  };

  useEffect(() => {
    return () => stopAudio();
  }, [index]);

  return (
    <div className="w-full flex items-center justify-center gap-5 select-none">
      
      {/* 이전 화살표 */}
      <button
        onClick={handlePrev}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#076327] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border border-[#fdc879]"
        title="이전 곡"
      >
        <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 카드 */}
      <div className="w-full max-w-[1500px] h-[640px] bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-[#fdc879] flex flex-col items-center justify-between text-center">
        
        {/* 제목 */}
        <div className="pt-6">
          <h3 className="text-5xl md:text-6xl font-black text-[#076327] mb-2">{current.title}</h3>
        </div>

        {/* 재생 버튼 */}
        <div className="w-full max-w-md my-auto">
          <button
            onClick={isPlaying ? stopAudio : playDualAudio}
            className={`w-full py-8 rounded-3xl font-black text-3xl shadow-lg flex items-center justify-center gap-4 transition-all ${
              isPlaying 
                ? 'bg-[#fa4134] text-white animate-pulse' 
                : 'bg-[#cb000b] hover:bg-[#fa4134] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-8 h-8 fill-current" /> 재생 중지
              </>
            ) : (
              <>
                <Play className="w-8 h-8 fill-current" /> 두 곡 재생 🎶
              </>
            )}
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center gap-4 pb-2">
          <button
            onClick={() => setActiveModal('hint')}
            className="px-8 py-3.5 bg-[#fdab23] hover:bg-[#ffa52c] text-white rounded-2xl text-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <HelpCircle className="w-6 h-6" /> 힌트 보기
          </button>

          <button
            onClick={() => setActiveModal('answer')}
            className="px-10 py-3.5 bg-[#076327] hover:bg-[#239b48] text-white font-black text-2xl rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Eye className="w-7 h-7" /> 정답 공개
          </button>
        </div>
      </div>

      {/* 다음 화살표 */}
      <button
        onClick={handleNext}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#076327] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border border-[#fdc879]"
        title="다음 곡"
      >
        <ChevronRight className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 💡 힌트 모달 */}
      {activeModal === 'hint' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#076327]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#feefde] rounded-2xl border border-[#fdc879] flex items-center justify-center text-[#076327] shadow-sm">
              <Lightbulb className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#076327] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#076327]/30">
              AUDIO HINT
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-2xl p-6 md:p-8 border border-[#fdc879]/50 shadow-inner">
              <p className="text-2xl md:text-3xl font-black text-[#076327] leading-relaxed break-keep">
                {current.hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 
        🎉 찬양 정답 모달: 
        상단 Music2 배지 + 곡 A/B 각각 Disc3 아이콘이 달린 2단 카드 레이아웃
      */}
      {activeModal === 'answer' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-3xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#076327]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#076327] rounded-2xl flex items-center justify-center text-[#fdc879] shadow-md">
              <Music2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#076327] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#076327]/20">
              DUAL HYMN REVEAL
            </span>

            {/* 2곡 분할 카드 */}
            <div className="grid md:grid-cols-2 gap-5 mt-6 text-left">
              <div className="bg-[#fdf4e8] p-6 rounded-2xl border border-[#fdc879] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#076327] uppercase mb-2">
                    <Disc3 className="w-4 h-4 text-[#cb000b]" /> 곡 A
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black text-[#cb000b] break-keep leading-snug">
                    {current.songA.title}
                  </h4>
                </div>
                <p className="text-xs font-bold text-gray-500 mt-4 border-t border-[#fdc879]/40 pt-2">
                  {current.songA.artist}
                </p>
              </div>

              <div className="bg-[#fdf4e8] p-6 rounded-2xl border border-[#fdc879] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#076327] uppercase mb-2">
                    <Disc3 className="w-4 h-4 text-[#076327]" /> 곡 B
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black text-[#076327] break-keep leading-snug">
                    {current.songB.title}
                  </h4>
                </div>
                <p className="text-xs font-bold text-gray-500 mt-4 border-t border-[#fdc879]/40 pt-2">
                  {current.songB.artist}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
