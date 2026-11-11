// src/components/PrizeBoard.jsx
import React, { useState } from 'react';
import { Gift, RotateCcw } from 'lucide-react';
import { INITIAL_PRIZES } from '../data/quizData';

export default function PrizeBoard() {
  const [openedCards, setOpenedCards] = useState(() => {
    try {
      const saved = localStorage.getItem('christmas_gift_board_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCard = (idx) => {
    setOpenedCards((prev) => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem('christmas_gift_board_state', JSON.stringify(updated));
      } catch (e) {
        console.error("LocalStorage Save Error", e);
      }
      return updated;
    });
  };

  const resetBoard = () => {
    if (window.confirm("정말로 1~23번 뽑기판을 전부 초기화하시겠습니까?")) {
      setOpenedCards({});
      try {
        localStorage.removeItem('christmas_gift_board_state');
      } catch (e) {
        console.error("LocalStorage Clear Error", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between items-center space-y-4 w-full max-w-[1550px] mx-auto">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* 상단 헤더 바 */}
      <div className="w-full flex justify-between items-center bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl border-3 border-red-300 shadow-md text-gray-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-red-700 flex items-center gap-2">
            <Gift className="w-8 h-8 text-amber-500" /> 🎁 1~23번 행운의 성탄 선물 뽑기판
          </h2>
          <p className="text-sm font-bold text-gray-600 mt-0.5">카드를 클릭하면 3D로 회전하며 숨겨진 선물이 나타납니다.</p>
        </div>
        <button
          onClick={resetBoard}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-black rounded-xl flex items-center gap-2 shadow-md transition-all transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" /> 판 리셋 (초기화)
        </button>
      </div>

      {/* 23개 대형 카드 그리드 (6열 배치로 스크롤 없이 시원하게) */}
      <div className="w-full grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-5 my-2">
        {INITIAL_PRIZES.map((prize, idx) => {
          const isFlipped = !!openedCards[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCard(idx)}
              className="h-32 md:h-36 lg:h-40 perspective-1000 cursor-pointer group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* 카드 앞면 (대형 번호) */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 via-red-600 to-rose-700 group-hover:from-red-500 group-hover:to-rose-600 rounded-3xl border-4 border-yellow-300 shadow-xl flex flex-col items-center justify-center backface-hidden">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-yellow-200 mt-1 uppercase tracking-widest bg-black/20 px-3 py-0.5 rounded-full">
                    OPEN
                  </span>
                </div>

                {/* 카드 뒷면 (선물 내용) */}
                <div className="absolute inset-0 w-full h-full bg-amber-50 text-red-950 rounded-3xl border-4 border-amber-400 p-3 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl">
                  <span className="text-xs text-red-600 font-black mb-1 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                    NO. {idx + 1}
                  </span>
                  <div className="text-lg md:text-xl lg:text-2xl font-black leading-snug break-keep text-red-900 drop-shadow-sm">
                    {prize}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm font-black text-amber-900 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border border-amber-300 shadow-sm">
        💡 카드를 클릭하면 뒤집히고 상태는 자동 저장됩니다. [판 리셋]을 누르면 모든 카드가 다시 닫힙니다.
      </div>
    </div>
  );
}
