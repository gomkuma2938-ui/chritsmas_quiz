// src/App.jsx
import React, { useState } from 'react';
import { Image as ImageIcon, Music, Gift, Maximize, Minimize } from 'lucide-react';
import BgmPlayer from './components/BgmPlayer';
import ImageNonsenseQuiz from './components/ImageNonsenseQuiz';
import DualAudioQuiz from './components/DualAudioQuiz';
import PrizeBoard from './components/PrizeBoard';

export default function App() {
  const [activeTab, setActiveTab] = useState('nonsense');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // GitHub Pages 배포 시에도 올바르게 이미지를 참조합니다.
  const bgImageUrl = `${import.meta.env.BASE_URL}images/bg.jpg`;

  // 빔프로젝터 PPT 연출용 전체화면 토글
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

  return (
    <div 
      className="min-h-screen text-gray-800 flex flex-col font-sans bg-contain md:bg-cover bg-center bg-no-repeat relative selection:bg-red-600 selection:text-white"
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage: `url(${bgImageUrl})`
      }}
    >
      {/* 
        상단 영역: 중앙의 "MERRY CHRISTMAS" 리본 일러스트를 가리지 않기 위해
        가운데를 비우고 좌/우로 분리 배치했습니다.
      */}
      <header className="relative z-20 w-full px-6 py-4 flex justify-between items-start">
        {/* 좌측: 탭 네비게이션 버튼 */}
        <nav className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border-2 border-amber-300 shadow-md">
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

        {/* 중앙은 비워둠 -> 배경 이미지의 배너가 그대로 노출됨 */}

        {/* 우측: 전체화면 버튼 + BGM 오디오 컨트롤러 */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white/90 hover:bg-white border-2 border-amber-300 text-amber-700 rounded-2xl shadow-md transition-all flex items-center justify-center"
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

      {/* 중앙 메인 컨텐츠 영역: 와이드 16:9 화면에 맞게 1650px로 광폭 확장 */}
      <main className="relative z-10 w-full max-w-[1650px] mx-auto px-4 md:px-8 pt-2 pb-10 flex-grow flex flex-col justify-center items-center">
        {activeTab === 'nonsense' && <ImageNonsenseQuiz />}
        {activeTab === 'audio' && <DualAudioQuiz />}
        {activeTab === 'prizes' && <PrizeBoard />}
      </main>

      {/* 하단 저작권/카피라이트 바는 배경 그래픽을 살리기 위해 깔끔하게 최소화 */}
      <footer className="relative z-10 py-1 text-center text-[11px] text-amber-800/80 font-bold tracking-wider">
        🎄 성탄 축하 레크리에이션
      </footer>
    </div>
  );
}
