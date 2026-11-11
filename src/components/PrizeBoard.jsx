// src/components/PrizeBoard.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
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

  const [zoomedIndex, setZoomedIndex] = useState(null);

  const handleCardClick = (idx) => {
    if (!openedCards[idx]) {
      const updated = { ...openedCards, [idx]: true };
      setOpenedCards(updated);
      try {
        localStorage.setItem('christmas_gift_board_state', JSON.stringify(updated));
      } catch (e) {
        console.error("LocalStorage Save Error", e);
      }
    }
    setZoomedIndex(idx);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[1320px] mx-auto select-none">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* 
        카드 크기를 적정 크기(h-28 md:h-32)로 줄여 
        체크무늬 영역 안에 딱 들어가게 조정
      */}
      <div className="w-full grid grid-cols-4 md:grid-cols-6 gap-3.5 md:gap-4">
        {INITIAL_PRIZES.map((prize, idx) => {
          const isFlipped = !!openedCards[idx];
          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="h-28 md:h-32 perspective-1000 cursor-pointer group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* 앞면: 플랫 솔리드 레드 */}
                <div className="absolute inset-0 w-full h-full bg-[#cb000b] hover:bg-[#fa4134] rounded-2xl shadow-md flex items-center justify-center backface-hidden transition-colors">
                  <span className="text-4xl md:text-5xl font-black text-white">
                    {idx + 1}
                  </span>
                </div>

                {/* 
                  뒷면: NO.2 태그를 완전히 제거하고 
                  선물 텍스트만 깔끔하게 노출
                */}
                <div className="absolute inset-0 w-full h-full bg-[#fdf4e8] text-[#cb000b] rounded-2xl border-2 border-[#fdab23] p-3 flex items-center justify-center text-center backface-hidden rotate-y-180 shadow-md">
                  <div className="text-base md:text-lg font-black leading-snug break-keep text-[#cb000b] line-clamp-2">
                    {prize}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎁 특대형 선물 모달 */}
      {zoomedIndex !== null && (
        <div 
          onClick={() => setZoomedIndex(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#fdf4e8] border border-[#fdab23] rounded-3xl p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default"
          >
            <button 
              onClick={() => setZoomedIndex(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="text-4xl md:text-5xl font-black text-[#cb000b] my-6 leading-tight break-keep">
              {INITIAL_PRIZES[zoomedIndex]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
