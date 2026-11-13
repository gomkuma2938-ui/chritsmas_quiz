// src/components/MobileRemote.jsx
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Play, Pause, RotateCcw, HelpCircle, Eye, X, Smartphone, RefreshCw } from 'lucide-react';
import { NONSENSE_QUIZZES, DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function MobileRemote() {
  const [pin, setPin] = useState('1225');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [gameState, setGameState] = useState({
    activeTab: 'nonsense',
    nonsenseIndex: 0,
    audioIndex: 0,
    isQuizPlaying: false,
  });

  const peerRef = useRef(null);
  const connRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const targetPinRef = useRef('1225'); // 재접속 시 참조할 PIN 보관용 Ref

  const TABS = [
    { id: 'nonsense', name: '그림 넌센스', count: NONSENSE_QUIZZES.length },
    { id: 'audio', name: '찬양 동시듣기', count: DUAL_AUDIO_QUIZZES.length },
    { id: 'prizes', name: '선물 뽑기판', count: 23 },
  ];

  // URL에서 PIN 감지
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPin = params.get('pin');
    if (urlPin) {
      setPin(urlPin);
      targetPinRef.current = urlPin;
      connectToHost(urlPin);
    }
  }, []);

  // 🛡️ [완벽 보완] close 뿐만 아니라 error 발생 시에도 3초 후 무조건 자동 재접속을 시도하는 통합 함수
  const triggerAutoReconnect = (cleanPin) => {
    setIsConnected(false);
    setIsConnecting(true);

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    reconnectTimerRef.current = setTimeout(() => {
      connectToHost(cleanPin);
    }, 3000);
  };

  const connectToHost = (targetPin) => {
    const cleanPin = String(targetPin || '').trim();
    if (!cleanPin) {
      alert('방송실 화면에 떠 있는 PIN 4자리를 입력해주세요.');
      return;
    }

    targetPinRef.current = cleanPin;
    setIsConnecting(true);

    if (peerRef.current) {
      try { peerRef.current.destroy(); } catch (e) {}
    }

    const peer = new Peer({
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    });
    peerRef.current = peer;

    peer.on('open', () => {
      const conn = peer.connect(`church-quiz-${cleanPin}`);
      connRef.current = conn;

      conn.on('open', () => {
        setIsConnected(true);
        setIsConnecting(false);
      });

      conn.on('data', (data) => {
        if (data.type === 'SYNC') {
          setGameState(data.payload);
        }
      });

      // 🔥 연결 종료 시 자동 재접속 트리거
      conn.on('close', () => {
        triggerAutoReconnect(cleanPin);
      });

      // 🔥 통신 중 에러 발생 시 자동 재접속 트리거
      conn.on('error', () => {
        triggerAutoReconnect(cleanPin);
      });
    });

    // 🔥 Peer 객체 자체 에러(네트워크 단절 등) 발생 시 자동 재접속 트리거
    peer.on('error', (err) => {
      // 최초 연결 시 PIN 번호가 틀린 경우는 재접속 안 하고 바로 알림
      if (err.type === 'peer-unavailable') {
        alert('해당 PIN 번호의 방송실 화면을 찾을 수 없습니다. PIN을 확인하세요.');
        setIsConnecting(false);
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      } else {
        triggerAutoReconnect(cleanPin);
      }
    });
  };

  const sendAction = (action, payload = null) => {
    if (connRef.current && isConnected) {
      connRef.current.send({ action, payload });
    }
  };

  if (!isConnected) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] bg-[#fdf4e8] flex flex-col justify-center items-center p-6 text-center select-none font-sans overflow-hidden">
        <div className="w-16 h-16 bg-[#cb000b] text-white rounded-3xl flex items-center justify-center mb-4 shadow-lg">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#cb000b] mb-1">사회자 무선 리모컨</h2>
        <p className="text-xs font-bold text-gray-500 mb-6">방송실 화면의 PIN 번호(기본 1225)를 확인하세요</p>

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
            disabled={isConnecting}
            className="w-full py-4 bg-[#cb000b] disabled:bg-gray-400 text-white text-xl font-black rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isConnecting ? '방송실 재연결 중...' : '방송실 화면 연결'}
          </button>
        </div>
      </div>
    );
  }

  const { activeTab, nonsenseIndex, audioIndex, isQuizPlaying } = gameState;

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#fdf4e8] flex flex-col justify-between p-3 select-none font-sans text-gray-800 overflow-hidden">
      
      {/* 상단 탭 선택 */}
      <div className="flex-shrink-0 space-y-1.5">
        <div className="flex justify-between items-center bg-white px-3.5 py-1.5 rounded-xl shadow-sm border border-[#fdc879]">
          <span className="text-[11px] font-black text-[#076327] flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#076327] rounded-full animate-pulse" /> 방송실 연결됨 (실시간 동기화)
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

      {/* 중앙 다이렉트 번호 패드 */}
      <div className="flex-1 min-h-0 flex flex-col justify-center my-1 overflow-hidden">
        {activeTab === 'nonsense' && (
          <div className="space-y-1">
            <p className="text-center text-[11px] font-bold text-gray-500 mb-1">
              현재 스크린 문제 번호: <span className="text-[#cb000b] font-black">{nonsenseIndex + 1}번</span>
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto w-full px-2">
              {Array.from({ length: NONSENSE_QUIZZES.length }, (_, i) => {
                const isCurrent = nonsenseIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('SET_INDEX', i)}
                    className={`h-16 rounded-2xl font-black text-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center ${
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
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-1">
            <p className="text-center text-[11px] font-bold text-gray-500 mb-1">
              현재 스크린 찬양 퀴즈: <span className="text-[#076327] font-black">{audioIndex + 1}번</span>
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full px-2">
              {Array.from({ length: DUAL_AUDIO_QUIZZES.length }, (_, i) => {
                const isCurrent = audioIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('SET_INDEX', i)}
                    className={`h-20 rounded-2xl font-black text-3xl shadow-sm transition-all active:scale-95 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#076327] text-white border-2 border-[#fdc879] scale-105'
                        : 'bg-white text-gray-800 border border-gra
