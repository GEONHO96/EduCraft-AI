import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 프록시 타임아웃 설정 (기본값이 너무 짧을 수 있음)
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.warn('[Proxy Error]', err.message)
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: false, error: { code: 'PROXY_ERROR', message: '서버에 연결할 수 없습니다' } }))
            }
          })
        },
      },
    },
  },
  build: {
    // 청크 분리: 벤더 라이브러리를 별도 청크로 분리하여 캐싱 효율 극대화
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['react-hot-toast', 'react-markdown', 'zustand', 'axios'],
        },
      },
    },
    // 소스맵 비활성화 (프로덕션 빌드 크기 절감)
    sourcemap: false,
    // 500KB 이상 청크 경고
    chunkSizeWarningLimit: 500,
  },
})
