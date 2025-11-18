// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // 根據環境變數，判斷是否為生產環境部署
  // 如果是 GitHub Pages 部署，則設置基底路徑
  base: process.env.NODE_ENV === 'production' ? '/PetAgeConverter/' : '/',
});