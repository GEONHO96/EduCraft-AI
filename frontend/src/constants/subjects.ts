/**
 * 과목 관련 상수
 * 과목별 그라데이션 색상, 아이콘 색상 등을 정의한다.
 */

/** 과목별 그라데이션 색상 (Tailwind CSS 클래스) */
export const SUBJECT_COLORS: Record<string, string> = {
  '수학': 'from-blue-400 to-blue-600',
  '영어': 'from-green-400 to-green-600',
  '과학': 'from-purple-400 to-purple-600',
  '국어': 'from-red-400 to-red-600',
  '사회': 'from-yellow-400 to-yellow-600',
  '프로그래밍': 'from-cyan-400 to-cyan-600',
  '음악': 'from-pink-400 to-pink-600',
  '미술': 'from-orange-400 to-orange-600',
}

/** 과목에 해당하는 그라데이션 색상 반환 */
export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || 'from-gray-400 to-gray-600'
}
