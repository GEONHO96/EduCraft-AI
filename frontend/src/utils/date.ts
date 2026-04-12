/**
 * 날짜/시간 유틸리티
 * 상대 시간 표시 등 날짜 관련 공통 함수를 제공한다.
 */

/** 상대 시간 표시 (방금 전, N분 전, N시간 전, N일 전) */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '방금 전'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  if (days < 30) return `${Math.floor(days / 7)}주 전`
  return new Date(dateStr).toLocaleDateString('ko-KR')
}
