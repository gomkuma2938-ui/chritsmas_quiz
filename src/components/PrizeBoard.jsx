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
    <div className="flex flex-col justify-center items-center w-full max-w-[1550px] mx-auto select-none">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* 23개 카드 그리드 (그라데이션 없이 플랫한 솔리드 레드/크림) */}
      <div className="w-full grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-5">
        {INITIAL_PRIZES.map((prize, idx) => {
          const isFlipped = !!openedCards[idx];
          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="h-28 md:h-32 lg:h-36 perspective-1000 cursor-pointer group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* 카드 앞면: 플랫 솔리드 레드 + 흰색 텍스트 */}
                <div className="absolute inset-0 w-full h-full bg-[#cb000b] hover:bg-[#fa4134] rounded-2xl shadow-md flex items-center justify-center backface-hidden transition-colors">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
                    {idx + 1}
                  </span>
                </div>

                {/* 카드 뒷면: 플랫 소프트 크림 + 딥레드 텍스트 */}
                <div className="absolute inset-0 w-full h-full bg-[#fdf4e8] text-[#cb000b] rounded-2xl border-2 border-[#fdab23] p-3 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-md">
                  <span className="text-[11px] text-[#076327] font-bold mb-1 bg-white px-2 py-0.5 rounded border border-[#fdc879]">
                    NO. {idx + 1}
                  </span>
                  <div className="text-sm md:text-base font-black leading-snug break-keep text-[#cb000b] line-clamp-2">
                    {prize}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 
        🎁 특대형 선물 팝업
        - 중복되던 '확인' 버튼 완전 삭제!
        - 우측 상단 'X' 버튼 하나와 바깥 클릭만으로 닫힘
      */}
      {zoomedIndex !== null && (
        <div 
          onClick={() => setZoomedIndex(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#fdf4e8] border border-[#fdab23] rounded-3xl p-10 md:p-14 max-w-2xl w-full text-center shadow-2xl relative cursor-default"
          >
            {/* 닫기 X 버튼 단독 유지 */}
            <button 
              onClick={() => setZoomedIndex(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>

            {/* 번호 뱃지 */}
            <div className="inline-block bg-[#076327] text-white font-bold text-lg md:text-xl px-6 py-2 rounded-xl shadow-sm mb-6">
              🎁 NO. {zoomedIndex + 1} 번 선물
            </div>

            {/* 특대형 선물 텍스트 */}
            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-[#cb000b] my-6 leading-tight break-keep">
              {INITIAL_PRIZES[zoomedIndex]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
