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
      
      {/* 프리로더 */}
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
          /* 1. 그림이 있는 문제 (글자 크기 1.5배 확대: text-5xl ~ 60px) */
          <>
            <div className="w-full flex items-center justify-center px-4 min-h-[80px] max-h-[160px]">
              <h3 
                className="text-4xl md:text-5xl lg:text-[58px] font-black text-[#cb000b] break-keep py-1"
                style={{ lineHeight: 1.3 }}
              >
                {current.q}
              </h3>
            </div>

            <div className="flex-1 w-full max-w-4xl min-h-0 my-2 rounded-2xl bg-[#fdf4e8] flex items-center justify-center overflow-hidden p-4">
              <img 
                src={current.image} 
                alt={`문제 ${current.id}`} 
                className="w-full h-full object-contain"
              />
            </div>
          </>
        ) : (
          /* 2. 그림 없는 문제 (글자 크기 1.5배 확대: text-7xl ~ 96px 초대형) */
          <div className="flex-1 w-full flex items-center justify-center px-8 my-auto">
            <h3 
              className="text-6xl md:text-7xl lg:text-[96px] font-black text-[#cb000b] break-keep max-w-5xl drop-shadow-sm"
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

      {/* 💡 힌트 모달 (글자 1.6배 확대 & 모달 폭 max-w-4xl 확장) */}
      {activeModal === 'hint' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-10 md:p-14 max-w-4xl w-full text-center shadow-2xl relative cursor-default border-3 border-[#fdab23]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-18 h-18 mx-auto mb-4 bg-[#feefde] rounded-2xl border border-[#fdc879] flex items-center justify-center text-[#fdab23] shadow-sm">
              <Lightbulb className="w-10 h-10 stroke-[2.2]" />
            </div>

            <span className="text-sm font-black tracking-widest text-[#076327] uppercase bg-[#feefde] px-5 py-1.5 rounded-full border border-[#fdc879]/60">
              QUESTION HINT
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-2xl p-8 md:p-10 border border-[#fdc879]/50 shadow-inner">
              <p className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#cb000b] leading-snug break-keep">
                {current.hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 정답 모달 (글자 1.6배 확대 & text-[110px] 슈퍼 특대형) */}
      {activeModal === 'answer' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-10 md:p-14 max-w-4xl w-full text-center shadow-2xl relative cursor-default border-3 border-[#cb000b]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-18 h-18 mx-auto mb-4 bg-[#cb000b] rounded-2xl flex items-center justify-center text-[#fdc879] shadow-md">
              <Sparkles className="w-10 h-10 stroke-[2.2]" />
            </div>

            <span className="text-sm font-black tracking-widest text-[#cb000b] uppercase bg-[#feefde] px-5 py-1.5 rounded-full border border-[#cb000b]/20">
              CORRECT ANSWER
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-3xl p-8 md:p-12 border-2 border-[#fdc879] shadow-inner">
              <p className="text-6xl md:text-8xl lg:text-[110px] font-black text-[#cb000b] drop-shadow-sm leading-tight break-keep">
                {current.a}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
