// src/components/ImageNonsenseQuiz.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, X, Image as ImageIcon } from 'lucide-react';
import { NONSENSE_QUIZZES } from '../data/quizData';

export default function ImageNonsenseQuiz() {
  const [index, setIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // 'hint' | 'answer' | null

  const current = NONSENSE_QUIZZES[index];

  const handleNext = () => {
    setActiveModal(null);
    setIndex((prev) => (prev + 1) % NONSENSE_QUIZZES.length);
  };

  const handlePrev = () => {
    setActiveModal(null);
    setIndex((prev) => (prev - 1 + NONSENSE_QUIZZES.length) % NONSENSE_QUIZZES.length);
  };

  return (
    <div className="flex flex-col justify-between items-center w-full max-w-[1680px] mx-auto h-full flex-grow relative pb-2 select-none">
      
      {/* [문제 1 / 8] 배지: 상단 탭 바로 아래 위치 */}
      <div className="absolute -top-12 left-0 z-30">
        <span className="bg-[#cb000b] text-[#fdf4e8] font-black px-6 py-2 rounded-2xl text-xl shadow-lg border-2 border-[#fdc879] inline-block">
          문제 {index + 1} / {NONSENSE_QUIZZES.length}
        </span>
      </div>

      {/* 중앙 메인: [이전 화살표 < ] + [문제 카드] + [다음 화살표 > ] */}
      <div className="w-full flex items-center justify-between gap-4 md:gap-6 my-auto">
        
        {/* 왼쪽 이전 화살표 버튼 */}
        <button
          onClick={handlePrev}
          className="w-16 h-16 md:w-20 md:h-20 bg-white/95 hover:bg-[#feefde] text-[#cb000b] border-4 border-[#fdc879] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-110 active:scale-95 flex-shrink-0"
          title="이전 문제"
        >
          <ChevronLeft className="w-10 h-10 stroke-[3]" />
        </button>

        {/* 문제 카드 (높이 고정: 모달 팝업으로 내용이 떠서 덜컹거림 없음) */}
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-[#fdab23] shadow-2xl flex flex-col items-center justify-between h-[68vh] min-h-[660px] text-center">
          
          {/* 문제 제목 */}
          <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#cb000b] leading-tight drop-shadow-sm pt-2">
            {current.q}
          </h3>

          {/* 문제 그림 영역 */}
          <div className="flex-1 w-full max-w-4xl min-h-[380px] max-h-[460px] border-3 border-[#feefde] rounded-3xl my-3 bg-[#fdf4e8]/60 flex items-center justify-center overflow-hidden shadow-inner p-4">
            {current.image ? (
              <img 
                src={current.image} 
                alt={`문제 ${current.id}`} 
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="hidden flex-col items-center justify-center text-[#fa4134] gap-3">
              <ImageIcon className="w-20 h-20 stroke-1" />
              <span className="text-xl font-bold text-gray-500">지정된 문제 그림이 없습니다.</span>
            </div>
          </div>

          {/* 하단: 힌트 보기 & 정답 보기 버튼 (중앙 정렬) */}
          <div className="flex items-center gap-5 pt-2">
            <button
              onClick={() => setActiveModal('hint')}
              className="px-9 py-4 bg-[#fdab23] hover:bg-[#ffa52c] text-[#cb000b] rounded-2xl text-xl font-black flex items-center gap-2.5 shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-[#fdc879]"
            >
              <HelpCircle className="w-6 h-6 stroke-[2.5]" /> 힌트 보기
            </button>

            <button
              onClick={() => setActiveModal('answer')}
              className="px-11 py-4 bg-[#cb000b] hover:bg-[#fa4134] text-[#fdf4e8] font-black text-2xl rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-[#fdc879]"
            >
              <Eye className="w-7 h-7 stroke-[2.5]" /> 정답 공개
            </button>
          </div>
        </div>

        {/* 오른쪽 다음 화살표 버튼 */}
        <button
          onClick={handleNext}
          className="w-16 h-16 md:w-20 md:h-20 bg-[#076327] hover:bg-[#239b48] text-[#fdf4e8] border-4 border-[#fdc879] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-110 active:scale-95 flex-shrink-0"
          title="다음 문제"
        >
          <ChevronRight className="w-10 h-10 stroke-[3]" />
        </button>
      </div>

      {/* 
        ============================================================
        💡 힌트 모달 팝업 (바깥 누르면 닫힘, 레이아웃 변화 없음)
        ============================================================
      */}
      {activeModal === 'hint' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdf4e8] border-8 border-[#fdab23] rounded-3xl p-10 md:p-14 max-w-3xl w-full text-center shadow-2xl relative cursor-default transform animate-fade-in"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-[#cb000b] hover:bg-[#feefde] p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <span className="text-xl md:text-2xl font-black text-[#076327] bg-[#feefde] border-2 border-[#fdc879] px-6 py-2 rounded-2xl inline-block mb-6 shadow-sm">
              💡 힌트
            </span>
            <div className="text-4xl md:text-5xl font-black text-[#cb000b] my-4 leading-relaxed break-keep">
              {current.hint}
            </div>
          </div>
        </div>
      )}

      {/* 
        ============================================================
        🎉 정답 모달 팝업 (바깥 누르면 닫힘)
        ============================================================
      */}
      {activeModal === 'answer' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-[#cb000b] to-[#fa4134] border-8 border-[#fdc879] rounded-3xl p-10 md:p-16 max-w-3xl w-full text-center shadow-2xl relative cursor-default transform animate-fade-in text-[#fdf4e8]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-black/20 p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <span className="text-lg md:text-xl font-black uppercase tracking-widest text-[#fdc879] block mb-2 opacity-90">
              정 답
            </span>
            <div className="text-6xl md:text-7xl lg:text-8xl font-black drop-shadow-md my-4">
              {current.a}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
