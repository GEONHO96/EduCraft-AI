import apiClient from './client'

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
    apiClient.post<{ success: boolean; data: Course }>('/courses', data),

  getMyCourses: () =>
    apiClient.get<{ success: boolean; data: Course[] }>('/courses'),

  getCourse: (id: number) =>
    apiClient.get<{ success: boolean; data: Course }>(`/courses/${id}`),

  /** 전체 강의 탐색 (검색 포함) */
  browse: (keyword?: string) =>
    apiClient.get<{ success: boolean; data: BrowseCourse[] }>(`/courses/browse${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`),

  /** 수강 신청 */
  enroll: (courseId: number) =>
    apiClient.post(`/courses/${courseId}/enroll`),
}
