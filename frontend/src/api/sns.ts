/**
 * SNS(커뮤니티) API 모듈
 * 게시글 CRUD, 좋아요, 댓글, 팔로우, 프로필 조회 등 소셜 기능 API를 제공한다.
 */
import apiClient from './client'

// ====== 타입 정의 ======
export interface AuthorInfo {
  id: number
  name: string
  profileImage?: string
  role: 'TEACHER' | 'STUDENT'
}

export interface PostInfo {
  id: number
  author: AuthorInfo
  content: string
  imageUrl?: string
  category: string
  likeCount: number
  commentCount: number
  liked: boolean
  createdAt: string
}

export interface CommentInfo {
  id: number
  author: AuthorInfo
  content: string
  createdAt: string
}

export interface PostDetail extends PostInfo {
  comments: CommentInfo[]
}

export interface PostPage {
  posts: PostInfo[]
  currentPage: number
  totalPages: number
  totalElements: number
  hasNext: boolean
}

export interface ProfileInfo {
  id: number
  name: string
  profileImage?: string
  role: string
  postCount: number
  followerCount: number
  followingCount: number
  isFollowing: boolean
}

export interface LikeResult {
  liked: boolean
  likeCount: number
}

export interface FollowResult {
  following: boolean
  followerCount: number
}

/** 파일 업로드 API */
export const fileApi = {
  /** 이미지 파일 업로드 → URL 반환 */
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<{ success: boolean; data: { url: string } }>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ====== SNS API 메서드 ======
export const snsApi = {
  // ---- 게시글 CRUD ----
  /** 새 게시글 작성 */
  createPost: (data: { content: string; imageUrl?: string; category?: string }) =>
    apiClient.post<{ success: boolean; data: PostInfo }>('/sns/posts', data),

  /** 전체 피드 조회 (페이징) */
  getFeed: (page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/posts?page=${page}&size=${size}`),

  /** 팔로잉 유저의 피드만 조회 */
  getFollowingFeed: (page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/posts/following?page=${page}&size=${size}`),

  /** 카테고리별 피드 조회 */
  getPostsByCategory: (category: string, page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/posts/category/${category}?page=${page}&size=${size}`),

  /** 게시글 상세 조회 (댓글 포함) */
  getPostDetail: (postId: number) =>
    apiClient.get<{ success: boolean; data: PostDetail }>(`/sns/posts/${postId}`),

  /** 게시글 삭제 */
  deletePost: (postId: number) =>
    apiClient.delete<{ success: boolean; data: null }>(`/sns/posts/${postId}`),

  // ---- 좋아요 ----
  /** 좋아요 토글 (좋아요/취소) */
  toggleLike: (postId: number) =>
    apiClient.post<{ success: boolean; data: LikeResult }>(`/sns/posts/${postId}/like`),

  // ---- 댓글 ----
  /** 댓글 작성 */
  addComment: (postId: number, data: { content: string }) =>
    apiClient.post<{ success: boolean; data: CommentInfo }>(`/sns/posts/${postId}/comments`, data),

  /** 댓글 삭제 */
  deleteComment: (commentId: number) =>
    apiClient.delete<{ success: boolean; data: null }>(`/sns/comments/${commentId}`),

  // ---- 팔로우 ----
  /** 팔로우 토글 (팔로우/언팔로우) */
  toggleFollow: (userId: number) =>
    apiClient.post<{ success: boolean; data: FollowResult }>(`/sns/users/${userId}/follow`),

  // ---- 프로필 ----
  /** 유저 프로필 조회 */
  getProfile: (userId: number) =>
    apiClient.get<{ success: boolean; data: ProfileInfo }>(`/sns/users/${userId}/profile`),

  /** 특정 유저의 게시글 목록 조회 */
  getUserPosts: (userId: number, page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/users/${userId}/posts?page=${page}&size=${size}`),
}
