import { useCallback, useEffect, useRef } from "react"

interface RegexWorkerResult {
  matches: Array<{
    match: string
    index: number
    groups: string[]
  }>
  executionTime: number
  isValid: boolean
}

/**
 * Hook for using Web Workers for intensive regex operations
 */
export function useRegexWorker() {
  const workerRef = useRef<Worker | null>(null)
  const pendingRequests = useRef<
    Map<string, (result: RegexWorkerResult | null, error?: string) => void>
  >(new Map())

  // Initialize worker
  useEffect(() => {
    if (typeof window !== "undefined" && window.Worker) {
      try {
        // Create worker from blob to avoid external file loading issues
        const workerBlob = new Blob(
          [
            `
          self.onmessage = function(e) {
            const { id, type, pattern, text, flags } = e.data;

            try {
              const startTime = performance.now();

              if (type === 'test') {
                const regex = new RegExp(pattern, flags);
                const matches = [];

                if (flags.includes('g')) {
                  const globalMatches = [...text.matchAll(regex)];
                  globalMatches.forEach((match) => {
                    if (match.index !== undefined) {
                      matches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                      });
                    }
                  });
                } else {
                  const match = text.match(regex);
                  if (match && match.index !== undefined) {
                    matches.push({
                      match: match[0],
                      index: match.index,
                      groups: match.slice(1),
                    });
                  }
                }

                const executionTime = performance.now() - startTime;

                self.postMessage({
                  id,
                  success: true,
                  result: {
                    matches,
                    executionTime,
                    isValid: true,
                  },
                });
              }
            } catch (error) {
              self.postMessage({
                id,
                success: false,
                error: error.message || 'Unknown error',
              });
            }
          };
        `,
          ],
          { type: "application/javascript" }
        )

        workerRef.current = new Worker(URL.createObjectURL(workerBlob))

        workerRef.current.onmessage = (e) => {
          const { id, success, result, error } = e.data
          const callback = pendingRequests.current.get(id)

          if (callback) {
            if (success) {
              callback(result)
            } else {
              callback(null, error)
            }
            pendingRequests.current.delete(id)
          }
        }

        workerRef.current.onerror = (error) => {
          console.error("Worker error:", error)
        }
      } catch (error) {
        console.warn("Failed to create worker:", error)
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const testRegexInWorker = useCallback(
    (
      pattern: string,
      text: string,
      flags: string
    ): Promise<RegexWorkerResult | null> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          // Fallback to main thread if worker not available
          try {
            const startTime = performance.now()
            const regex = new RegExp(pattern, flags)
            const matches: Array<{
              match: string
              index: number
              groups: string[]
            }> = []

            if (flags.includes("g")) {
              const globalMatches = [...text.matchAll(regex)]
              globalMatches.forEach((match) => {
                if (match.index !== undefined) {
                  matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1),
                  })
                }
              })
            } else {
              const match = text.match(regex)
              if (match && match.index !== undefined) {
                matches.push({
                  match: match[0],
                  index: match.index,
                  groups: match.slice(1),
                })
              }
            }

            const executionTime = performance.now() - startTime
            resolve({
              matches,
              executionTime,
              isValid: true,
            })
          } catch (error) {
            reject(error)
          }
          return
        }

        const id = Math.random().toString(36).substr(2, 9)

        pendingRequests.current.set(id, (result, error) => {
          if (error) {
            reject(new Error(error))
          } else {
            resolve(result)
          }
        })

        workerRef.current.postMessage({
          id,
          type: "test",
          pattern,
          text,
          flags,
        })
      })
    },
    []
  )

  const isWorkerSupported = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.Worker &&
      workerRef.current !== null
    )
  }, [])

  return {
    testRegexInWorker,
    isWorkerSupported,
  }
}
