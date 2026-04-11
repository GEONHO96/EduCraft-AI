import apiClient from './client'

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

export const snsApi = {
  // 게시글
  createPost: (data: { content: string; imageUrl?: string; category?: string }) =>
    apiClient.post<{ success: boolean; data: PostInfo }>('/sns/posts', data),

  getFeed: (page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/posts?page=${page}&size=${size}`),

  getFollowingFeed: (page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/posts/following?page=${page}&size=${size}`),

  getPostsByCategory: (category: string, page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/posts/category/${category}?page=${page}&size=${size}`),

  getPostDetail: (postId: number) =>
    apiClient.get<{ success: boolean; data: PostDetail }>(`/sns/posts/${postId}`),

  deletePost: (postId: number) =>
    apiClient.delete<{ success: boolean; data: null }>(`/sns/posts/${postId}`),

  // 좋아요
  toggleLike: (postId: number) =>
    apiClient.post<{ success: boolean; data: LikeResult }>(`/sns/posts/${postId}/like`),

  // 댓글
  addComment: (postId: number, data: { content: string }) =>
    apiClient.post<{ success: boolean; data: CommentInfo }>(`/sns/posts/${postId}/comments`, data),

  deleteComment: (commentId: number) =>
    apiClient.delete<{ success: boolean; data: null }>(`/sns/comments/${commentId}`),

  // 팔로우
  toggleFollow: (userId: number) =>
    apiClient.post<{ success: boolean; data: FollowResult }>(`/sns/users/${userId}/follow`),

  // 프로필
  getProfile: (userId: number) =>
    apiClient.get<{ success: boolean; data: ProfileInfo }>(`/sns/users/${userId}/profile`),

  getUserPosts: (userId: number, page = 0, size = 10) =>
    apiClient.get<{ success: boolean; data: PostPage }>(`/sns/users/${userId}/posts?page=${page}&size=${size}`),
}
