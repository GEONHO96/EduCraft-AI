import apiClient from './client'
import type { ApiResponse } from '../types/api'

export interface CourseSummary {
  courseId: number
  courseTitle: string
  totalStudents: number
  averageProgressRate: number
  completedStudents: number
  inactiveStudents: number
}

export interface StudentProgress {
  studentId: number
  studentName: string
  email: string
  progressRate: number
  completedMaterialCount: number
  totalMaterialCount: number
  quizAttemptCount: number
  averageQuizScore: number | null
  lastActivityAt: string
  completedAt: string | null
  completed: boolean
  inactive: boolean
}

export interface TopConcept {
  concept: string
  count: number
}

export const monitoringApi = {
  getCourseSummary: (courseId: number) =>
    apiClient.get<ApiResponse<CourseSummary>>(`/teacher/monitoring/courses/${courseId}/summary`),

  getStudentProgressList: (courseId: number) =>
    apiClient.get<ApiResponse<StudentProgress[]>>(`/teacher/monitoring/courses/${courseId}/students`),

  getWeaknessTop: (courseId: number, limit = 5) =>
    apiClient.get<ApiResponse<TopConcept[]>>(`/teacher/monitoring/courses/${courseId}/weaknesses/top`, {
      params: { limit },
    }),
}
