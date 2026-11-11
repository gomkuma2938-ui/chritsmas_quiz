import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 상대 경로로 설정하여 어디에 배포하든 이미지와 스크립트가 정상 연결됩니다.
});