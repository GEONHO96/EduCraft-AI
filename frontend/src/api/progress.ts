import apiClient from './client'
import type { ApiResponse } from '../types/api'

/** 특정 코스의 내 진도 상세 */
export interface ProgressInfo {
  courseId: number
  totalMaterialCount: number
  completedMaterialCount: number
  completedMaterialIds: number[]
  averageQuizScore: number | null
  quizAttemptCount: number
  progressRate: number
  lastActivityAt: string
  completedAt: string | null
  completed: boolean
}

/** 내 수강 중 코스 진도 요약 (MyProgressPage 목록용) */
export interface ProgressSummary {
  courseId: number
  courseTitle: string
  subject: string
  progressRate: number
  completedMaterialCount: number
  totalMaterialCount: number
  lastActivityAt: string
  completed: boolean
}

/** 수료증 메타 정보 */
export interface CertificateInfo {
  id: number
  certificateNumber: string
  courseId: number
  courseTitle: string
  studentName: string
  issuedAt: string
  finalScore: number
}

export const progressApi = {
  /** 자료 완료 체크 */
  completeMaterial: (materialId: number) =>
    apiClient.post<ApiResponse<ProgressInfo>>(`/progress/materials/${materialId}/complete`),

  /** 자료 완료 체크 해제 */
  uncompleteMaterial: (materialId: number) =>
    apiClient.delete<ApiResponse<ProgressInfo>>(`/progress/materials/${materialId}/complete`),

  /** 특정 코스의 내 진도 상세 */
  getCourseProgress: (courseId: number) =>
    apiClient.get<ApiResponse<ProgressInfo>>(`/progress/courses/${courseId}`),

  /** 수강 중 전체 코스 진도 요약 */
  getMyProgressList: () =>
    apiClient.get<ApiResponse<ProgressSummary[]>>('/progress/me'),

  /** 내 수료증 목록 (최근 발급순) */
  getMyCertificates: () =>
    apiClient.get<ApiResponse<CertificateInfo[]>>('/progress/certificates'),

  /** 수료증 단건 조회 */
  getCertificate: (certificateNumber: string) =>
    apiClient.get<ApiResponse<CertificateInfo>>(`/progress/certificates/${certificateNumber}`),
}
