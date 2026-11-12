// src/components/DualAudioQuiz.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Eye, HelpCircle, X, Lightbulb, Music2, Disc3 } from 'lucide-react';
import { DUAL_AUDIO_QUIZZES } from '../data/quizData';

export default function DualAudioQuiz({ index, setIndex, onPlayStateChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // 곡 A, 곡 B 실제 오디오 인스턴스
  const audioARef = useRef(new Audio());
  const audioBRef = useRef(new Audio());

  const current = DUAL_AUDIO_QUIZZES[index];

  // 문제 바뀔 때마다 오디오 리셋 및 새 음원 로드
  useEffect(() => {
    const audioA = audioARef.current;
    const audioB = audioBRef.current;

    audioA.pause();
    audioB.pause();
    audioA.currentTime = 0;
    audioB.currentTime = 0;

    audioA.src = current.songA.src;
    audioB.src = current.songB.src;

    setIsPlaying(false);
    onPlayStateChange(false);

    // 두 곡 모두 끝났을 때 자동 정지 처리
    const handleEnded = () => {
      if (audioA.ended && audioB.ended) {
        setIsPlaying(false);
        onPlayStateChange(false);
      }
    };

    audioA.addEventListener('ended', handleEnded);
    audioB.addEventListener('ended', handleEnded);

    return () => {
      audioA.pause();
      audioB.pause();
      audioA.removeEventListener('ended', handleEnded);
      audioB.removeEventListener('ended', handleEnded);
    };
  }, [index, current]);

  // [이어서 재생 / 일시정지] 토글
  const togglePlay = () => {
    const audioA = audioARef.current;
    const audioB = audioBRef.current;

    if (isPlaying) {
      audioA.pause();
      audioB.pause();
      setIsPlaying(false);
      onPlayStateChange(false); // BGM 복구
    } else {
      Promise.all([audioA.play(), audioB.play()])
        .then(() => {
          setIsPlaying(true);
          onPlayStateChange(true); // BGM 일시정지
        })
        .catch(err => {
          console.warn("오디오 파일이 아직 없거나 재생이 차단되었습니다.", err);
          alert("음원 파일(mp3)이 아직 public/audio 폴더에 들어있지 않습니다.");
        });
    }
  };

  // [처음부터 다시 듣기 ↺]
  const restartAudio = () => {
    const audioA = audioARef.current;
    const audioB = audioBRef.current;

    audioA.currentTime = 0;
    audioB.currentTime = 0;

    // 만약 정지 상태였다면 바로 처음부터 재생
    if (!isPlaying) {
      Promise.all([audioA.play(), audioB.play()])
        .then(() => {
          setIsPlaying(true);
          onPlayStateChange(true);
        })
        .catch(() => {});
    }
  };

  const handleNext = () => {
    setActiveModal(null);
    setIndex((prev) => (prev + 1) % DUAL_AUDIO_QUIZZES.length);
  };

  const handlePrev = () => {
    setActiveModal(null);
    setIndex((prev) => (prev - 1 + DUAL_AUDIO_QUIZZES.length) % DUAL_AUDIO_QUIZZES.length);
  };

  return (
    <div className="w-full flex items-center justify-center gap-5 select-none">
      
      {/* 이전 화살표 */}
      <button
        onClick={handlePrev}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#076327] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border border-[#fdc879]"
        title="이전 곡"
      >
        <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 카드 본체 */}
      <div className="w-full max-w-[1500px] h-[640px] bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-[#fdc879] flex flex-col items-center justify-between text-center">
        
        {/* 제목 */}
        <div className="pt-6">
          <h3 className="text-5xl md:text-6xl font-black text-[#076327] mb-2">{current.title}</h3>
        </div>

        {/* 
          중앙: [두 곡 재생 / 일시정지 (이어서 듣기)] + [처음부터 ↺] 버튼 그룹
        */}
        <div className="my-auto flex items-center gap-4">
          {/* 메인 재생/일시정지 버튼 (빨간색) */}
          <button
            onClick={togglePlay}
            className="px-12 py-7 bg-[#cb000b] hover:bg-[#fa4134] text-white rounded-3xl font-black text-3xl shadow-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-8 h-8 fill-current" /> 일시정지
              </>
            ) : (
              <>
                <Play className="w-8 h-8 fill-current" /> 두 곡 재생 🎶
              </>
            )}
          </button>

          {/* 처음부터 다시 듣기 리셋 버튼 */}
          <button
            onClick={restartAudio}
            className="p-7 bg-[#feefde] hover:bg-[#fdc879] text-[#cb000b] rounded-3xl shadow-md border border-[#fdc879] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
            title="처음부터 다시 듣기"
          >
            <RotateCcw className="w-8 h-8 stroke-[2.5]" />
          </button>
        </div>

        {/* 하단 버튼: 힌트 보기(모달) + 정답 공개(초록색) */}
        <div className="flex items-center gap-4 pb-2">
          <button
            onClick={() => setActiveModal('hint')}
            className="px-8 py-3.5 bg-[#fdab23] hover:bg-[#ffa52c] text-white rounded-2xl text-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <HelpCircle className="w-6 h-6" /> 힌트 보기
          </button>

          <button
            onClick={() => setActiveModal('answer')}
            className="px-10 py-3.5 bg-[#076327] hover:bg-[#239b48] text-white font-black text-2xl rounded-2xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Eye className="w-7 h-7" /> 정답 공개
          </button>
        </div>
      </div>

      {/* 다음 화살표 */}
      <button
        onClick={handleNext}
        className="w-16 h-16 md:w-20 md:h-20 bg-white hover:bg-[#feefde] text-[#076327] rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border border-[#fdc879]"
        title="다음 곡"
      >
        <ChevronRight className="w-10 h-10 md:w-12 md:h-12 stroke-[3]" />
      </button>

      {/* 💡 힌트 모달 */}
      {activeModal === 'hint' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#076327]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#feefde] rounded-2xl border border-[#fdc879] flex items-center justify-center text-[#076327] shadow-sm">
              <Lightbulb className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#076327] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#076327]/30">
              AUDIO HINT
            </span>

            <div className="mt-6 bg-[#fdf4e8] rounded-2xl p-6 md:p-8 border border-[#fdc879]/50 shadow-inner">
              <p className="text-2xl md:text-3xl font-black text-[#076327] leading-relaxed break-keep">
                {current.hint}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 정답 모달 */}
      {activeModal === 'answer' && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-3xl w-full text-center shadow-2xl relative cursor-default border-2 border-[#076327]"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X className="w-7 h-7" />
            </button>

            <div className="w-16 h-16 mx-auto mb-3 bg-[#076327] rounded-2xl flex items-center justify-center text-[#fdc879] shadow-md">
              <Music2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-xs font-black tracking-widest text-[#076327] uppercase bg-[#feefde] px-4 py-1 rounded-full border border-[#076327]/20">
              DUAL HYMN REVEAL
            </span>

            <div className="grid md:grid-cols-2 gap-5 mt-6 text-left">
              <div className="bg-[#fdf4e8] p-6 rounded-2xl border border-[#fdc879] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#076327] uppercase mb-2">
                    <Disc3 className="w-4 h-4 text-[#cb000b]" /> 곡 A
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black text-[#cb000b] break-keep leading-snug">
                    {current.songA.title}
                  </h4>
                </div>
                <p className="text-xs font-bold text-gray-500 mt-4 border-t border-[#fdc879]/40 pt-2">
                  {current.songA.artist}
                </p>
              </div>

              <div className="bg-[#fdf4e8] p-6 rounded-2xl border border-[#fdc879] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#076327] uppercase mb-2">
                    <Disc3 className="w-4 h-4 text-[#076327]" /> 곡 B
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black text-[#076327] break-keep leading-snug">
                    {current.songB.title}
                  </h4>
                </div>
                <p className="text-xs font-bold text-gray-500 mt-4 border-t border-[#fdc879]/40 pt-2">
                  {current.songB.artist}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
