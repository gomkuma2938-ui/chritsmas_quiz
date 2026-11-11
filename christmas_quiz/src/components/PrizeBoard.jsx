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
    if (window.confirm("뽑기판을 초기화하시겠습니까?")) {
      setOpenedCards({});
      try {
        localStorage.removeItem('christmas_gift_board_state');
      } catch (e) {
        console.error("LocalStorage Clear Error", e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between items-center space-y-4 max-w-5xl mx-auto w-full">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      <div className="w-full flex justify-between items-center bg-white/90 backdrop-blur p-4 rounded-2xl border-2 border-red-200 shadow-sm text-gray-800">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-red-700 flex items-center gap-2">
            <Gift className="w-7 h-7 text-amber-500" /> 🎁 1~23번 행운의 선물 뽑기판
          </h2>
          <p className="text-xs font-bold text-gray-500">카드를 누르면 뒤집히며 숨겨진 선물이 공개됩니다.</p>
        </div>
        <button
          onClick={resetBoard}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" /> 판 리셋 (초기화)
        </button>
      </div>

      <div className="w-full grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 my-auto max-h-[70vh] overflow-y-auto p-2">
        {INITIAL_PRIZES.map((prize, idx) => {
          const isFlipped = !!openedCards[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCard(idx)}
              className="h-24 md:h-28 perspective-1000 cursor-pointer group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* 카드 앞면 (숫자) */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 rounded-2xl border-2 border-yellow-300 shadow-lg flex flex-col items-center justify-center backface-hidden">
                  <span className="text-3xl md:text-5xl font-black text-white drop-shadow-md">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-yellow-200 mt-1 uppercase">OPEN</span>
                </div>

                {/* 카드 뒷면 (선물 내용) */}
                <div className="absolute inset-0 w-full h-full bg-amber-100 text-red-950 rounded-2xl border-2 border-amber-400 p-2 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-xl">
                  <span className="text-[10px] text-red-700 font-bold mb-0.5">NO. {idx + 1}</span>
                  <div className="text-sm md:text-base font-black leading-tight break-keep">
                    {prize}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs font-bold text-gray-600 text-center bg-white/70 backdrop-blur px-4 py-1.5 rounded-full">
        💡 새로고침해도 열린 카드는 유지됩니다. 상단의 [판 리셋] 버튼으로 초기화할 수 있습니다.
      </div>
    </div>
  );
}