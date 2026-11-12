// src/components/ImageNonsenseQuiz.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, X, Lightbulb, Sparkles } from 'lucide-react';
import { NONSENSE_QUIZZES } from '../data/quizData';

export default function ImageNonsenseQuiz({ index, setIndex }) {
  const [activeModal, setActiveModal] = useState(null);
  const [imgError, setImgError] = useState(false);

  const current = NONSENSE_QUIZZES[index];

  // 문제 번호가 바뀌면 이미지 에러 상태 리셋
  useEffect(() => {
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

  // 실제 그림이 존재하는지 여부 판단 (경로가 있고 로드 에러가 안 났을 때만 true)
  const hasValidImage = Boolean(current.image && !imgError);

  return (
    <div className="w-full flex items-center justify-center gap-5 select-none">
      
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
        
        {/* 
          ==================================================
          1. 그림이 있는 문제:
             - 2줄 문제여도 제목/그림/버튼 사이 간격 유지
             - flex-1 min-h-0 으로 그림이 자연스럽게 가변 축소
          ==================================================
        */}
        {hasValidImage ? (
          <>
            {/* 문제 텍스트 (2줄이어도 자간/행간 유지) */}
            <div className="w-full flex items-center justify-center px-4 min-h-[70px] max-h-[140px]">
              <h3 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#cb000b] leading-snug break-keep">
                {current.q}
              </h3>
            </div>

            {/* 그림 박스 (고정 높이 대신 남는 공간을 자연스럽게 채움) */}
            <div className="flex-1 w-full max-w-4xl min-h-0 my-3 rounded-2xl bg-[#fdf4e8] flex items-center justify-center overflow-hidden p-4">
              <img 
                src={current.image} 
                alt={`문제 ${current.id}`} 
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
          </>
        ) : (
          /* 
            ==================================================
            2. 그림이 없는 문제:
               - 빈 껍데기 박스를 완전히 숨김
               - 질문 텍스트가 카드 한가운데에 특대형으로 시원하게 노출
            ==================================================
          */
          <div className="flex-1 w-full flex items-center justify-center px-8 my-auto">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#cb000b] leading-tight break-keep max-w-5xl drop-shadow-sm">
              {current.q}
            </h3>
          </div>
        )}

        {/* 하단 버튼 (절대 찌그러지지 않도록 flex-shrink-0) */}
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
