// src/components/MobileRemote.jsx
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Play, Pause, RotateCcw, HelpCircle, Eye, X, Smartphone, RefreshCw } from 'lucide-react';
import { NONSENSE_QUIZZES, DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function MobileRemote() {
  const [pin, setPin] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState({
    activeTab: 'nonsense',
    nonsenseIndex: 0,
    audioIndex: 0,
    isQuizPlaying: false,
  });

  const connRef = useRef(null);

  // 🔥 퀴즈 탭 확장 설정: 나중에 새 퀴즈가 생기면 여기에 한 줄만 추가하면 자동으로 리모컨 탭과 번호판이 생성됩니다!
  const TABS = [
    { id: 'nonsense', name: '그림 넌센스', count: NONSENSE_QUIZZES.length, themeColor: '#cb000b' },
    { id: 'audio', name: '찬양 동시듣기', count: DUAL_AUDIO_QUIZZES.length, themeColor: '#076327' },
    { id: 'prizes', name: '선물 뽑기판', count: 23, themeColor: '#fdab23' },
    // 예: { id: 'bible', name: '성경 인물 퀴즈', count: 10, themeColor: '#2563eb' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPin = params.get('pin');
    if (urlPin) {
      setPin(urlPin);
      connectToHost(urlPin);
    }
  }, []);

  const connectToHost = (targetPin) => {
    const peer = new Peer();
    peer.on('open', () => {
      const conn = peer.connect(`church-quiz-${targetPin}`);
      conn.on('open', () => {
        setIsConnected(true);
        connRef.current = conn;
      });
      conn.on('data', (data) => {
        if (data.type === 'SYNC') {
          setGameState(data.payload);
        }
      });
      conn.on('close', () => setIsConnected(false));
    });
  };

  const sendAction = (action, payload = null) => {
    if (connRef.current && isConnected) {
      connRef.current.send({ action, payload });
    }
  };

  // 1. PIN 번호 입력 화면
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#fdf4e8] flex flex-col justify-center items-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 bg-[#cb000b] text-white rounded-3xl flex items-center justify-center mb-4 shadow-lg">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#cb000b] mb-1">사회자 무선 리모컨</h2>
        <p className="text-sm font-bold text-gray-500 mb-6">방송실 화면에 떠 있는 PIN 4자리를 입력하세요</p>

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
            className="w-full py-4 bg-[#cb000b] text-white text-xl font-black rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            방송실 화면 연결
          </button>
        </div>
      </div>
    );
  }

  // 2. 연결 완료 시: 다이렉트 번호판 리모컨 UI
  const { activeTab, nonsenseIndex, audioIndex, isQuizPlaying } = gameState;
  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-[#fdf4e8] flex flex-col justify-between p-4 select-none font-sans text-gray-800">
      
      {/* 
        상단: 상태 표시 + 탭 선택 바 (확장 가능)
      */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center bg-white px-4 py-2 rounded-2xl shadow-sm border border-[#fdc879]">
          <span className="text-xs font-black text-[#076327] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#076327] rounded-full animate-pulse" /> 방송실 연결됨
          </span>
          <span className="text-xs font-bold text-gray-400">PIN: {pin}</span>
        </div>

        {/* 탭 전환 바 (가로 스크롤 가능하여 탭이 많아져도 깨지지 않음) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => sendAction('SET_TAB', tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex-shrink-0 transition-all flex items-center gap-1.5 shadow-sm ${
                  isActive
                    ? 'bg-[#cb000b] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        중앙: 번호 다이렉트 선택 키패드
      */}
      <div className="my-auto py-3">
        
        {/* 넌센스 퀴즈 번호판 (1~8번) */}
        {activeTab === 'nonsense' && (
          <div className="space-y-3">
            <p className="text-center text-xs font-bold text-gray-500">
              이동할 문제 번호를 누르면 즉시 해당 문제로 변경됩니다
            </p>
            <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
              {Array.from({ length: NONSENSE_QUIZZES.length }, (_, i) => {
                const isCurrent = nonsenseIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('SET_INDEX', i)}
                    className={`h-16 rounded-2xl font-black text-2xl shadow-md transition-all active:scale-95 flex items-center justify-center ${
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

        {/* 찬양 퀴즈 번호판 (1~3번) */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <p className="text-center text-xs font-bold text-gray-500">
              이동할 찬양 퀴즈 곡 번호를 선택하세요
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {Array.from({ length: DUAL_AUDIO_QUIZZES.length }, (_, i) => {
                const isCurrent = audioIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => sendAction('SET_INDEX', i)}
                    className={`h-20 rounded-2xl font-black text-3xl shadow-md transition-all active:scale-95 flex items-center justify-center ${
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
          </div>
        )}

        {/* 선물 뽑기판 1~23번 번호판 (누르면 방송실 스크린에서 해당 카드 오픈!) */}
        {activeTab === 'prizes' && (
          <div className="space-y-2">
            <p className="text-center text-xs font-bold text-gray-500">
              열고 싶은 선물 번호를 누르면 스크린에서 카드가 바로 뒤집힙니다
            </p>
            <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto max-h-[50vh] overflow-y-auto p-1">
              {Array.from({ length: 23 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => sendAction('CLICK_PRIZE', i)}
                  className="h-13 py-3 bg-white hover:bg-[#feefde] text-[#cb000b] border border-[#fdc879] rounded-xl font-black text-xl shadow-sm transition-all active:scale-90 flex items-center justify-center"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 
        하단: 탭별 조작 액션 컨트롤러
      */}
      <div className="space-y-2.5 pt-2">
        
        {/* 찬양 퀴즈: 오디오 제어 버튼들 (재생/일시정지 + 처음부터 ↺) */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => sendAction(isQuizPlaying ? 'PAUSE_AUDIO' : 'PLAY_AUDIO')}
              className={`col-span-3 py-4 rounded-2xl text-lg font-black text-white shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all ${
                isQuizPlaying ? 'bg-[#fa4134] animate-pulse' : 'bg-[#cb000b]'
              }`}
            >
              {isQuizPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isQuizPlaying ? '일시정지' : '두 곡 재생 🎶'}
            </button>

            <button
              onClick={() => sendAction('RESTART_AUDIO')}
              className="py-4 bg-[#feefde] text-[#cb000b] border border-[#fdc879] rounded-2xl flex items-center justify-center shadow-md active:scale-95"
              title="처음부터 재생"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* 넌센스 & 찬양 공통: [힌트 열기/닫기] + [정답 열기/닫기] */}
        {activeTab !== 'prizes' && (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => sendAction('TOGGLE_HINT')}
              className="py-4 bg-[#fdab23] text-white text-base font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <HelpCircle className="w-5 h-5" /> 힌트 열기/닫기
            </button>

            <button
              onClick={() => sendAction('TOGGLE_ANSWER')}
              className="py-4 bg-[#cb000b] text-white text-base font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Eye className="w-5 h-5" /> 정답 열기/닫기
            </button>
          </div>
        )}

        {/* 선물 뽑기판 전용: [모달 닫기 (ESC)] + [전체 리셋] */}
        {activeTab === 'prizes' && (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => sendAction('CLOSE_MODAL')}
              className="py-3.5 bg-gray-700 text-white text-sm font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <X className="w-5 h-5" /> 팝업 닫기 (ESC)
            </button>

            <button
              onClick={() => sendAction('RESET_PRIZES')}
              className="py-3.5 bg-red-100 text-[#cb000b] border border-red-200 text-sm font-black rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> 뽑기판 전체 리셋
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
