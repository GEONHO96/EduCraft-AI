/**
 * FeedPage - SNS 커뮤니티 피드 페이지 (Instagram 스타일)
 * 전체/팔로잉 피드 전환, 카테고리 필터, 게시글 작성/삭제/좋아요 기능을 제공한다.
 */
import { useState, memo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { snsApi, fileApi, PostInfo, CommentInfo } from '../../api/sns'
import { useAuthStore } from '../../stores/authStore'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '../../constants/categories'
import { timeAgo } from '../../utils/date'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import toast from 'react-hot-toast'

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('이미지 파일만 업로드 가능합니다.'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('파일 크기는 10MB 이하만 가능합니다.'); return }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setNewImageUrl('')
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = newImageUrl || undefined
      if (selectedFile) {
        setUploading(true)
        const uploadRes = await fileApi.upload(selectedFile)
        imageUrl = uploadRes.data.data.url
        setUploading(false)
      }
      return snsApi.createPost({ content: newContent, imageUrl, category: newCategory })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sns-feed'] })
      setShowCreate(false)
      setNewContent('')
      setNewImageUrl('')
      setNewCategory('FREE')
      clearFile()
      toast.success('게시글이 작성되었습니다!')
    },
    onError: () => { setUploading(false); toast.error('게시글 작성에 실패했습니다.') },
  })

  const likeMutation = useMutation({
    mutationFn: (postId: number) => snsApi.toggleLike(postId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sns-feed'] }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => snsApi.deletePost(postId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['sns-feed'] }); toast.success('게시글이 삭제되었습니다.') },
  })

  if (feedQuery.isLoading) {
    return (
      <div className="max-w-xl mx-auto pt-4">
        <LoadingSkeleton variant="feed" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">

      {/* ====== 헤더 ====== */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            커뮤니티
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">소통하고 공유하는 교육 커뮤니티</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition text-sm font-semibold shadow-md shadow-purple-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          글쓰기
        </button>
      </div>

      {/* ====== 카테고리 스토리 바 ====== */}
      <div className="flex gap-3 mb-5 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.value && feedType === 'all'
          return (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setFeedType('all') }}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md shadow-pink-200 scale-105'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
                {cat.value === '' && '🌐'}
                {cat.value === 'FREE' && '💬'}
                {cat.value === 'STUDY_TIP' && '💡'}
                {cat.value === 'CLASS_SHARE' && '📚'}
                {cat.value === 'QNA' && '❓'}
                {cat.value === 'RESOURCE' && '📎'}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                {cat.label}
              </span>
            </button>
          )
        })}

        {/* 구분선 */}
        <div className="w-px bg-gray-200 shrink-0 mx-1 self-stretch" />

        {/* 팔로잉 버튼 */}
        <button
          onClick={() => { setFeedType('following'); setCategory('') }}
          className="flex flex-col items-center gap-1.5 shrink-0"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
            feedType === 'following'
              ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-200 scale-105'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}>
            👥
          </div>
          <span className={`text-[10px] font-medium ${feedType === 'following' ? 'text-blue-600' : 'text-gray-400'}`}>
            팔로잉
          </span>
        </button>
      </div>

      {/* ====== 인라인 글쓰기 프롬프트 ====== */}
      <div
        onClick={() => setShowCreate(true)}
        className="flex items-center gap-3 bg-white rounded-2xl p-4 mb-5 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
      >
        {user?.profileImage ? (
          <img src={user.profileImage} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100" />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-purple-100">
            {user?.name?.charAt(0)}
          </div>
        )}
        <span className="text-sm text-gray-400 flex-1">무슨 생각을 하고 계신가요?</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ====== 글쓰기 모달 ====== */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b">
              <button onClick={() => setShowCreate(false)} className="text-sm text-gray-500 hover:text-gray-800 font-medium">
                취소
              </button>
              <h2 className="text-sm font-bold text-gray-800">새 게시글 작성</h2>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!newContent.trim() || createMutation.isPending || uploading}
                className="text-sm font-bold text-purple-600 hover:text-purple-800 disabled:text-gray-300 transition"
              >
                {uploading ? '업로드 중...' : createMutation.isPending ? '게시 중...' : '공유'}
              </button>
            </div>

            {/* 프로필 + 카테고리 */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-2">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="text-xs text-purple-500 font-medium border-none p-0 focus:ring-0 bg-transparent cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.value).map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 본문 입력 */}
            <div className="px-5">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="무슨 생각을 하고 계신가요?"
                rows={5}
                className="w-full py-2 text-sm text-gray-700 placeholder-gray-300 resize-none outline-none border-none focus:ring-0 leading-relaxed"
                autoFocus
              />
            </div>

            {/* 이미지 미리보기 */}
            {(previewUrl || newImageUrl) && (
              <div className="px-5 pb-3">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={previewUrl || newImageUrl}
                    alt="미리보기"
                    className="w-full max-h-60 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <button
                    onClick={() => { clearFile(); setNewImageUrl('') }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* 하단 툴바 */}
            <div className="flex items-center gap-2 px-5 py-3 border-t bg-gray-50/50">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition text-gray-500">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">사진</span>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
              {!selectedFile && !previewUrl && (
                <div className="flex-1">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="이미지 URL 입력"
                    className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-purple-300 focus:border-purple-300 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====== 게시글 목록 ====== */}
      <div className="space-y-5">
        {feedQuery.data?.posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">아직 게시글이 없습니다</h3>
            <p className="text-sm text-gray-400 mb-5">첫 번째 글을 작성하고 소통을 시작해보세요!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-md shadow-purple-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              첫 글 작성하기
            </button>
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

/** PostCard - 인스타그램 스타일 게시글 카드 */
const PostCard = memo(function PostCard({
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
  const [showMore, setShowMore] = useState(false)

  const handleExpand = async () => {
    onToggleExpand()
    if (!expanded) {
      setLoadingComments(true)
      try {
        const res = await snsApi.getPostDetail(post.id)
        setComments(res.data.data.comments)
      } catch { /* ignore */ } finally {
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

  const isLong = post.content.length > 120

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* ====== 헤더 ====== */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/sns/profile/${post.author.id}`} className="relative">
            {post.author.profileImage ? (
              <img src={post.author.profileImage} alt="" loading="lazy" className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-purple-100">
                {post.author.name.charAt(0)}
              </div>
            )}
            {/* 역할 배지 */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold ${
              post.author.role === 'TEACHER' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {post.author.role === 'TEACHER' ? 'T' : 'S'}
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link to={`/sns/profile/${post.author.id}`} className="text-sm font-bold text-gray-900 hover:text-purple-600 transition">
                {post.author.name}
              </Link>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-500'}`}>
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">{timeAgo(post.createdAt)}</span>
          </div>
        </div>

        {/* 더보기 메뉴 */}
        {currentUserId === post.author.id && (
          <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition p-1.5 rounded-full hover:bg-red-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* ====== 이미지 (있으면 본문 위에) ====== */}
      {post.imageUrl && (
        <div className="relative bg-gray-50">
          <img
            src={post.imageUrl.startsWith('/uploads') ? `http://localhost:8080${post.imageUrl}` : post.imageUrl}
            alt=""
            loading="lazy"
            className="w-full max-h-[480px] object-cover"
            onDoubleClick={onLike}
          />
        </div>
      )}

      {/* ====== 액션 바 ====== */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-3">
          {/* 좋아요 */}
          <button onClick={onLike} className="group">
            <svg
              className={`w-6 h-6 transition-all duration-200 ${
                post.liked
                  ? 'text-red-500 scale-110'
                  : 'text-gray-700 group-hover:text-red-400 group-active:scale-125'
              }`}
              fill={post.liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* 댓글 */}
          <button onClick={handleExpand} className="group">
            <svg className={`w-6 h-6 transition ${expanded ? 'text-purple-500' : 'text-gray-700 group-hover:text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* 공유 */}
          <button className="group">
            <svg className="w-6 h-6 text-gray-700 group-hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* 북마크 */}
        <button className="group">
          <svg className="w-6 h-6 text-gray-700 group-hover:text-gray-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* ====== 좋아요 수 ====== */}
      <div className="px-4 pt-1">
        <p className="text-sm font-bold text-gray-800">
          {post.likeCount > 0 ? `좋아요 ${post.likeCount}개` : '\u00A0'}
        </p>
      </div>

      {/* ====== 본문 ====== */}
      <div className="px-4 pt-1 pb-2">
        <p className="text-sm text-gray-800 leading-relaxed">
          <Link to={`/sns/profile/${post.author.id}`} className="font-bold mr-1.5 hover:text-purple-600 transition">
            {post.author.name}
          </Link>
          {isLong && !showMore ? (
            <>
              {post.content.slice(0, 120)}...
              <button onClick={() => setShowMore(true)} className="text-gray-400 ml-1 hover:text-gray-600">
                더 보기
              </button>
            </>
          ) : (
            <span className="whitespace-pre-wrap">{post.content}</span>
          )}
        </p>
      </div>

      {/* ====== 댓글 미리보기 ====== */}
      {post.commentCount > 0 && !expanded && (
        <button onClick={handleExpand} className="px-4 pb-2 text-sm text-gray-400 hover:text-gray-600 transition">
          댓글 {post.commentCount}개 모두 보기
        </button>
      )}

      {/* ====== 댓글 섹션 ====== */}
      {expanded && (
        <div className="border-t">
          {loadingComments ? (
            <div className="py-6 text-center">
              <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-3">
                {comments.length === 0 && (
                  <p className="text-center text-sm text-gray-300 py-3">첫 번째 댓글을 남겨보세요</p>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 group">
                    <Link to={`/sns/profile/${comment.author.id}`} className="shrink-0">
                      {comment.author.profileImage ? (
                        <img src={comment.author.profileImage} alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {comment.author.name.charAt(0)}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        <Link to={`/sns/profile/${comment.author.id}`} className="font-bold mr-1.5 hover:text-purple-600 transition">
                          {comment.author.name}
                        </Link>
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-gray-400">{timeAgo(comment.createdAt)}</span>
                        {currentUserId === comment.author.id && (
                          <button
                            onClick={() => deleteCommentMutation.mutate(comment.id)}
                            className="text-[11px] text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
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
              <div className="flex items-center gap-2 px-4 py-3 border-t">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {useAuthStore.getState().user?.name?.charAt(0)}
                </div>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && commentText.trim()) commentMutation.mutate()
                  }}
                  placeholder="댓글 달기..."
                  className="flex-1 text-sm py-1.5 border-none outline-none focus:ring-0 placeholder-gray-300"
                />
                <button
                  onClick={() => commentMutation.mutate()}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="text-sm font-bold text-purple-500 hover:text-purple-700 disabled:text-gray-200 transition"
                >
                  게시
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
})
