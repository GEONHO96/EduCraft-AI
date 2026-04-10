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

export const courseApi = {
  create: (data: CreateCourseRequest) =>
    apiClient.post<{ success: boolean; data: Course }>('/courses', data),

  getMyCourses: () =>
    apiClient.get<{ success: boolean; data: Course[] }>('/courses'),

  getCourse: (id: number) =>
    apiClient.get<{ success: boolean; data: Course }>(`/courses/${id}`),

  enroll: (courseId: number) =>
    apiClient.post(`/courses/${courseId}/enroll`),
}
