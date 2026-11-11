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
    <div className="flex flex-col h-full justify-between items-center space-y-3 w-full max-w-[1550px] mx-auto">
      {/* 
        상단 바 삭제 완료! 
        '문제 1 / 8' 인디케이터는 탭 버튼 바로 아래인 왼쪽 상단에 단정하게 배치
      */}
      <div className="w-full flex justify-start items-center px-2">
        <span className="bg-red-600 text-white font-black px-6 py-2 rounded-2xl text-xl shadow-md border-2 border-yellow-300">
          문제 {index + 1} / {NONSENSE_QUIZZES.length}
        </span>
      </div>

      {/* 대형 카드 본체 (위아래 여백을 꽉 채우도록 min-h 620px로 확장) */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 border-4 border-yellow-400 shadow-2xl flex flex-col items-center justify-between min-h-[620px] text-center">
        
        {/* 문제 텍스트 특대형 확대 */}
        <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-red-700 my-2 leading-tight drop-shadow-sm">
          {current.q}
        </h3>

        {/* 문제 그림 박스 특대형 (높이 420px로 넉넉하게 확장) */}
        <div className="w-full max-w-3xl h-80 md:h-[420px] border-3 border-red-200 rounded-3xl my-2 bg-red-50/60 flex items-center justify-center overflow-hidden shadow-inner p-3">
          {current.image ? (
            <img 
              src={current.image} 
              alt={`문제 ${current.id}`} 
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hidden flex-col items-center justify-center text-red-400 gap-2">
            <ImageIcon className="w-20 h-20 stroke-1" />
            <span className="text-lg font-bold text-gray-500">지정된 문제 그림이 없습니다.</span>
          </div>
        </div>

        {/* 힌트 박스 */}
        {showHint && (
          <div className="w-full max-w-3xl bg-amber-50 border-3 border-amber-400 text-amber-950 px-6 py-3 rounded-2xl text-xl font-black my-1 animate-fade-in shadow-md">
            💡 힌트: {current.hint}
          </div>
        )}

        {/* 정답 공개 박스 */}
        {showAnswer ? (
          <div className="w-full max-w-3xl bg-gradient-to-r from-red-600 via-red-600 to-rose-700 text-yellow-300 py-4 px-8 rounded-2xl shadow-xl animate-fade-in border-3 border-yellow-300">
            <span className="text-xs uppercase font-black tracking-widest text-white/80 block">정 답</span>
            <div className="text-6xl md:text-7xl lg:text-8xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
              {current.a}
            </div>
          </div>
        ) : (
          <div className="h-12 flex items-center justify-center text-gray-400 text-base font-bold">
            하단 [정답 공개] 버튼을 누르면 정답이 나타납니다.
          </div>
        )}
      </div>

      {/* 하단 제어 버튼: [이전] / [힌트 보기 + 정답 공개] / [다음] */}
      <div className="w-full flex justify-between items-center gap-4 pt-1">
        <button
          onClick={handlePrev}
          className="px-8 py-4 bg-white/95 hover:bg-red-50 border-3 border-red-200 text-red-700 font-black text-lg rounded-2xl flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" /> 이전 문제
        </button>

        {/* 중앙 컨트롤: 힌트 보기 + 정답 공개 나란히 배치 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-7 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-lg font-black flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-300"
          >
            <HelpCircle className="w-6 h-6" /> 힌트 {showHint ? '숨기기' : '보기'}
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-red-950 font-black text-xl rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 border-2 border-yellow-200"
          >
            {showAnswer ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            {showAnswer ? '정답 숨기기' : '정답 공개'}
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          다음 문제 <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
