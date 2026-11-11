// src/App.jsx
import React, { useState } from 'react';
import { Image as ImageIcon, Music, Gift, Maximize, Minimize, RotateCcw } from 'lucide-react';
import BgmPlayer from './components/BgmPlayer';
import ImageNonsenseQuiz from './components/ImageNonsenseQuiz';
import DualAudioQuiz from './components/DualAudioQuiz';
import PrizeBoard from './components/PrizeBoard';

export default function App() {
  const [activeTab, setActiveTab] = useState('nonsense');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prizeResetKey, setPrizeResetKey] = useState(0);

  const bgImageUrl = `${import.meta.env.BASE_URL}images/bg.jpg`;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // 뽑기판 초기화 리셋 핸들러
  const handleResetPrizeBoard = () => {
    if (window.confirm("1~23번 뽑기판을 전부 초기화하시겠습니까?")) {
      try {
        localStorage.removeItem('christmas_gift_board_state');
      } catch (e) {
        console.error(e);
      }
      setPrizeResetKey(prev => prev + 1);
    }
  };

  return (
    <div 
      className="min-h-screen text-gray-800 flex flex-col font-sans bg-cover bg-center bg-no-repeat relative selection:bg-red-600 selection:text-white"
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage: `url(${bgImageUrl})`
      }}
    >
      {/* 상단 헤더: 가운데 'MERRY CHRISTMAS' 배너를 비우고 좌/우로 배치 */}
      <header className="relative z-20 w-full px-6 py-3.5 flex justify-between items-start">
        {/* 좌측: 탭 메뉴 */}
        <nav className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border-2 border-amber-300 shadow-md">
          <button
            onClick={() => setActiveTab('nonsense')}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'nonsense'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 그림 넌센스
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Music className="w-4 h-4" /> 찬양 동시듣기
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'prizes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Gift className="w-4 h-4" /> 선물 뽑기판
          </button>
        </nav>

        {/* 우측: [판 리셋 버튼] + [전체화면] + [BGM 컨트롤러] */}
        <div className="flex items-center gap-2">
          {activeTab === 'prizes' && (
            <button
              onClick={handleResetPrizeBoard}
              className="p-2.5 bg-white/95 hover:bg-red-50 border-2 border-red-400 text-red-600 rounded-2xl shadow-md transition-all flex items-center justify-center hover:rotate-[-45deg]"
              title="1~23번 뽑기판 초기화 (판 리셋)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white/95 hover:bg-white border-2 border-amber-300 text-amber-700 rounded-2xl shadow-md transition-all flex items-center justify-center"
            title={isFullscreen ? "전체화면 종료" : "전체화면 (PPT 모드)"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          <BgmPlayer 
            isMuted={isMuted} 
            setIsMuted={setIsMuted} 
            volume={volume} 
            setVolume={setVolume} 
          />
        </div>
      </header>

      {/* 중앙 메인 컨텐츠 */}
      <main className="relative z-10 w-full max-w-[1650px] mx-auto px-6 md:px-12 pt-1 pb-10 flex-grow flex flex-col justify-center items-center">
        {activeTab === 'nonsense' && <ImageNonsenseQuiz />}
        {activeTab === 'audio' && <DualAudioQuiz />}
        {activeTab === 'prizes' && <PrizeBoard key={prizeResetKey} />}
      </main>

      <footer className="relative z-10 py-1 text-center text-[11px] text-amber-900/70 font-bold">
        🎄 성탄 축하 레크리에이션
      </footer>
    </div>
  );
}
