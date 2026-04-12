import apiClient from './client'
import type { ApiResponse } from '../types/api'

export interface TimeSaved {
  totalSeconds: number
  generationCount: number
  formatted: string
}

export interface TeacherDashboard {
  totalCourses: number
  totalStudents: number
  totalMaterials: number
  totalQuizzes: number
  timeSaved: TimeSaved
  recentActivities: { type: string; description: string; createdAt: string }[]
}

export interface StudentDashboard {
  enrolledCourses: number
  completedQuizzes: number
  averageScore: number
  recentQuizResults: { quizTitle: string; score: number; totalQuestions: number; submittedAt: string }[]
}

export const dashboardApi = {
  teacher: () =>
    apiClient.get<ApiResponse<TeacherDashboard>>('/dashboard/teacher'),

  student: () =>
    apiClient.get<ApiResponse<StudentDashboard>>('/dashboard/student'),

  timeSaved: () =>
    apiClient.get<ApiResponse<TimeSaved>>('/dashboard/time-saved'),
}
