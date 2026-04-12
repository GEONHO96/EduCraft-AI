/**
 * SNS 카테고리 상수
 * 커뮤니티 게시글의 카테고리 목록, 라벨, 색상을 정의한다.
 */

export const CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'FREE', label: '자유' },
  { value: 'STUDY_TIP', label: '공부 팁' },
  { value: 'CLASS_SHARE', label: '수업 공유' },
  { value: 'QNA', label: 'Q&A' },
  { value: 'RESOURCE', label: '자료 공유' },
] as const

export const CATEGORY_LABELS: Record<string, string> = {
  FREE: '자유',
  STUDY_TIP: '공부 팁',
  CLASS_SHARE: '수업 공유',
  QNA: 'Q&A',
  RESOURCE: '자료 공유',
}

export const CATEGORY_COLORS: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-600',
  STUDY_TIP: 'bg-yellow-100 text-yellow-700',
  CLASS_SHARE: 'bg-blue-100 text-blue-700',
  QNA: 'bg-purple-100 text-purple-700',
  RESOURCE: 'bg-green-100 text-green-700',
}
