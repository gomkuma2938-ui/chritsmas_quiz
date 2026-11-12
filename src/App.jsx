// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  const [isQuizPlaying, setIsQuizPlaying] = useState(false);

  // 🔢 키보드로 입력 중인 번호 버퍼 ('3', '10' 등)
  const [jumpBuffer, setJumpBuffer] = useState('');
  const jumpTimeoutRef = useRef(null);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setJumpBuffer('');
    if (isQuizPlaying) {
      setIsQuizPlaying(false);
    }
  };

  // ⌨️ [숫자 입력 + Enter] 로 원하는 문제 번호로 즉시 점프
  useEffect(() => {
    const handleNumberJump = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // 0~9 숫자 키를 누르면 버퍼에 누적 (예: 1 누르고 0 누르면 '10')
      if (e.key >= '0' && e.key <= '9') {
        if (activeTab === 'nonsense' || activeTab === 'audio') {
          setJumpBuffer((prev) => {
            const next = prev + e.key;
            // 3초간 추가 입력이 없으면 자동 취소
            if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
            jumpTimeoutRef.current = setTimeout(() => setJumpBuffer(''), 3000);
            return next;
          });
        }
        return;
      }

      // Enter 키: 번호가 입력된 상태면 해당 문제로 이동!
      if (e.key === 'Enter' && jumpBuffer) {
        e.preventDefault();
        const targetNum = parseInt(jumpBuffer, 10);

        if (activeTab === 'nonsense') {
          if (targetNum >= 1 && targetNum <= NONSENSE_QUIZZES.length) {
            setNonsenseIndex(targetNum - 1);
          }
        } else if (activeTab === 'audio') {
          if (targetNum >= 1 && targetNum <= DUAL_AUDIO_QUIZZES.length) {
            setAudioIndex(targetNum - 1);
          }
        }

        setJumpBuffer('');
        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
        return;
      }

      // Backspace: 입력 중인 번호 한 글자 지우기
      if (e.key === 'Backspace' && jumpBuffer) {
        setJumpBuffer((prev) => prev.slice(0, -1));
        return;
      }

      // ESC: 입력 중인 번호 취소
      if (e.key === 'Escape' && jumpBuffer) {
        setJumpBuffer('');
        if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
        return;
      }
    };

    window.addEventListener('keydown', handleNumberJump);
    return () => window.removeEventListener('keydown', handleNumberJump);
  }, [activeTab, jumpBuffer]);

  return (
    <div 
      className="min-h-screen text-gray-800 flex flex-col font-sans bg-cover bg-center bg-no-repeat relative selection:bg-[#cb000b] selection:text-white"
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage: `url(${bgImageUrl})`
      }}
    >
      <header className="relative z-30 w-full px-8 py-4 flex justify-between items-start select-none">
        <div className="flex flex-col items-start gap-2.5">
          <nav className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-[#fdc879]">
            <button
              onClick={() => handleTabChange('nonsense')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'nonsense'
                  ? 'bg-[#cb000b] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#cb000b] hover:bg-[#feefde]'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> 퀴즈
            </button>

            <button
              onClick={() => handleTabChange('audio')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'audio'
                  ? 'bg-[#cb000b] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#cb000b] hover:bg-[#feefde]'
              }`}
            >
              <Music className="w-4 h-4" /> 찬양 퀴즈
            </button>

            <button
              onClick={() => handleTabChange('prizes')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'prizes'
                  ? 'bg-[#076327] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#076327] hover:bg-[#feefde]'
              }`}
            >
              <Gift className="w-4 h-4" /> 선물 뽑기판
            </button>
          </nav>

          {/* 탭 바로 밑 배지 + 숫자 입력 시 [이동: 번호 ↵] 실시간 표시 */}
          <div className="flex items-center gap-2 pl-1">
            {activeTab === 'nonsense' && (
              <span className="bg-[#cb000b] text-white font-black px-5 py-1.5 rounded-xl text-base shadow-sm inline-block">
                문제 {nonsenseIndex + 1} / {NONSENSE_QUIZZES.length}
              </span>
            )}
            {activeTab === 'audio' && (
              <span className="bg-[#076327] text-white font-black px-5 py-1.5 rounded-xl text-base shadow-sm inline-block">
                음악 퀴즈 {audioIndex + 1} / {DUAL_AUDIO_QUIZZES.length}
              </span>
            )}

            {/* 숫자를 타이핑 중일 때 뜨는 노란색 입력 배지 */}
            {jumpBuffer && (
              <span className="bg-[#fdab23] text-white font-black px-4 py-1.5 rounded-xl text-base shadow-md animate-pulse">
                이동: {jumpBuffer} ↵
              </span>
            )}
          </div>
        </div>

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
            isQuizPlaying={isQuizPlaying}
          />
        </div>
      </header>

      <main className="relative z-10 w-full max-w-[1720px] mx-auto px-6 pt-[80px] pb-6 flex-grow flex flex-col justify-center items-center">
        {activeTab === 'nonsense' && (
          <ImageNonsenseQuiz index={nonsenseIndex} setIndex={setNonsenseIndex} />
        )}
        {activeTab === 'audio' && (
          <DualAudioQuiz 
            index={audioIndex} 
            setIndex={setAudioIndex}
            onPlayStateChange={setIsQuizPlaying}
          />
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
