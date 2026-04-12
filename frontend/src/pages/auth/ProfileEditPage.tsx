/**
 * ProfileEditPage - 프로필 수정 페이지
 * 닉네임 변경, 프로필 이미지 업로드/삭제 기능을 제공한다.
 */
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { fileApi } from '../../api/sns'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [nickname, setNickname] = useState(user?.nickname || user?.name || '')
  const [previewImage, setPreviewImage] = useState(user?.profileImage || '')
  const [uploading, setUploading] = useState(false)

  // 프로필 저장
  const saveMutation = useMutation({
    mutationFn: (data: { nickname?: string; profileImage?: string }) =>
      authApi.updateProfile(data),
    onSuccess: (res) => {
      if (res.data.success) {
        updateUser(res.data.data)
        toast.success('프로필이 수정되었습니다!')
        navigate(-1)
      }
    },
    onError: () => toast.error('프로필 수정에 실패했습니다.'),
  })

  // 이미지 선택 시 업로드
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    try {
      setUploading(true)
      const res = await fileApi.upload(file)
      const url = res.data.data.url
      setPreviewImage(url)
      toast.success('이미지가 업로드되었습니다.')
    } catch {
      toast.error('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate({
      nickname: nickname.trim() || undefined,
      profileImage: previewImage || undefined,
    })
  }

  const handleRemoveImage = () => {
    setPreviewImage('')
  }

  const displayInitial = (nickname || user?.name || '?').charAt(0)

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">프로필 수정</h1>
        <p className="text-sm text-gray-500 mt-1">닉네임과 프로필 사진을 변경할 수 있습니다</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {previewImage ? (
              <img
                src={previewImage}
                alt="프로필"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-primary-100"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold ring-4 ring-primary-100">
                {displayInitial}
              </div>
            )}
            {/* 호버 오버레이 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {uploading ? '업로드 중...' : '사진 변경'}
            </button>
            {previewImage && (
              <>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  사진 삭제
                </button>
              </>
            )}
          </div>
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="표시될 닉네임을 입력하세요"
            maxLength={20}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            {nickname.length}/20자 · 닉네임은 다른 사용자에게 표시됩니다
          </p>
        </div>

        {/* 이메일 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <input
            type="text"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
          />
        </div>

        {/* 역할 (읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
          <input
            type="text"
            value={user?.role === 'TEACHER' ? '교강사' : '학생'}
            disabled
            className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending || uploading}
            className="flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition text-sm font-medium"
          >
            {saveMutation.isPending ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
