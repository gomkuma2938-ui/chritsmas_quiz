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
      className="min-h-screen text-gray-800 flex flex-col font-sans bg-cover bg-center bg-no-repeat relative selection:bg-[#cb000b] selection:text-white"
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage: `url(${bgImageUrl})`
      }}
    >
      {/* 상단 헤더: 좌/우 여백 확보 */}
      <header className="relative z-30 w-full px-8 py-4 flex justify-between items-start select-none">
        {/* 좌측 탭 메뉴 (플랫 단색 디자인) */}
        <nav className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-[#fdc879]">
          <button
            onClick={() => setActiveTab('nonsense')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'nonsense'
                ? 'bg-[#cb000b] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#cb000b] hover:bg-[#feefde]'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 그림 넌센스
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-[#cb000b] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#cb000b] hover:bg-[#feefde]'
            }`}
          >
            <Music className="w-4 h-4" /> 찬양 동시듣기
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'prizes'
                ? 'bg-[#076327] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#076327] hover:bg-[#feefde]'
            }`}
          >
            <Gift className="w-4 h-4" /> 선물 뽑기판
          </button>
        </nav>

        {/* 우측 컨트롤 */}
        <div className="flex items-center gap-2">
          {activeTab === 'prizes' && (
            <button
              onClick={handleResetPrizeBoard}
              className="p-2.5 bg-white hover:bg-[#feefde] text-[#cb000b] rounded-2xl shadow-sm border border-red-200 transition-all flex items-center justify-center"
              title="1~23번 뽑기판 초기화"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white hover:bg-[#feefde] text-gray-700 rounded-2xl shadow-sm border border-[#fdc879] transition-all flex items-center justify-center"
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

      {/* 
        중앙 메인 컨텐츠 영역:
        상단 리스/배너를 침범하지 않도록 pt-24 md:pt-32 여백을 주어 
        자연스럽게 체크무늬 구역으로 내려앉게 조정
      */}
      <main className="relative z-10 w-full max-w-[1750px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-8 flex-grow flex flex-col justify-center items-center">
        {activeTab === 'nonsense' && <ImageNonsenseQuiz />}
        {activeTab === 'audio' && <DualAudioQuiz />}
        {activeTab === 'prizes' && <PrizeBoard key={prizeResetKey} />}
      </main>

      <footer className="relative z-10 py-1 text-center text-xs text-[#cb000b]/70 font-semibold select-none">
        🎄 성탄 축하 레크리에이션
      </footer>
    </div>
  );
}
