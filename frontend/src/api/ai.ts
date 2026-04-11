import apiClient from './client'

export interface GenerateCurriculumRequest {
  courseId: number
  subject: string
  topic: string
  totalWeeks: number
  targetLevel?: string
  additionalRequirements?: string
}

export interface GenerateMaterialRequest {
  curriculumId: number
  type: string
  difficulty?: number
  additionalRequirements?: string
}

export interface GenerateQuizRequest {
  curriculumId: number
  questionCount: number
  difficulty?: number
  questionTypes?: string
  additionalRequirements?: string
}

export interface WeekPlan {
  weekNumber: number
  topic: string
  objectives: string
  content: string
}

export interface CurriculumResult {
  courseId: number
  weeks: WeekPlan[]
  timeSavedSeconds: number
}

export interface MaterialResult {
  materialId: number
  title: string
  contentJson: string
  timeSavedSeconds: number
}

export interface QuizResult {
  quizId: number
  materialId: number
  questionsJson: string
  questionCount: number
  timeSavedSeconds: number
}

export interface GenerateGradeQuizRequest {
  grade: string
  subject: string
  questionCount?: number
  difficulty?: number
}

export interface GradeQuizResult {
  questionsJson: string
  questionCount: number
  grade: string
  subject: string
}

export const aiApi = {
  generateCurriculum: (data: GenerateCurriculumRequest) =>
    apiClient.post<{ success: boolean; data: CurriculumResult }>('/ai/curriculum/generate', data),

  generateMaterial: (data: GenerateMaterialRequest) =>
    apiClient.post<{ success: boolean; data: MaterialResult }>('/ai/material/generate', data),

  generateQuiz: (data: GenerateQuizRequest) =>
    apiClient.post<{ success: boolean; data: QuizResult }>('/ai/quiz/generate', data),

  generateGradeQuiz: (data: GenerateGradeQuizRequest) =>
    apiClient.post<{ success: boolean; data: GradeQuizResult }>('/ai/quiz/grade-quiz', data),
}
