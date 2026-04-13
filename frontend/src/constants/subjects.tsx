/**
 * 과목 관련 상수
 * 과목별 그라데이션 색상, SVG 아이콘을 정의한다.
 */
import React from 'react'

/** 과목별 그라데이션 색상 (Tailwind CSS 클래스) */
export const SUBJECT_COLORS: Record<string, string> = {
  '수학': 'from-blue-400 to-indigo-600',
  '영어': 'from-emerald-400 to-teal-600',
  '과학': 'from-violet-400 to-purple-600',
  '국어': 'from-rose-400 to-red-500',
  '사회': 'from-amber-400 to-orange-500',
  '프로그래밍': 'from-cyan-400 to-blue-600',
  '컴퓨터공학': 'from-indigo-400 to-violet-600',
  '음악': 'from-pink-400 to-rose-600',
  '미술': 'from-orange-400 to-amber-600',
}

/** 과목에 해당하는 그라데이션 색상 반환 */
export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || 'from-gray-400 to-gray-600'
}

/** 과목별 SVG 아이콘 반환 */
export function getSubjectIcon(subject: string): React.ReactNode {
  const cls = 'w-7 h-7 text-white'
  switch (subject) {
    case '수학':
      // 계산기
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={1.8}/><path strokeLinecap="round" strokeWidth={1.8} d="M8 6h8M8 12h2m4 0h2M8 16h2m4 0h2M8 10h8"/></svg>
    case '영어':
      // 지구본
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.8}/><path strokeWidth={1.8} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/></svg>
    case '과학':
      // 플라스크
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3h6m-5 0v6.5L4.5 18a1.5 1.5 0 001.3 2.2h12.4a1.5 1.5 0 001.3-2.2L14 9.5V3M7.5 16h9"/></svg>
    case '국어':
      // 책
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
    case '프로그래밍':
      // 코드 괄호
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 5l-5 7 5 7m8-14l5 7-5 7M14 4l-4 16"/></svg>
    case '컴퓨터공학':
      // 모니터 + 회로
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" strokeWidth={1.8}/><path strokeLinecap="round" strokeWidth={1.8} d="M8 20h8m-4-4v4m-3-9h2m2 0h2"/><circle cx="9" cy="11" r="0.5" fill="currentColor"/><circle cx="15" cy="11" r="0.5" fill="currentColor"/></svg>
    case '사회':
      // 사람들
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    case '음악':
      // 음표
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    case '미술':
      // 팔레트
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c3.1 0 5.6-2.5 5.6-5.6C22 5.8 17.5 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="12" cy="7" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/></svg>
    default:
      // 기본 학습 아이콘
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
  }
}
