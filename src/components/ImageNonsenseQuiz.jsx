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
    <div className="flex flex-col justify-center items-center w-full max-w-[1700px] mx-auto relative select-none">
      
      {/* [문제 1 / 8] 배지: 카드 좌측 상단 위에 단정하게 안착 */}
      <div className="w-full max-w-[1450px] flex justify-start mb-2 px-2">
        <span className="bg-[#cb000b] text-white font-black px-5 py-1.5 rounded-xl text-lg shadow-sm">
          문제 {index + 1} / {NONSENSE_QUIZZES.length}
        </span>
      </div>

      {/* 메인 영역: [대형 이전 버튼] + [넓은 카드] + [대형 다음 버튼] */}
      <div className="w-full flex items-center justify-center gap-6 md:gap-8">
        
        {/* 특대형 이전 버튼 (<) - 그라데이션/보더 없이 깔끔한 솔리드 */}
        <button
          onClick={handlePrev}
          className="w-20 h-20 md:w-24 md:h-24 bg-white hover:bg-[#feefde] text-[#cb000b] rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
          title="이전 문제"
        >
          <ChevronLeft className="w-12 h-12 stroke-[3]" />
        </button>

        {/* 
          가로폭 대폭 확장(max-w-[1450px]), 
          내부 패딩 대폭 추가(p-10 md:p-12),
          단정하고 모던한 카드 디자인
        */}
        <div className="w-full max-w-[1450px] bg-white/95 backdrop-blur-md rounded-3xl p-10 md:p-12 shadow-xl border border-[#fdc879] flex flex-col items-center justify-between min-h-[580px] max-h-[640px] text-center">
          
          {/* 문제 텍스트 */}
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#cb000b] leading-tight">
            {current.q}
          </h3>

          {/* 문제 그림 영역 (넉넉한 크기) */}
          <div className="w-full max-w-4xl h-72 md:h-80 rounded-2xl my-4 bg-[#fdf4e8] flex items-center justify-center overflow-hidden p-4">
            {current.image ? (
              <img 
                src={current.image} 
                alt={`문제 ${current.id}`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="hidden flex-col items-center justify-center text-gray-400 gap-2">
              <ImageIcon className="w-16 h-16 stroke-1" />
              <span className="text-base font-semibold text-gray-400">지정된 문제 그림이 없습니다.</span>
            </div>
          </div>

          {/* 하단 플랫 버튼 (그라데이션 X, 보더 X, 단색 O) */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setActiveModal('hint')}
              className="px-8 py-3.5 bg-[#fdab23] hover:bg-[#ffa52c] text-white rounded-2xl text-lg font-bold flex items-center gap-2 shadow-sm transition-all transform hover:scale-105 active:scale-95"
            >
              <HelpCircle className="w-5 h-5" /> 힌트 보기
            </button>

            <button
              onClick={() => setActiveModal('answer')}
              className="px-10 py-3.5 bg-[#cb000b] hover:bg-[#fa4134] text-white font-black text-xl rounded-2xl shadow-sm transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Eye className="w-6 h-6" /> 정답 공개
            </button>
          </div>
        </div>

        {/* 특대형 다음 버튼 (>) */}
        <button
          onClick={handleNext}
          className="w-20 h-20 md:w-24 md:h-24 bg-[#076327] hover:bg-[#239b48] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
          title="다음 문제"
        >
          <ChevronRight className="w-12 h-12 stroke-[3]" />
        </button>
      </div>

      {/* 💡 힌트 모달 (사족 텍스트 없음, 깔끔한 X 닫기) */}
      {activeModal === 'hint' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdf4e8] rounded-3xl p-10 md:p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default border border-[#fdc879]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>
            <span className="text-lg font-bold text-[#076327] bg-white px-5 py-1.5 rounded-xl inline-block mb-4 shadow-sm border border-[#fdc879]">
              💡 힌트
            </span>
            <div className="text-3xl md:text-4xl font-black text-[#cb000b] my-4 leading-snug break-keep">
              {current.hint}
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
            className="bg-[#cb000b] rounded-3xl p-10 md:p-14 max-w-2xl w-full text-center shadow-2xl relative cursor-default text-white"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>
            <span className="text-sm font-black uppercase tracking-widest text-[#fdc879] block mb-2">
              정 답
            </span>
            <div className="text-5xl md:text-7xl font-black my-4">
              {current.a}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
