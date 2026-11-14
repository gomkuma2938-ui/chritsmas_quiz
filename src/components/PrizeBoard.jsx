// src/components/PrizeBoard.jsx
import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
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

  // 카드 클릭 시 뒤집기 & 모바일 동기화 이벤트 발송
  const handleCardClick = (idx) => {
    const updated = { ...openedCards, [idx]: true };
    setOpenedCards(updated);
    try {
      localStorage.setItem('christmas_gift_board_state', JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage Save Error", e);
    }
    setZoomedIndex(idx);

    // 📡 사회자 폰 리모컨에 어떤 번호가 열렸는지 실시간 상태 전송
    window.dispatchEvent(new CustomEvent('prize-board-updated', { detail: updated }));
  };

  // 모바일 리모컨에서 원격으로 번호 눌렀을 때 반응
  useEffect(() => {
    const handleRemoteClick = (e) => {
      handleCardClick(e.detail);
    };
    window.addEventListener('remote-prize-click', handleRemoteClick);
    return () => window.removeEventListener('remote-prize-click', handleRemoteClick);
  }, [openedCards]);

  // ESC 단축키
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-[1320px] mx-auto select-none">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* 23개 카드 그리드 (체크보드 패턴 보존) */}
      <div className="w-full grid grid-cols-4 md:grid-cols-6 gap-3.5 md:gap-4">
        {INITIAL_PRIZES.map((prize, idx) => {
          const isFlipped = !!openedCards[idx];
          const isEven = (Math.floor(idx / 6) + idx) % 2 === 0;
          const bgClass = isEven ? 'bg-[#cb000b] hover:bg-[#fa4134]' : 'bg-[#15803d] hover:bg-[#16a34a]';

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
                <div className={`absolute inset-0 w-full h-full ${bgClass} rounded-2xl shadow-md flex items-center justify-center backface-hidden transition-colors`}>
                  <span className="text-4xl md:text-5xl font-black text-white">
                    {idx + 1}
                  </span>
                </div>

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
            className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#fdab23]"
          >
            <button 
              onClick={() => setZoomedIndex(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#fdab23] rounded-2xl flex items-center justify-center text-white shadow-md">
              <Gift className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#cb000b] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#fdc879]">
              LUCKY GIFT NO. {zoomedIndex + 1}
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-2xl p-6 md:p-8 border border-[#fdc879] shadow-inner">
              <div className="text-4xl md:text-5xl font-black text-[#cb000b] my-2 leading-tight break-keep">
                {INITIAL_PRIZES[zoomedIndex]}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
