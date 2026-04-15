/**
 * main.tsx - 애플리케이션 진입점
 * React 앱을 DOM에 마운트하고, 전역 프로바이더를 설정한다.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// React Query 글로벌 설정 — 캐시·재시도·네트워크 복구 최적화
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,                        // 실패 시 최대 2회 재시도
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // 1s→2s→4s 점진적 대기
      refetchOnWindowFocus: false,     // 탭 전환 시 불필요한 재요청 방지
      refetchOnReconnect: true,        // 네트워크 복구 시 자동 재요청
      staleTime: 3 * 60 * 1000,       // 3분간 데이터를 fresh로 취급
      gcTime: 10 * 60 * 1000,         // 10분간 미사용 캐시 유지
    },
    mutations: {
      retry: 1,                        // mutation도 1회 재시도
    },
  },
})

/**
 * 프로바이더 계층 구조:
 * StrictMode > QueryClientProvider > BrowserRouter > ErrorBoundary > App
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
