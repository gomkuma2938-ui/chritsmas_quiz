// src/components/ImageNonsenseQuiz.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, X, Image as ImageIcon } from 'lucide-react';
import { NONSENSE_QUIZZES } from '../data/quizData';

export default function ImageNonsenseQuiz({ index, setIndex }) {
  const [activeModal, setActiveModal] = useState(null);
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
    <div className="w-full flex items-center justify-center gap-4 md:gap-6 select-none">
      
      {/* 
        이전 화살표 (<): 
        화면 끝이 아니라 카드 바로 왼쪽 옆에 자연스럽게 배치
      */}
      <button
        onClick={handlePrev}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#cb000b] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
        title="이전 문제"
      >
        <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 
        초대형 문제 카드:
        - 가로: max-w-[1500px]로 대폭 확장
        - 세로: h-[680px]로 강제 고정하여 위아래 남는 공간 완전 제거
      */}
      <div className="w-full max-w-[1500px] h-[680px] bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-[#fdc879] flex flex-col items-center justify-between text-center">
        
        {/* 문제 텍스트 */}
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#cb000b] leading-tight pt-2">
          {current.q}
        </h3>

        {/* 
          문제 그림 영역: 
          h-[420px]로 큼직하게 늘려서 카드 내부를 꽉 채움
        */}
        <div className="w-full max-w-5xl h-[400px] md:h-[420px] rounded-2xl bg-[#fdf4e8] flex items-center justify-center overflow-hidden p-4 my-auto">
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
          <div className="hidden flex-col items-center justify-center text-gray-400 gap-3">
            <ImageIcon className="w-20 h-20 stroke-1" />
            <span className="text-xl font-bold text-gray-400">지정된 문제 그림이 없습니다.</span>
          </div>
        </div>

        {/* 하단 단색 플랫 버튼 */}
        <div className="flex items-center gap-5 pt-2">
          <button
            onClick={() => setActiveModal('hint')}
            className="px-9 py-3.5 bg-[#fdab23] hover:bg-[#ffa52c] text-white rounded-2xl text-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <HelpCircle className="w-6 h-6" /> 힌트 보기
          </button>

          <button
            onClick={() => setActiveModal('answer')}
            className="px-11 py-3.5 bg-[#cb000b] hover:bg-[#fa4134] text-white font-black text-2xl rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Eye className="w-7 h-7" /> 정답 공개
          </button>
        </div>
      </div>

      {/* 다음 화살표 (>): 카드 바로 오른쪽 옆에 배치 */}
      <button
        onClick={handleNext}
        className="w-16 h-16 md:w-20 md:h-20 bg-[#076327] hover:bg-[#239b48] text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
        title="다음 문제"
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
            className="bg-[#fdf4e8] rounded-3xl p-12 max-w-3xl w-full text-center shadow-2xl relative cursor-default border border-[#fdc879]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <span className="text-xl font-bold text-[#076327] bg-white px-6 py-2 rounded-xl inline-block mb-6 shadow-sm border border-[#fdc879]">
              💡 힌트
            </span>
            <div className="text-4xl md:text-5xl font-black text-[#cb000b] my-4 leading-relaxed break-keep">
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
            className="bg-[#cb000b] rounded-3xl p-12 max-w-3xl w-full text-center shadow-2xl relative cursor-default text-white"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <span className="text-base font-black uppercase tracking-widest text-[#fdc879] block mb-2">
              정 답
            </span>
            <div className="text-6xl md:text-8xl font-black my-4">
              {current.a}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
