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

// React Query 글로벌 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,  // 2분간 데이터를 fresh로 취급 (불필요한 재요청 방지)
      gcTime: 5 * 60 * 1000,     // 5분간 미사용 캐시 유지
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
