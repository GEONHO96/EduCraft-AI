/**
 * FeedPage - SNS 커뮤니티 피드 페이지
 * 전체/팔로잉 피드 전환, 카테고리 필터, 게시글 작성/삭제/좋아요 기능을 제공한다.
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { snsApi, PostInfo, CommentInfo } from '../../api/sns'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

// ====== 카테고리 상수 정의 ======
const CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'FREE', label: '자유' },
  { value: 'STUDY_TIP', label: '공부 팁' },
  { value: 'CLASS_SHARE', label: '수업 공유' },
  { value: 'QNA', label: 'Q&A' },
  { value: 'RESOURCE', label: '자료 공유' },
]

const CATEGORY_LABELS: Record<string, string> = {
  FREE: '자유',
  STUDY_TIP: '공부 팁',
  CLASS_SHARE: '수업 공유',
  QNA: 'Q&A',
  RESOURCE: '자료 공유',
}

const CATEGORY_COLORS: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-600',
  STUDY_TIP: 'bg-yellow-100 text-yellow-700',
  CLASS_SHARE: 'bg-blue-100 text-blue-700',
  QNA: 'bg-purple-100 text-purple-700',
  RESOURCE: 'bg-green-100 text-green-700',
}

type FeedType = 'all' | 'following'

export default function FeedPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [feedType, setFeedType] = useState<FeedType>('all')
  const [category, setCategory] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newCategory, setNewCategory] = useState('FREE')
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  // 피드 데이터 조회 (전체/팔로잉/카테고리별 분기)
  const feedQuery = useQuery({
    queryKey: ['sns-feed', feedType, category],
    queryFn: async () => {
      if (feedType === 'following') {
        const res = await snsApi.getFollowingFeed()
        return res.data.data
      }
      if (category) {
        const res = await snsApi.getPostsByCategory(category)
        return res.data.data
      }
      const res = await snsApi.getFeed()
      return res.data.data
    },
  })

  // 게시글 작성 뮤테이션
  const createMutation = useMutation({
    mutationFn: () =>
      snsApi.createPost({
        content: newContent,
        imageUrl: newImageUrl || undefined,
        category: newCategory,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sns-feed'] })
      setShowCreate(false)
      setNewContent('')
      setNewImageUrl('')
      setNewCategory('FREE')
      toast.success('게시글이 작성되었습니다!')
    },
    onError: () => toast.error('게시글 작성에 실패했습니다.'),
  })

  const likeMutation = useMutation({
    mutationFn: (postId: number) => snsApi.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sns-feed'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => snsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sns-feed'] })
      toast.success('게시글이 삭제되었습니다.')
    },
  })

  if (feedQuery.isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">커뮤니티</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          글쓰기
        </button>
      </div>

      {/* 피드 타입 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setFeedType('all'); setCategory('') }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            feedType === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          전체 피드
        </button>
        <button
          onClick={() => { setFeedType('following'); setCategory('') }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            feedType === 'following' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          팔로잉
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setCategory(cat.value); setFeedType('all') }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              category === cat.value
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 글쓰기 모달 */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">새 게시글</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="text-xs text-gray-500 border-none p-0 focus:ring-0 bg-transparent"
                >
                  {CATEGORIES.filter((c) => c.value).map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="무슨 생각을 하고 계신가요?"
              rows={5}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm"
              autoFocus
            />

            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="이미지 URL (선택사항)"
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm mt-3"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                취소
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!newContent.trim() || createMutation.isPending}
                className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
              >
                {createMutation.isPending ? '게시 중...' : '게시'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {feedQuery.data?.posts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-400">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">첫 번째 글을 작성해보세요!</p>
          </div>
        )}

        {feedQuery.data?.posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={user?.id}
            expanded={expandedPost === post.id}
            onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
            onLike={() => likeMutation.mutate(post.id)}
            onDelete={() => {
              if (confirm('게시글을 삭제하시겠습니까?')) deleteMutation.mutate(post.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}

/** PostCard - 개별 게시글 카드 컴포넌트 (좋아요, 댓글 펼치기, 삭제 기능 포함) */
function PostCard({
  post,
  currentUserId,
  expanded,
  onToggleExpand,
  onLike,
  onDelete,
}: {
  post: PostInfo
  currentUserId?: number
  expanded: boolean
  onToggleExpand: () => void
  onLike: () => void
  onDelete: () => void
}) {
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<CommentInfo[]>([])
  const [loadingComments, setLoadingComments] = useState(false)

  // 댓글 섹션 펼치기/접기 + 댓글 데이터 로드
  const handleExpand = async () => {
    onToggleExpand()
    if (!expanded) {
      setLoadingComments(true)
      try {
        const res = await snsApi.getPostDetail(post.id)
        setComments(res.data.data.comments)
      } catch {
        // ignore
      } finally {
        setLoadingComments(false)
      }
    }
  }

  const commentMutation = useMutation({
    mutationFn: () => snsApi.addComment(post.id, { content: commentText }),
    onSuccess: (res) => {
      setComments((prev) => [...prev, res.data.data])
      setCommentText('')
      queryClient.invalidateQueries({ queryKey: ['sns-feed'] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => snsApi.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      queryClient.invalidateQueries({ queryKey: ['sns-feed'] })
    },
  })

  // 상대 시간 표시 유틸 (방금 전, N분 전, N시간 전 등)
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return '방금 전'
    if (mins < 60) return `${mins}분 전`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}시간 전`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}일 전`
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 pb-0 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/sns/profile/${post.author.id}`}>
            {post.author.profileImage ? (
              <img src={post.author.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {post.author.name.charAt(0)}
              </div>
            )}
          </Link>
          <div>
            <Link to={`/sns/profile/${post.author.id}`} className="text-sm font-semibold text-gray-800 hover:underline">
              {post.author.name}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-500'}`}>
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${post.author.role === 'TEACHER' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {post.author.role === 'TEACHER' ? '교강사' : '학생'}
              </span>
            </div>
          </div>
        </div>
        {currentUserId === post.author.id && (
          <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* 본문 */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* 이미지 */}
      {post.imageUrl && (
        <div className="px-4 pb-3">
          <img src={post.imageUrl} alt="" className="w-full rounded-xl object-cover max-h-96" />
        </div>
      )}

      {/* 액션 바 */}
      <div className="px-4 py-2 border-t flex items-center gap-1">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
            post.liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium">{post.likeCount}</span>
        </button>

        <button
          onClick={handleExpand}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
            expanded ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">{post.commentCount}</span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          {loadingComments ? (
            <div className="py-4 text-center text-sm text-gray-400">댓글 불러오는 중...</div>
          ) : (
            <>
              <div className="space-y-3 py-3">
                {comments.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-2">아직 댓글이 없습니다.</p>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <Link to={`/sns/profile/${comment.author.id}`}>
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {comment.author.name.charAt(0)}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-xl px-3 py-2">
                        <Link to={`/sns/profile/${comment.author.id}`} className="text-xs font-semibold text-gray-800 hover:underline">
                          {comment.author.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-0.5">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 px-1">
                        <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                        {currentUserId === comment.author.id && (
                          <button
                            onClick={() => deleteCommentMutation.mutate(comment.id)}
                            className="text-xs text-gray-400 hover:text-red-400"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 댓글 입력 */}
              <div className="flex gap-2 pt-2 border-t">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && commentText.trim()) commentMutation.mutate()
                  }}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={() => commentMutation.mutate()}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-full hover:bg-primary-700 disabled:opacity-50 transition"
                >
                  등록
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
