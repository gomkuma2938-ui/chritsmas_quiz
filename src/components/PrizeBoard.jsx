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
    <div className="flex flex-col h-full justify-center items-center w-full max-w-[1650px] mx-auto py-2 select-none">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* 23개 번호 카드 그리드 */}
      <div className="w-full grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-5 my-auto">
        {INITIAL_PRIZES.map((prize, idx) => {
          const isFlipped = !!openedCards[idx];
          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="h-32 md:h-36 lg:h-40 perspective-1000 cursor-pointer group"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-3xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* 
                  카드 앞면:
                  'OPEN' 텍스트를 제거하고 큼직한 번호만 심플하게 배치
                */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#cb000b] to-[#fa4134] group-hover:from-[#fa4134] group-hover:to-[#cb000b] rounded-3xl border-4 border-[#fdc879] shadow-xl flex items-center justify-center backface-hidden">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black text-[#fdf4e8] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
                    {idx + 1}
                  </span>
                </div>

                {/* 카드 뒷면: 뒤집힌 후 본체 자리 */}
                <div className="absolute inset-0 w-full h-full bg-[#fdf4e8] text-[#cb000b] rounded-3xl border-4 border-[#fdab23] p-3 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl">
                  <span className="text-xs text-[#076327] font-black mb-1 bg-[#feefde] px-2.5 py-0.5 rounded-md border border-[#fdc879]">
                    NO. {idx + 1}
                  </span>
                  <div className="text-base md:text-lg lg:text-xl font-black leading-snug break-keep text-[#cb000b] line-clamp-2">
                    {prize}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 
        ============================================================
        🎁 번호 클릭 시 나타나는 특대형 선물 팝업
        (설명 문구 제거, 닫기 버튼 및 바깥 클릭으로 즉시 닫힘)
        ============================================================
      */}
      {zoomedIndex !== null && (
        <div 
          onClick={() => setZoomedIndex(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#fdf4e8] border-8 border-[#fdab23] rounded-3xl p-10 md:p-16 max-w-3xl w-full text-center shadow-2xl relative cursor-default transform animate-fade-in"
          >
            <button 
              onClick={() => setZoomedIndex(null)}
              className="absolute top-6 right-6 text-[#cb000b] hover:bg-[#feefde] p-2 rounded-full transition-all"
            >
              <X className="w-9 h-9" />
            </button>

            {/* 번호 뱃지 */}
            <div className="inline-block bg-[#076327] text-[#fdf4e8] font-black text-xl md:text-2xl px-7 py-2.5 rounded-2xl shadow-md mb-8 border-2 border-[#fdc879]">
              🎁 NO. {zoomedIndex + 1} 번 선물 발표
            </div>

            {/* 특대형 선물 텍스트 */}
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-[#cb000b] my-8 leading-tight break-keep drop-shadow-sm">
              {INITIAL_PRIZES[zoomedIndex]}
            </div>

            <button
              onClick={() => setZoomedIndex(null)}
              className="mt-6 px-12 py-4 bg-[#cb000b] hover:bg-[#fa4134] text-[#fdf4e8] font-black text-2xl rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-[#fdc879]"
            >
              확 인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
