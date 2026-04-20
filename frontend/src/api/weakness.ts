import apiClient from './client'
import type { ApiResponse } from '../types/api'

export type WeaknessAnalysisStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export interface WeaknessReportInfo {
  id: number
  courseId: number
  quizSubmissionId: number
  analysisStatus: WeaknessAnalysisStatus
  weakConcepts: string[]
  recommendations: string
  incorrectQuestionCount: number
  generatedAt: string | null
}

export const weaknessApi = {
  /** 특정 퀴즈 제출의 약점 리포트 (폴링 대상) */
  getBySubmission: (quizSubmissionId: number) =>
    apiClient.get<ApiResponse<WeaknessReportInfo>>(`/weakness/submissions/${quizSubmissionId}`),

  /** 내 전체 약점 리포트 (최근순) */
  getMyReports: () =>
    apiClient.get<ApiResponse<WeaknessReportInfo[]>>('/weakness/me'),

  /** 특정 코스의 내 약점 이력 */
  getMyReportsByCourse: (courseId: number) =>
    apiClient.get<ApiResponse<WeaknessReportInfo[]>>(`/weakness/me/courses/${courseId}`),
}
