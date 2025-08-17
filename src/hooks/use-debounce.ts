import { useCallback, useEffect, useRef } from "react"

/**
 * Enhanced debounce hook with immediate execution option
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  immediate = false
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)
  const immediateRef = useRef(immediate)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Update immediate ref when immediate changes
  useEffect(() => {
    immediateRef.current = immediate
  }, [immediate])

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      const executeCallback = () => callbackRef.current(...args)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (immediateRef.current) {
        executeCallback()
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null
        }, delay)
      } else {
        timeoutRef.current = setTimeout(executeCallback, delay)
      }
    }) as T,
    [delay]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [debouncedCallback, cancel]
}
