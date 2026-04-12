import apiClient from './client'
import type { ApiResponse } from '../types/api'

export interface Course {
  id: number
  title: string
  subject: string
  description: string
  teacherName: string
  createdAt: string
}

export interface CreateCourseRequest {
  title: string
  subject: string
  description?: string
}

export interface BrowseCourse {
  id: number
  title: string
  subject: string
  description: string
  teacherName: string
  studentCount: number
  enrolled: boolean
  createdAt: string
}

export const courseApi = {
  create: (data: CreateCourseRequest) =>
    apiClient.post<ApiResponse<Course>>('/courses', data),

  getMyCourses: () =>
    apiClient.get<ApiResponse<Course[]>>('/courses'),

  getCourse: (id: number) =>
    apiClient.get<ApiResponse<Course>>(`/courses/${id}`),

  /** 전체 강의 탐색 (검색 포함) */
  browse: (keyword?: string) =>
    apiClient.get<ApiResponse<BrowseCourse[]>>('/courses/browse', keyword ? { params: { keyword } } : undefined),

  /** 수강 신청 */
  enroll: (courseId: number) =>
    apiClient.post<ApiResponse<null>>(`/courses/${courseId}/enroll`),
}
