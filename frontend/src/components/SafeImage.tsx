/**
 * SafeImage - 안전한 이미지 렌더링 컴포넌트
 * lazy loading, 로드 실패 시 폴백 아바타, alt 텍스트를 기본 제공한다.
 */
import { useState } from 'react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 이미지 로드 실패 시 표시할 이니셜 (예: 사용자 이름 첫 글자) */
  fallbackInitial?: string
  /** 원형 아바타 스타일 (기본: false) */
  rounded?: boolean
}

export default function SafeImage({
  src,
  alt = '',
  fallbackInitial,
  rounded = false,
  className = '',
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    const initial = fallbackInitial || alt?.charAt(0) || '?'
    return (
      <div
        className={`bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold ${
          rounded ? 'rounded-full' : 'rounded-lg'
        } ${className}`}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {initial}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
      {...props}
    />
  )
}
