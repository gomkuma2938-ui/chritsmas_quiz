// src/App.jsx
import React, { useState } from 'react';
import { Image as ImageIcon, Music, Gift, Maximize, Minimize, RotateCcw } from 'lucide-react';
import BgmPlayer from './components/BgmPlayer';
import ImageNonsenseQuiz from './components/ImageNonsenseQuiz';
import DualAudioQuiz from './components/DualAudioQuiz';
import PrizeBoard from './components/PrizeBoard';
import { NONSENSE_QUIZZES, DUAL_AUDIO_QUIZZES } from './data/quizData';

export default function App() {
  const [activeTab, setActiveTab] = useState('nonsense');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prizeResetKey, setPrizeResetKey] = useState(0);

  const [nonsenseIndex, setNonsenseIndex] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);

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
      {/* 상단 헤더 */}
      <header className="relative z-30 w-full px-8 py-4 flex justify-between items-start select-none">
        <div className="flex flex-col items-start gap-2.5">
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

          {/* 탭 바로 밑 배지 */}
          {activeTab === 'nonsense' && (
            <div className="pl-1">
              <span className="bg-[#cb000b] text-white font-black px-5 py-1.5 rounded-xl text-base shadow-sm inline-block">
                문제 {nonsenseIndex + 1} / {NONSENSE_QUIZZES.length}
              </span>
            </div>
          )}
          {activeTab === 'audio' && (
            <div className="pl-1">
              <span className="bg-[#076327] text-white font-black px-5 py-1.5 rounded-xl text-base shadow-sm inline-block">
                음악 퀴즈 {audioIndex + 1} / {DUAL_AUDIO_QUIZZES.length}
              </span>
            </div>
          )}
        </div>

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
        중앙 메인 컨텐츠:
        상단 리스를 완전히 피하도록 150px 아래(pt-[150px])로 이동
      */}
      <main className="relative z-10 w-full max-w-[1720px] mx-auto px-6 pt-[150px] pb-6 flex-grow flex flex-col justify-center items-center">
        {activeTab === 'nonsense' && (
          <ImageNonsenseQuiz index={nonsenseIndex} setIndex={setNonsenseIndex} />
        )}
        {activeTab === 'audio' && (
          <DualAudioQuiz index={audioIndex} setIndex={setAudioIndex} />
        )}
        {activeTab === 'prizes' && (
          <PrizeBoard key={prizeResetKey} />
        )}
      </main>

      <footer className="relative z-10 py-1 text-center text-xs text-[#cb000b]/70 font-semibold select-none">
        🎄 성탄 축하 레크리에이션
      </footer>
    </div>
  );
}
