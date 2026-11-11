// src/components/ImageNonsenseQuiz.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, X, Image as ImageIcon } from 'lucide-react';
import { NONSENSE_QUIZZES } from '../data/quizData';

export default function ImageNonsenseQuiz() {
  const [index, setIndex] = useState(0);
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
    <div className="w-full flex justify-center items-center relative select-none">
      
      {/* 
        1. [문제 1 / 8] 위치:
        카드에 붙이지 않고, 화면 좌측 상단 [그림 넌센스] 탭 바로 아래에 완전히 고정
      */}
      <div className="fixed top-[74px] left-8 z-40">
        <span className="bg-[#cb000b] text-white font-black px-6 py-2 rounded-xl text-lg shadow-md">
          문제 {index + 1} / {NONSENSE_QUIZZES.length}
        </span>
      </div>

      {/* 
        2. 이전/다음 화살표 (< >):
        카드를 양옆에서 쥐어짜지 않도록 화면 양 끝에 띄워서 배치
      */}
      <button
        onClick={handlePrev}
        className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-20 h-20 md:w-24 md:h-24 bg-white/95 hover:bg-[#feefde] text-[#cb000b] rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        title="이전 문제"
      >
        <ChevronLeft className="w-12 h-12 stroke-[3]" />
      </button>

      <button
        onClick={handleNext}
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-20 h-20 md:w-24 md:h-24 bg-[#076327] hover:bg-[#239b48] text-white rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95"
        title="다음 문제"
      >
        <ChevronRight className="w-12 h-12 stroke-[3]" />
      </button>

      {/* 
        3. 초대형 문제 카드:
        - 가로: w-[90vw] max-w-[1650px]로 꽉 차게 확장
        - 높이: h-[720px]로 늘려 위아래 휑하던 여백 완전히 채움
        - 패딩: p-10 md:p-12로 넉넉하게 확보
      */}
      <div className="w-[90vw] max-w-[1650px] h-[720px] bg-white/95 backdrop-blur-md rounded-3xl p-10 md:p-12 shadow-2xl border border-[#fdc879] flex flex-col items-center justify-between text-center">
        
        {/* 문제 텍스트 */}
        <h3 className="text-5xl md:text-6xl font-black text-[#cb000b] leading-tight pt-2">
          {current.q}
        </h3>

        {/* 
          문제 그림 박스:
          세로 공간(h-[440px])을 꽉 채워 그림이 아주 큼직하게 보이도록 확대
        */}
        <div className="flex-1 w-full max-w-5xl h-[440px] my-4 rounded-2xl bg-[#fdf4e8] flex items-center justify-center overflow-hidden p-4">
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

        {/* 하단 버튼 (그라데이션 X, 보더 X, 플랫 솔리드) */}
        <div className="flex items-center gap-5 pb-2">
          <button
            onClick={() => setActiveModal('hint')}
            className="px-10 py-4 bg-[#fdab23] hover:bg-[#ffa52c] text-white rounded-2xl text-xl font-bold flex items-center gap-2.5 shadow-md transition-all active:scale-95"
          >
            <HelpCircle className="w-6 h-6" /> 힌트 보기
          </button>

          <button
            onClick={() => setActiveModal('answer')}
            className="px-12 py-4 bg-[#cb000b] hover:bg-[#fa4134] text-white font-black text-2xl rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2.5"
          >
            <Eye className="w-7 h-7" /> 정답 공개
          </button>
        </div>
      </div>

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
