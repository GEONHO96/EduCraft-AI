/**
 * 학년 관련 상수
 * 학년 코드를 표시용 한글 라벨로 변환한다.
 */

export const GRADE_LABELS: Record<string, string> = {
  ELEMENTARY_1: '초등학교 1학년', ELEMENTARY_2: '초등학교 2학년', ELEMENTARY_3: '초등학교 3학년',
  ELEMENTARY_4: '초등학교 4학년', ELEMENTARY_5: '초등학교 5학년', ELEMENTARY_6: '초등학교 6학년',
  MIDDLE_1: '중학교 1학년', MIDDLE_2: '중학교 2학년', MIDDLE_3: '중학교 3학년',
  HIGH_1: '고등학교 1학년', HIGH_2: '고등학교 2학년', HIGH_3: '고등학교 3학년',
}

/** 학년 코드를 표시용 텍스트로 변환 */
export function gradeLabel(grade?: string): string | null {
  if (!grade) return null
  return GRADE_LABELS[grade] || grade
}
