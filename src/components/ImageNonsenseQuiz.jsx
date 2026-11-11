// src/components/ImageNonsenseQuiz.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { NONSENSE_QUIZZES } from '../data/quizData';

export default function ImageNonsenseQuiz() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const current = NONSENSE_QUIZZES[index];

  const handleNext = () => {
    setShowAnswer(false);
    setShowHint(false);
    setIndex((prev) => (prev + 1) % NONSENSE_QUIZZES.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setShowHint(false);
    setIndex((prev) => (prev - 1 + NONSENSE_QUIZZES.length) % NONSENSE_QUIZZES.length);
  };

  return (
    <div className="flex flex-col h-full justify-between items-center space-y-4 max-w-5xl mx-auto w-full">
      {/* 상단 인디케이터 */}
      <div className="w-full flex justify-between items-center bg-white/90 backdrop-blur p-4 rounded-2xl border-2 border-red-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-xl text-base shadow-sm">
            문제 {index + 1} / {NONSENSE_QUIZZES.length}
          </span>
          <span className="text-red-700 font-bold text-lg hidden md:inline">🎅 크리스마스 그림 넌센스</span>
        </div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <HelpCircle className="w-4 h-4" /> 힌트 {showHint ? '숨기기' : '보기'}
        </button>
      </div>

      {/* 문제 카드 본체 */}
      <div className="w-full bg-white/95 backdrop-blur rounded-3xl p-6 md:p-8 border-4 border-yellow-400 shadow-xl flex flex-col items-center justify-between min-h-[440px] text-center">
        <h3 className="text-3xl md:text-5xl font-black text-red-700 my-2 leading-snug drop-shadow-sm">
          {current.q}
        </h3>

        {/* 퀴즈 이미지 표시 영역 */}
        <div className="w-full max-w-md h-56 md:h-64 border-2 border-red-200 rounded-2xl my-3 bg-red-50/50 flex items-center justify-center overflow-hidden shadow-inner">
          {current.image ? (
            <img 
              src={current.image} 
              alt={`문제 ${current.id}`} 
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                // 이미지 없을 경우 fallback UI
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hidden flex-col items-center justify-center text-red-400 gap-2">
            <ImageIcon className="w-12 h-12 stroke-1" />
            <span className="text-sm font-bold text-gray-500">이미지를 불러올 수 없습니다.</span>
          </div>
        </div>

        {showHint && (
          <div className="w-full bg-amber-50 border border-amber-300 text-amber-800 p-3 rounded-xl text-sm font-bold my-1 animate-fade-in">
            💡 힌트: {current.hint}
          </div>
        )}

        {showAnswer ? (
          <div className="w-full bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 py-4 px-6 rounded-2xl shadow-lg">
            <span className="text-xs uppercase font-black tracking-widest text-white block opacity-80">정 답</span>
            <div className="text-4xl md:text-6xl font-black">{current.a}</div>
          </div>
        ) : (
          <div className="h-14 flex items-center justify-center text-gray-400 text-sm font-medium">
            하단 [정답 공개] 버튼을 누르면 정답이 나타납니다.
          </div>
        )}
      </div>

      {/* 하단 제어 버튼 */}
      <div className="w-full flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          className="px-6 py-3.5 bg-white hover:bg-red-50 border-2 border-red-200 text-red-700 font-bold rounded-2xl flex items-center gap-2 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" /> 이전 문제
        </button>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-red-950 font-black text-xl rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          {showAnswer ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
          {showAnswer ? '정답 숨기기' : '정답 공개'}
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl flex items-center gap-2 shadow-md transition-all"
        >
          다음 문제 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}