/**
 * ProfilePage - 유저 프로필 페이지
 * 프로필 정보(이름, 역할, 게시글/팔로워/팔로잉 수), 팔로우 버튼,
 * 해당 유저의 게시글 목록을 표시한다.
 */
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { snsApi } from '../../api/sns'
import { useAuthStore } from '../../stores/authStore'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../constants/categories'
import { timeAgo } from '../../utils/date'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { userId } = useParams()
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((s) => s.user)
  const targetId = Number(userId)
  const isMe = currentUser?.id === targetId

  // 프로필 정보 조회
  const profileQuery = useQuery({
    queryKey: ['sns-profile', targetId],
    queryFn: async () => {
      const res = await snsApi.getProfile(targetId)
      return res.data.data
    },
  })

  // 해당 유저의 게시글 목록 조회
  const postsQuery = useQuery({
    queryKey: ['sns-user-posts', targetId],
    queryFn: async () => {
      const res = await snsApi.getUserPosts(targetId)
      return res.data.data
    },
  })

  // 팔로우/언팔로우 토글
  const followMutation = useMutation({
    mutationFn: () => snsApi.toggleFollow(targetId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['sns-profile', targetId] })
      toast.success(res.data.data.following ? '팔로우했습니다.' : '언팔로우했습니다.')
    },
  })

  const likeMutation = useMutation({
    mutationFn: (postId: number) => snsApi.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sns-user-posts', targetId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => snsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sns-user-posts', targetId] })
      queryClient.invalidateQueries({ queryKey: ['sns-profile', targetId] })
      toast.success('게시글이 삭제되었습니다.')
    },
  })

  if (profileQuery.isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-xl p-8 animate-pulse">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (profileQuery.isError) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-gray-500">프로필을 불러올 수 없습니다.</p>
        <button onClick={() => profileQuery.refetch()} className="mt-3 text-primary-600 hover:underline text-sm">
          다시 시도
        </button>
      </div>
    )
  }

  const profile = profileQuery.data!

  return (
    <div className="max-w-2xl mx-auto">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="" loading="lazy" className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-100" />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold ring-4 ring-primary-100">
              {profile.name.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-800">{profile.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                profile.role === 'TEACHER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {profile.role === 'TEACHER' ? '교강사' : '학생'}
              </span>
            </div>

            <div className="flex items-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{profile.postCount}</p>
                <p className="text-xs text-gray-500">게시글</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{profile.followerCount}</p>
                <p className="text-xs text-gray-500">팔로워</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{profile.followingCount}</p>
                <p className="text-xs text-gray-500">팔로잉</p>
              </div>
            </div>
          </div>

          {!isMe && (
            <button
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                profile.isFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {profile.isFollowing ? '팔로잉' : '팔로우'}
            </button>
          )}
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h2 className="text-lg font-bold text-gray-800">게시글</h2>
      </div>

      <div className="space-y-4">
        {postsQuery.isLoading && (
          <div className="text-center py-8 text-gray-400 text-sm">로딩 중...</div>
        )}

        {postsQuery.data?.posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-400">아직 작성한 게시글이 없습니다.</p>
          </div>
        )}

        {postsQuery.data?.posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-500'}`}>
                  {CATEGORY_LABELS[post.category] || post.category}
                </span>
              </div>
              {isMe && (
                <button
                  onClick={() => {
                    if (confirm('게시글을 삭제하시겠습니까?')) deleteMutation.mutate(post.id)
                  }}
                  className="text-gray-300 hover:text-red-400 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>

            {post.imageUrl && (
              <img src={post.imageUrl} alt="" loading="lazy" className="w-full rounded-xl object-cover max-h-80 mt-3" />
            )}

            <div className="flex items-center gap-4 mt-3 pt-2 border-t">
              <button
                onClick={() => likeMutation.mutate(post.id)}
                className={`flex items-center gap-1 text-sm ${post.liked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <svg className="w-4 h-4" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {post.likeCount}
              </button>
              <Link
                to={`/sns/feed`}
                className="flex items-center gap-1 text-sm text-gray-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post.commentCount}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
