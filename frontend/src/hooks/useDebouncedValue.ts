/**
 * useDebouncedValue - 디바운스 커스텀 훅
 * 검색 입력 등에서 불필요한 API 호출을 방지한다.
 */
import { useState, useEffect } from 'react'

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
