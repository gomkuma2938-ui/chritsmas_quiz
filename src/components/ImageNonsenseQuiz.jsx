// src/components/ImageNonsenseQuiz.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, X, Lightbulb, Sparkles } from 'lucide-react';
import { NONSENSE_QUIZZES } from '../data/quizData';

export default function ImageNonsenseQuiz({ index, setIndex }) {
  const [activeModal, setActiveModal] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const current = NONSENSE_QUIZZES[index];

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [index]);

  const handleNext = () => {
    setActiveModal(null);
    setIndex((prev) => (prev + 1) % NONSENSE_QUIZZES.length);
  };

  const handlePrev = () => {
    setActiveModal(null);
    setIndex((prev) => (prev - 1 + NONSENSE_QUIZZES.length) % NONSENSE_QUIZZES.length);
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setActiveModal((prev) => (prev === 'hint' ? null : 'hint'));
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        setActiveModal((prev) => (prev === 'answer' ? null : 'answer'));
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasValidImage = Boolean(current.image && imgLoaded && !imgError);

  return (
    <div className="w-full flex items-center justify-center gap-5 select-none">
      
      {/* 백그라운드 프리로더 */}
      {current.image && !imgError && (
        <img
          key={current.image}
          src={current.image}
          alt=""
          className="hidden"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* 이전 화살표 */}
      <button
        onClick={handlePrev}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#cb000b] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border border-[#fdc879]"
        title="이전 문제 (← 또는 PageUp)"
      >
        <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 문제 카드 본체 */}
      <div className="w-full max-w-[1500px] h-[640px] bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-[#fdc879] flex flex-col justify-between items-center text-center">
        
        {hasValidImage ? (
          /* 1. 그림이 있는 문제 */
          <>
            <div className="w-full flex items-center justify-center px-4 min-h-[70px] max-h-[140px]">
              <h3 
                className="text-3xl md:text-4xl lg:text-[42px] font-black text-[#cb000b] break-keep py-1"
                style={{ lineHeight: 1.3 }}
              >
                {current.q}
              </h3>
            </div>

            <div className="flex-1 w-full max-w-4xl min-h-0 my-3 rounded-2xl bg-[#fdf4e8] flex items-center justify-center overflow-hidden p-4">
              <img 
                src={current.image} 
                alt={`문제 ${current.id}`} 
                className="w-full h-full object-contain"
              />
            </div>
          </>
        ) : (
          /* 
            2. 그림 없는 문제:
            lineHeight를 1.25로 확실하게 좁혀서 1줄과 2줄 사이 간격을 절반 이하로 압축!
          */
          <div className="flex-1 w-full flex items-center justify-center px-8 my-auto">
            <h3 
              className="text-5xl md:text-6xl lg:text-[68px] font-black text-[#cb000b] break-keep max-w-5xl drop-shadow-sm"
              style={{ lineHeight: 1.25 }}
            >
              {current.q}
            </h3>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex items-center gap-4 pt-2 flex-shrink-0">
          <button
            onClick={() => setActiveModal('hint')}
            className="px-8 py-3.5 bg-[#fdab23] hover:bg-[#ffa52c] text-white rounded-2xl text-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            title="힌트 보기 (단축키: H)"
          >
            <HelpCircle className="w-6 h-6" /> 힌트 보기
          </button>

          <button
            onClick={() => setActiveModal('answer')}
            className="px-10 py-3.5 bg-[#cb000b] hover:bg-[#fa4134] text-white font-black text-2xl rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
            title="정답 공개 (단축키: A)"
          >
            <Eye className="w-7 h-7" /> 정답 공개
          </button>
        </div>
      </div>

      {/* 다음 화살표 */}
      <button
        onClick={handleNext}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#cb000b] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border border-[#fdc879]"
        title="다음 문제 (→ 또는 PageDown)"
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
            className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#fdab23]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#feefde] rounded-2xl border border-[#fdc879] flex items-center justify-center text-[#fdab23] shadow-sm">
              <Lightbulb className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#076327] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#fdc879]/60">
              QUESTION HINT
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-2xl p-6 md:p-8 border border-[#fdc879]/50 shadow-inner">
              <p className="text-3xl md:text-4xl font-black text-[#cb000b] leading-relaxed break-keep">
                {current.hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 정답 모달 */}
      {activeModal === 'answer' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#cb000b]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#cb000b] rounded-2xl flex items-center justify-center text-[#fdc879] shadow-md">
              <Sparkles className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#cb000b] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#cb000b]/20">
              CORRECT ANSWER
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-2xl p-6 md:p-8 border border-[#fdc879] shadow-inner">
              <p className="text-5xl md:text-7xl font-black text-[#cb000b] drop-shadow-sm">
                {current.a}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
