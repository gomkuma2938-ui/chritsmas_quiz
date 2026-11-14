// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Image as ImageIcon, Music, Gift, Maximize, Minimize, RotateCcw, Smartphone, X } from 'lucide-react';
import ImageNonsenseQuiz from './components/ImageNonsenseQuiz';
import DualAudioQuiz from './components/DualAudioQuiz';
import PrizeBoard from './components/PrizeBoard';
import MobileRemote from './components/MobileRemote';
import { NONSENSE_QUIZZES, DUAL_AUDIO_QUIZZES } from './data/quizData';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isRemoteParam = params.get('remote') === 'true' || params.has('remote');
  const isScreenParam = params.get('screen') === 'true';

  const isRealMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const shouldShowRemote = !isScreenParam && (isRemoteParam || (isRealMobileDevice && window.innerWidth < 768));

  if (shouldShowRemote) {
    return <MobileRemote />;
  }

  const [activeTab, setActiveTab] = useState('nonsense');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prizeResetKey, setPrizeResetKey] = useState(0);

  const [nonsenseIndex, setNonsenseIndex] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isQuizPlaying, setIsQuizPlaying] = useState(false);

  const [openedCards, setOpenedCards] = useState(() => {
    try {
      const saved = localStorage.getItem('christmas_gift_board_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [roomPin] = useState('4259');
  const [showRemoteModal, setShowRemoteModal] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  
  const connsRef = useRef([]);
  const peerRef = useRef(null);

  const currentStateRef = useRef({ activeTab, nonsenseIndex, audioIndex, isQuizPlaying, openedCards });
  useEffect(() => {
    currentStateRef.current = { activeTab, nonsenseIndex, audioIndex, isQuizPlaying, openedCards };
    connsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send({ type: 'SYNC', payload: currentStateRef.current });
      }
    });
  }, [activeTab, nonsenseIndex, audioIndex, isQuizPlaying, openedCards]);

  useEffect(() => {
    const handlePrizeUpdate = (e) => {
      setOpenedCards(e.detail);
    };
    window.addEventListener('prize-board-updated', handlePrizeUpdate);
    return () => window.removeEventListener('prize-board-updated', handlePrizeUpdate);
  }, []);

  const bgImageUrl = `${import.meta.env.BASE_URL}images/bg.jpg`;

  useEffect(() => {
    const peer = new Peer(`church-quiz-${roomPin}`, {
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    });
    peerRef.current = peer;

    peer.on('connection', (conn) => {
      connsRef.current.push(conn);
      setIsRemoteConnected(true);

      conn.on('open', () => {
        conn.send({
          type: 'SYNC',
          payload: currentStateRef.current,
        });
      });

      conn.on('data', (data) => {
        const { action, payload } = data;

        if (action === 'SET_TAB') setActiveTab(payload);
        if (action === 'SET_INDEX') {
          setActiveTab((tab) => {
            if (tab === 'nonsense') setNonsenseIndex(payload);
            if (tab === 'audio') setAudioIndex(payload);
            return tab;
          });
        }
        if (action === 'CLICK_PRIZE') {
          setActiveTab('prizes');
          window.dispatchEvent(new CustomEvent('remote-prize-click', { detail: payload }));
        }
        if (action === 'TOGGLE_HINT') window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' }));
        if (action === 'TOGGLE_ANSWER') window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        if (action === 'PLAY_AUDIO') {
          if (!currentStateRef.current.isQuizPlaying) window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
        }
        if (action === 'PAUSE_AUDIO') {
          if (currentStateRef.current.isQuizPlaying) window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
        }
        if (action === 'RESTART_AUDIO') window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
        if (action === 'CLOSE_MODAL') window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        if (action === 'RESET_PRIZES') handleResetPrizeBoard();
      });

      conn.on('close', () => {
        connsRef.current = connsRef.current.filter((c) => c !== conn);
        if (connsRef.current.length === 0) setIsRemoteConnected(false);
      });
    });

    return () => peer.destroy();
  }, [roomPin]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // 🔥 리셋 실행 시: 로컬 스토리지 삭제 + State 비우기 + 모든 리모컨에 즉시 openedCards: {} 패킷 강제 전송!
  const handleResetPrizeBoard = () => {
    try {
      localStorage.removeItem('christmas_gift_board_state');
    } catch (e) {}
    
    setOpenedCards({});
    setPrizeResetKey((prev) => prev + 1);
    window.dispatchEvent(new CustomEvent('prize-board-updated', { detail: {} }));

    connsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send({
          type: 'SYNC',
          payload: {
            ...currentStateRef.current,
            openedCards: {},
          },
        });
      }
    });
  };

  const remoteUrl = `${window.location.origin}${window.location.pathname}?remote=true&pin=${roomPin}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(remoteUrl)}`;

  return (
    <div 
      className="min-h-screen text-gray-800 flex flex-col font-sans bg-cover bg-center bg-no-repeat relative selection:bg-[#cb000b] selection:text-white"
      style={{ backgroundColor: '#FFFFFF', backgroundImage: `url(${bgImageUrl})` }}
    >
      <header className="relative z-30 w-full px-8 py-4 flex justify-between items-start select-none">
        <div className="flex flex-col items-start gap-2.5">
          <nav className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-[#fdc879]">
            <button
              onClick={() => setActiveTab('nonsense')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'nonsense' ? 'bg-[#cb000b] text-white shadow-sm' : 'text-gray-600 hover:text-[#cb000b]'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> 그림 넌센스
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'audio' ? 'bg-[#cb000b] text-white shadow-sm' : 'text-gray-600 hover:text-[#cb000b]'
              }`}
            >
              <Music className="w-4 h-4" /> 찬양 동시듣기
            </button>
            <button
              onClick={() => setActiveTab('prizes')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'prizes' ? 'bg-[#076327] text-white shadow-sm' : 'text-gray-600 hover:text-[#076327]'
              }`}
            >
              <Gift className="w-4 h-4" /> 선물 뽑기판
            </button>
          </nav>

          <div className="pl-1">
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRemoteModal(true)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black shadow-sm border transition-all flex items-center gap-1.5 ${
              isRemoteConnected 
                ? 'bg-[#076327] text-white border-[#239b48]' 
                : 'bg-white hover:bg-[#feefde] text-[#cb000b] border-[#fdc879]'
            }`}
            title="스마트폰 무선 리모컨 연결"
          >
            <Smartphone className="w-4 h-4" />
            {isRemoteConnected ? '리모컨 연결됨 🟢' : '📱 모바일 리모컨'}
          </button>

          {activeTab === 'prizes' && (
            <button
              onClick={handleResetPrizeBoard}
              className="p-2.5 bg-white hover:bg-[#feefde] text-[#cb000b] rounded-2xl shadow-sm border border-red-200 transition-all flex items-center justify-center"
              title="뽑기판 초기화"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white hover:bg-[#feefde] text-gray-700 rounded-2xl shadow-sm border border-[#fdc879] transition-all flex items-center justify-center"
            title="전체화면"
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
        {activeTab === 'nonsense' && <ImageNonsenseQuiz index={nonsenseIndex} setIndex={setNonsenseIndex} />}
        {activeTab === 'audio' && <DualAudioQuiz index={audioIndex} setIndex={setAudioIndex} onPlayStateChange={setIsQuizPlaying} />}
        {activeTab === 'prizes' && <PrizeBoard key={prizeResetKey} />}
      </main>

      {showRemoteModal && (
        <div 
          onClick={() => setShowRemoteModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative border-2 border-[#fdab23]"
          >
            <button 
              onClick={() => setShowRemoteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-[#cb000b] mb-1">사회자 스마트폰 연결</h3>
            <p className="text-xs text-gray-500 mb-4">폰 카메라로 QR을 찍으면 바로 연결됩니다</p>

            <div className="bg-white p-3 rounded-2xl border border-gray-200 inline-block shadow-sm mb-4">
              <img src={qrCodeUrl} alt="리모컨 QR 코드" className="w-44 h-44 mx-auto" />
            </div>

            <div className="bg-[#fdf4e8] p-3 rounded-xl border border-[#fdc879] mb-3">
              <span className="text-xs text-gray-500 font-bold block mb-1">접속 PIN 번호</span>
              <span className="text-3xl font-black text-[#cb000b] tracking-widest">{roomPin}</span>
            </div>

            <p className="text-[11px] text-[#076327] font-bold">
              {isRemoteConnected ? '🟢 사회자 폰이 연결되었습니다!' : '대기 중... (LTE 데이터로도 접속 가능)'}
            </p>
          </div>
        </div>
      )}

      <footer className="relative z-10 py-1 text-center text-xs text-[#cb000b]/70 font-semibold select-none">
        🎄 성탄 축하 레크리에이션
      </footer>
    </div>
  );
}
