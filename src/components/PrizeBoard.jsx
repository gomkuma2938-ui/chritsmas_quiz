// src/components/PrizeBoard.jsx
import React, { useState } from 'react';
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

  // 현재 대형 팝업으로 확대되어 보이는 카드 번호 (null이면 팝업 닫힘)
  const [zoomedIndex, setZoomedIndex] = useState(null);

  // 번호 카드 클릭 핸들러
  const handleCardClick = (idx) => {
    // 1. 해당 카드를 뒤집힌 상태로 저장
    if (!openedCards[idx]) {
      const updated = { ...openedCards, [idx]: true };
      setOpenedCards(updated);
      try {
        localStorage.setItem('christmas_gift_board_state', JSON.stringify(updated));
      } catch (e) {
        console.error("LocalStorage Save Error", e);
      }
    }
    // 2. 화면 전체에 대형 팝업 띄우기
    setZoomedIndex(idx);
  };

  return (
    <div className="flex flex-col h-full justify-center items-center w-full max-w-[1600px] mx-auto py-2">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* 
        상단/하단 안내 문구 전체 삭제 완료! 
        화면 전체를 시원하게 23개 대형 카드로 가득 채움
      */}
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
                {/* 카드 앞면 (대형 번호) */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-600 via-red-600 to-rose-700 group-hover:from-red-500 group-hover:to-rose-600 rounded-3xl border-4 border-yellow-300 shadow-xl flex flex-col items-center justify-center backface-hidden">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-yellow-200 mt-1 uppercase tracking-widest bg-black/20 px-3 py-0.5 rounded-full">
                    OPEN
                  </span>
                </div>

                {/* 카드 뒷면 (제자리에 뒤집힌 상태) */}
                <div className="absolute inset-0 w-full h-full bg-amber-50 text-red-950 rounded-3xl border-4 border-amber-400 p-2.5 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl">
                  <span className="text-[11px] text-red-600 font-black mb-1 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                    NO. {idx + 1}
                  </span>
                  <div className="text-base md:text-lg lg:text-xl font-black leading-snug break-keep text-red-900 line-clamp-2">
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
        🎉 번호 클릭 시 나타나는 [특대형 팝업 연출]
        카드 외 바깥 어두운 배경(오버레이)을 누르면 닫힙니다.
        ============================================================
      */}
      {zoomedIndex !== null && (
        <div 
          onClick={() => setZoomedIndex(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-gradient-to-b from-amber-50 via-white to-amber-100 border-8 border-yellow-400 rounded-3xl p-10 md:p-16 max-w-3xl w-full text-center shadow-[0_25px_60px_rgba(0,0,0,0.6)] transform animate-fade-in relative cursor-default"
          >
            {/* 번호 뱃지 */}
            <div className="inline-block bg-red-600 text-yellow-300 font-black text-xl md:text-2xl px-6 py-2 rounded-2xl shadow-md mb-6 border-2 border-yellow-300">
              🎁 NO. {zoomedIndex + 1} 번 선물 공개!
            </div>

            {/* 특대형 선물 텍스트 */}
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-red-900 my-8 leading-tight break-keep drop-shadow-sm">
              {INITIAL_PRIZES[zoomedIndex]}
            </div>

            <p className="text-sm font-bold text-gray-500 mb-8">
              (카드 바깥이나 아래 닫기 버튼을 누르면 원래 자리로 돌아갑니다)
            </p>

            <button
              onClick={() => setZoomedIndex(null)}
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xl rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-yellow-300"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
