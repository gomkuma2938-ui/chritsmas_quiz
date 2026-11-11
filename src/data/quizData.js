// src/data/quizData.js
const BASE = import.meta.env.BASE_URL;

export const NONSENSE_QUIZZES = [
  { 
    id: 1, 
    q: "1. 마리아가 네 명인 지역은?", 
    a: "사마리아", 
    hint: "숫자 4(사) + 마리아",
    image: `${BASE}images/quiz1.jpg` 
  },
  { 
    id: 2, 
    q: "2. 교회 사람들이 어이 없을 때 하는 말은?", 
    a: "아멘", 
    hint: "아~ 멘붕! 기도의 마무리는 항상...",
    image: `${BASE}images/quiz2.jpg` 
  },
  { 
    id: 3, 
    q: "3. 나무(Tree)를 구매하면?", 
    a: "트리카드", 
    hint: "Tree + Card (결제할 때 쓰는 카드)",
    image: `${BASE}images/quiz3.jpg` 
  },
  { 
    id: 4, 
    q: "4. 성도들이 제일 보기 싫어하는 귀는?", 
    a: "마귀", 
    hint: "신앙 생활에서 물리쳐야 할 존재!",
    image: `${BASE}images/quiz4.jpg` 
  },
  { 
    id: 5, 
    q: "5. 세계에서 가장 비싼 물은?", 
    a: "해물", 
    hint: "해(Dollar/태양)가 들어간 물",
    image: `${BASE}images/quiz5.jpg` 
  },
  { 
    id: 6, 
    q: "6. 주택에 아파트도 줬는데 빌라까지 달라는 성경 인물은?", 
    a: "빌라도", 
    hint: "사도신경 고백에 나오는 총독 (빌라 + 도)",
    image: `${BASE}images/quiz6.jpg` 
  },
  { 
    id: 7, 
    q: "7. 교회에서 자주 불리는 개 이름은?", 
    a: "회개", 
    hint: "하나님 앞에 마땅히 해야 하는 이것!",
    image: `${BASE}images/quiz7.jpg` 
  },
  { 
    id: 8, 
    q: "8. 세계 최고의 만병통치약은?", 
    a: "구약과 신약", 
    hint: "성경 66권 (구약, 신약)",
    image: `${BASE}images/quiz8.jpg` 
  }
];

export const DUAL_AUDIO_QUIZZES = [
  {
    id: 1,
    title: "동시 재생 퀴즈 #1",
    hint: "유명한 복음성가 & 어린이 찬양의 조화!",
    songA: { title: "실로암", artist: "복음성가", notes: [{ f: 261.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 523.25, d: 0.8 }] },
    songB: { title: "돈으로도 못가요 하나님 나라", artist: "어린이 찬양", notes: [{ f: 392.00, d: 0.2 }, { f: 440.00, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 261.63, d: 0.8 }] }
  },
  {
    id: 2,
    title: "동시 재생 퀴즈 #2",
    hint: "축복 송 & 경배 찬양의 만남!",
    songA: { title: "당신은 사랑받기 위해 태어난 사람", artist: "이민섭 작사/작곡", notes: [{ f: 392.00, d: 0.4 }, { f: 440.00, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 329.63, d: 0.4 }] },
    songB: { title: "꽃들도 (마르다 않으리)", artist: "JWorship", notes: [{ f: 293.66, d: 0.3 }, { f: 369.99, d: 0.3 }, { f: 440.00, d: 0.3 }, { f: 554.37, d: 0.6 }] }
  },
  {
    id: 3,
    title: "동시 재생 퀴즈 #3",
    hint: "성탄절 필수 찬송가 2곡!",
    songA: { title: "참 반가운 성도여", artist: "성탄 찬송가", notes: [{ f: 329.63, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 440.00, d: 0.4 }, { f: 523.25, d: 0.8 }] },
    songB: { title: "고요한 밤 거룩한 밤", artist: "성탄 찬송가", notes: [{ f: 392.00, d: 0.5 }, { f: 440.00, d: 0.3 }, { f: 392.00, d: 0.4 }, { f: 329.63, d: 0.8 }] }
  }
];

export const INITIAL_PRIZES = [
  "🎁 문화상품권 1만원", "🍦 아이스크림 쿠폰", "💣 꽝! (다음 기회에)", "🎤 찬양 1곡 솔로 찬양",
  "🎁 달란트 5개", "☕ 따뜻한 바닐라 라떼", "🙏 전원 주기도문 제창", "🍫 고급 초콜릿 세트",
  "🎁 달란트 3개", "💣 꽝! (옆사람에게 양도)", "🎁 특별 슈퍼 대박 선물", "📸 단체 포즈 기념촬영",
  "🍰 케이크 쿠폰", "💣 꽝! (메리 크리스마스)", "🎁 달란트 2개", "👑 성탄 모자 착용권",
  "🧦 수면양말 세트", "🎁 달란트 10개", "💣 꽝!", "🥤 음료수 1박스",
  "📕 이쁜 다이어리", "💣 꽝!", "🎄 크리스마스 대형 인형"
];