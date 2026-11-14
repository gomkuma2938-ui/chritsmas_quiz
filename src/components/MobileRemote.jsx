// src/components/MobileRemote.jsx
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Play, Pause, RotateCcw, HelpCircle, Eye, X, Smartphone, RefreshCw } from 'lucide-react';
import { NONSENSE_QUIZZES, DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function MobileRemote() {
  const [pin, setPin] = useState('4259');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [gameState, setGameState] = useState({
    activeTab: 'nonsense',
    nonsenseIndex: 0,
    audioIndex: 0,
    isQuizPlaying: false,
    openedCards: {},
  });

  const peerRef = useRef(null);
  const connRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const attemptIdRef = useRef(0);

  const TABS = [
    { id: 'nonsense', name: '그림 넌센스', count: NONSENSE_QUIZZES.length },
    { id: 'audio', name: '찬양 동시듣기', count: DUAL_AUDIO_QUIZZES.length },
    { id: 'prizes', name: '선물 뽑기판', count: 23 },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPin = params.get('pin');
    if (urlPin) {
      setPin(urlPin);
      connectToHost(urlPin);
    }

    return () => {
      attemptIdRef.current++;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (connRef.current) {
        try { connRef.current.close(); } catch (e) {}
        connRef.current = null;
      }
      if (peerRef.current) {
        try { peerRef.current.destroy(); } catch (e) {}
        peerRef.current = null;
      }
    };
  }, []);

  const connectToHost = (targetPin) => {
    const cleanPin = String(targetPin || '').trim();
    if (!cleanPin) {
      alert('방송실 화면에 떠 있는 PIN 4자리를 입력해주세요.');
      return;
    }

    setIsConnecting(true);
    const currentAttemptId = ++attemptIdRef.current;

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (connRef.current) {
      try { connRef.current.close(); } catch (e) {}
      connRef.current = null;
    }
    if (peerRef.current) {
      try {
        peerRef.current.removeAllListeners();
        peerRef.current.destroy();
      } catch (e) {}
      peerRef.current = null;
    }

    const currentPeer = new Peer({
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    });
    peerRef.current = currentPeer;

    currentPeer.on('open', () => {
      if (currentAttemptId !== attemptIdRef.current) return;

      const conn = currentPeer.connect(`church-quiz-${cleanPin}`);
      connRef.current = conn;

      conn.on('open', () => {
        if (currentAttemptId !== attemptIdRef.current) {
          conn.close();
          return;
        }
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        setIsConnected(true);
        setIsConnecting(false);
      });

      conn.on('data', (data) => {
        if (currentAttemptId !== attemptIdRef.current) return;
        if (data.type === 'SYNC') {
          setGameState(data.payload);
        }
      });

      const handleDisconnect = () => {
        if (currentAttemptId !== attemptIdRef.current) return;
        setIsConnected(false);
        setIsConnecting(true);

        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          if (currentAttemptId === attemptIdRef.current) {
            connectToHost(cleanPin);
          }
        }, 3000);
      };

      conn.on('close', handleDisconnect);
      conn.on('error', handleDisconnect);
    });

    currentPeer.on('error', (err) => {
      if (currentAttemptId !== attemptIdRef.current) return;
      
      if (err.type === 'peer-unavailable') {
        alert('해당 PIN 번호의 방송실 화면을 찾을 수 없습니다. 번호를 다시 확인해주세요.');
        setIsConnected(false);
        setIsConnecting(false);
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      } else {
        setIsConnected(false);
        setIsConnecting(true);
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          if (currentAttemptId === attemptIdRef.current) {
            connectToHost(cleanPin);
          }
        }, 3000);
      }
    });
  };

  const sendAction = (action, payload = null) => {
    if (connRef.current && isConnected) {
      connRef.current.send({ action, payload });
      if (action === 'CLICK_PRIZE') {
        setGameState((prev) => ({
          ...prev,
          openedCards: { ...prev.openedCards, [payload]: true },
        }));
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] bg-[#fdf4e8] flex flex-col justify-center items-center p-6 text-center select-none font-sans overflow-hidden">
        <div className="w-16 h-16 bg-[#cb000b] text-white rounded-3xl flex items-center justify-center mb-4 shadow-lg">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#cb000b] mb-1">사회자 무선 리모컨</h2>
        <p className="text-xs font-bold text-gray-500 mb-6">방송실 화면의 PIN 번호(기본 4259)를 확인하세요</p>

        <div className="w-full max-w-xs space-y-3">
          <input
            type="number"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN 번호 4자리"
            className="w-full py-4 text-center text-3xl font-black tracking-widest rounded-2xl border-2 border-[#fdab23] bg-white outline-none focus:border-[#cb000b] shadow-inner"
          />
          <button
            onClick={() => connectToHost(pin)}
            className="w-full py-4 bg-[#cb000b] hover:bg-[#fa4134] text-white text-xl font-black rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isConnecting ? '방송실 연결/재시도 중...' : '방송실 화면 연결'}
          </button>
        </div>
      </div>
    );
  }

  const { activeTab, nonsenseIndex, audioIndex, isQuizPlaying, openedCards = {} } = gameState;
  const currentNonsense = NONSENSE_QUIZZES[nonsenseIndex] || NONSENSE_QUIZZES[0];
  const currentAudio = DUAL_AUDIO_QUIZZES[audioIndex] || DUAL_AUDIO_QUIZZES[0];

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#fdf4e8] flex flex-col justify-between p-3 select-none font-sans text-gray-800 overflow-hidden">
      
      {/* 상단 탭 선택 바 */}
      <div className="flex-shrink-0 space-y-1.5">
        <div className="flex justify-between items-center bg-white px-3.5 py-1.5 rounded-xl shadow-sm border border-[#fdc879]">
          <span className="text-[11px] font-black text-[#076327] flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#076327] rounded-full animate-pulse" /> 리모컨 연결됨
          </span>
          <span className="text-[11px] font-bold text-gray-400">PIN: {pin}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => sendAction('SET_TAB', tab.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 shadow-sm ${
                  isActive ? 'bg-[#cb000b] text-white' : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 중앙: 번호판 및 정답 */}
      <div className="flex-1 min-h-0 flex flex-col justify-center my-1 overflow-y-auto px-1">
        
        {/* 1. 넌센스 탭 */}
        {activeTab === 'nonsense' && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto w-full">
              {Array.from({ length: NONSENSE_QUIZZES.length }, (_, i) => {
                const isCurrent = nonsenseIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('SET_INDEX', i)}
                    className={`h-14 rounded-2xl font-black text-xl shadow-sm transition-all active:scale-95 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#cb000b] text-white border-2 border-[#fdc879] scale-105'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#cb000b] text-white py-4 px-3 rounded-2xl shadow-md text-center border-2 border-yellow-300 max-w-sm mx-auto w-full">
              <div className="text-3xl md:text-4xl font-black text-yellow-300 drop-shadow-sm leading-tight break-keep">
                {currentNonsense.a}
              </div>
            </div>
          </div>
        )}

        {/* 2. 찬양 탭 */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto w-full">
              {Array.from({ length: DUAL_AUDIO_QUIZZES.length }, (_, i) => {
                const isCurrent = audioIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('SET_INDEX', i)}
                    className={`h-16 rounded-2xl font-black text-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#076327] text-white border-2 border-[#fdc879] scale-105'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#076327] text-white py-3.5 px-3 rounded-2xl shadow-md text-center border-2 border-yellow-300 max-w-xs mx-auto w-full space-y-1">
              <div className="text-lg md:text-xl font-black text-yellow-300 leading-snug break-keep">
                A: {currentAudio.songA.title}
              </div>
              <div className="text-lg md:text-xl font-black text-white leading-snug break-keep">
                B: {currentAudio.songB.title}
              </div>
            </div>
          </div>
        )}

        {/* 3. 선물 뽑기판 탭: 중앙에 '단 1개만' 위치 (취소선 없이 깔끔한 회색 음영) */}
        {activeTab === 'prizes' && (
          <div className="space-y-1">
            <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto w-full">
              {Array.from({ length: 23 }, (_, i) => {
                const isOpened = Boolean(openedCards && openedCards[i]);
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('CLICK_PRIZE', i)}
                    className={`h-14 rounded-2xl font-black text-xl md:text-2xl shadow-sm transition-all active:scale-90 flex items-center justify-center ${
                      isOpened
                        ? 'bg-gray-200 text-gray-400 border border-gray-300 opacity-60'
                        : 'bg-white hover:bg-[#feefde] text-[#cb000b] border-2 border-[#fdc879]'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 
        하단 컨트롤러:
        선물 탭에서는 중복 번호판이 아니라 [팝업 닫기 (ESC)]와 [전체 리셋] 버튼이 정상 출력
      */}
      <div className="flex-shrink-0 space-y-1.5 pt-1 pb-1">
        {activeTab === 'audio' && (
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => sendAction(isQuizPlaying ? 'PAUSE_AUDIO' : 'PLAY_AUDIO')}
              className={`col-span-3 py-3 rounded-2xl text-base font-black text-white shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                isQuizPlaying ? 'bg-[#fa4134] animate-pulse' : 'bg-[#cb000b]'
              }`}
            >
              {isQuizPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isQuizPlaying ? '일시정지' : '두 곡 재생 🎶'}
            </button>
            <button
              onClick={() => sendAction('RESTART_AUDIO')}
              className="py-3 bg-[#feefde] text-[#cb000b] border border-[#fdc879] rounded-2xl flex items-center justify-center shadow-md active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        )}

        {activeTab !== 'prizes' && (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => sendAction('TOGGLE_HINT')}
              className="py-3 bg-[#fdab23] text-white text-sm font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <HelpCircle className="w-4 h-4" /> 힌트 열기/닫기
            </button>

            <button
              onClick={() => sendAction('TOGGLE_ANSWER')}
              className="py-3 bg-[#cb000b] text-white text-sm font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Eye className="w-4 h-4" /> 정답 열기/닫기
            </button>
          </div>
        )}

        {/* 🌟 선물 탭 하단: 팝업 닫기(ESC) 및 전체 리셋 버튼 정상 복구 */}
        {activeTab === 'prizes' && (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => sendAction('CLOSE_MODAL')}
              className="py-3 bg-gray-700 text-white text-xs font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <X className="w-4 h-4" /> 팝업 닫기 (ESC)
            </button>

            <button
              onClick={() => sendAction('RESET_PRIZES')}
              className="py-3 bg-red-100 text-[#cb000b] border border-red-200 text-xs font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> 뽑기판 전체 리셋
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
