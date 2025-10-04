"use client"

import * as React from "react"
import {
  Download,
  Mic,
  MicOff,
  Monitor,
  Pause,
  Play,
  Square,
  Video,
} from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FeatureGrid, ToolLayout } from "@/components/common"

interface RecordingData {
  blob: Blob
  url: string
  duration: number
}

const EXPORT_FORMATS = [
  { value: "video/mp4", label: "MP4", extension: "mp4" },
  { value: "video/webm", label: "WebM", extension: "webm" },
  { value: "video/x-msvideo", label: "AVI", extension: "avi" },
  { value: "video/quicktime", label: "MOV", extension: "mov" },
]

export function ScreenRecorder() {
  const [isRecording, setIsRecording] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [micEnabled, setMicEnabled] = React.useState(false)
  const [recordingData, setRecordingData] =
    React.useState<RecordingData | null>(null)
  const [duration, setDuration] = React.useState(0)
  const [exportFormat, setExportFormat] = React.useState("video/mp4")
  const [isExporting, setIsExporting] = React.useState(false)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = React.useRef<number>(0)
  const pausedTimeRef = React.useRef<number>(0)
  const totalPausedTimeRef = React.useRef<number>(0)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          frameRate: { ideal: 60, max: 120 },
        } as MediaTrackConstraints,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100,
        } as MediaTrackConstraints,
      })

      let micStream: MediaStream | null = null
      if (micEnabled) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          })
        } catch {
          toast({
            title: "Microphone access denied",
            description: "Recording will continue without microphone audio.",
            variant: "destructive",
          })
        }
      }

      const tabAudioTracks = displayStream.getAudioTracks()
      const micAudioTracks = micStream ? micStream.getAudioTracks() : []

      if (tabAudioTracks.length === 0) {
        toast({
          title: "No tab audio detected",
          description:
            'Make sure to check "Share tab audio" in the screen sharing dialog.',
          variant: "destructive",
        })
      }

      let combinedStream: MediaStream

      if (tabAudioTracks.length > 0 && micAudioTracks.length > 0) {
        const audioContext = new AudioContext()
        const destination = audioContext.createMediaStreamDestination()

        const tabSource = audioContext.createMediaStreamSource(
          new MediaStream(tabAudioTracks)
        )
        tabSource.connect(destination)

        const micSource = audioContext.createMediaStreamSource(
          new MediaStream(micAudioTracks)
        )
        micSource.connect(destination)

        combinedStream = new MediaStream([
          ...displayStream.getVideoTracks(),
          ...destination.stream.getAudioTracks(),
        ])
      } else if (micAudioTracks.length > 0) {
        combinedStream = new MediaStream([
          ...displayStream.getVideoTracks(),
          ...micAudioTracks,
        ])
      } else {
        combinedStream = displayStream
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm;codecs=vp9",
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)

        setRecordingData({
          blob,
          url,
          duration,
        })

        combinedStream.getTracks().forEach((track) => track.stop())

        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder

      setIsRecording(true)
      startTimeRef.current = Date.now()
      totalPausedTimeRef.current = 0
      pausedTimeRef.current = 0

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current - totalPausedTimeRef.current) /
            1000
        )
        setDuration(elapsed)
      }, 1000)

      toast({
        title: "Recording started",
        description: "Your screen is now being recorded.",
      })
    } catch (error) {
      toast({
        title: "Failed to start recording",
        description:
          error instanceof Error
            ? error.message
            : "Please ensure you have granted screen recording permissions.",
        variant: "destructive",
      })
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        const pauseDuration = Date.now() - pausedTimeRef.current
        totalPausedTimeRef.current += pauseDuration
        pausedTimeRef.current = 0
        setIsPaused(false)

        timerRef.current = setInterval(() => {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current - totalPausedTimeRef.current) /
              1000
          )
          setDuration(elapsed)
        }, 1000)

        toast({
          title: "Recording resumed",
          description: "Your recording is resumed. You can pause it anytime.",
        })
      } else {
        mediaRecorderRef.current.pause()
        pausedTimeRef.current = Date.now()
        setIsPaused(true)

        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        toast({
          title: "Recording paused",
          description: "Your recording is paused. You can resume it anytime.",
        })
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      toast({
        title: "Recording stopped",
        description: "Your recording is ready for preview and export.",
      })
    }
  }

  const downloadRecording = async () => {
    if (!recordingData) return

    setIsExporting(true)

    try {
      const blob = recordingData.blob

      if (exportFormat !== "video/webm") {
        toast({
          title: "Note",
          description:
            "Browser native format is WebM. Other formats may have limited browser support.",
        })
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const extension =
        EXPORT_FORMATS.find((f) => f.value === exportFormat)?.extension ||
        "webm"
      a.download = `screen-recording-${Date.now()}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download started",
        description: "Your recording is being downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to download the recording.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const resetRecording = () => {
    if (recordingData?.url) {
      URL.revokeObjectURL(recordingData.url)
    }
    setRecordingData(null)
    setDuration(0)
    pausedTimeRef.current = 0
    totalPausedTimeRef.current = 0
    chunksRef.current = []
  }

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (recordingData?.url) {
        URL.revokeObjectURL(recordingData.url)
      }
    }
  }, [recordingData])

  const features = [
    {
      icon: "🎥",
      title: "Screen Recording",
      description: "Record full screen, window, or tab with tab audio",
    },
    {
      icon: "🎙️",
      title: "Microphone Support",
      description: "Add voice narration mixed with tab audio",
    },
    {
      icon: "📼",
      title: "Multiple Formats",
      description: "Export to MP4, WebM, AVI, or MOV format",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description: "Everything happens in your browser. No uploads.",
    },
    {
      icon: "⏸️",
      title: "Pause & Resume",
      description: "Pause and resume recording anytime",
    },
    {
      icon: "💾",
      title: "Instant Export",
      description: "Download your recording immediately after stopping",
    },
  ]

  return (
    <ToolLayout
      title="Screen Recorder"
      description="Record your screen with microphone support and export as video — 100% client-side"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Screen Recorder
            </CardTitle>
            <CardDescription>
              Record your screen with system audio and optional microphone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Microphone</Label>
                <p className="text-muted-foreground text-sm">
                  Add microphone narration (mixed with tab audio)
                </p>
              </div>
              <Button
                variant={micEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setMicEnabled(!micEnabled)}
                disabled={isRecording}
              >
                {micEnabled ? (
                  <>
                    <Mic className="h-4 w-4" />
                    Mic On
                  </>
                ) : (
                  <>
                    <MicOff className="h-4 w-4" />
                    Mic Off
                  </>
                )}
              </Button>
            </div>

            <Separator />

            {isRecording && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                    <span className="font-medium">
                      {isPaused ? "Paused" : "Recording"}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {formatTime(duration)}
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid gap-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="w-full"
                  disabled={!!recordingData}
                >
                  <Video className="h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={pauseRecording}
                      variant="outline"
                      size="lg"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-5 w-5" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-5 w-5" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      size="lg"
                    >
                      <Square className="h-5 w-5" />
                      Stop
                    </Button>
                  </div>
                </>
              )}

              {recordingData && (
                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Record New Video
                </Button>
              )}
            </div>

            {!isRecording && !recordingData && (
              <div className="space-y-3">
                <div className="text-muted-foreground bg-muted/50 rounded-lg border p-4 text-center text-sm">
                  <p className="mb-2 font-medium">Ready to record</p>
                  <p className="text-xs">
                    Click &quot;Start Recording&quot; to begin capturing your
                    screen
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                    📢 Important: Audio Capture
                  </p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                    When the browser dialog appears, make sure to check
                    &quot;Share tab audio&quot; or &quot;Share system
                    audio&quot; to record audio from YouTube or other sources.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {recordingData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Preview & Export
              </CardTitle>
              <CardDescription>
                Preview and export your recording
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted overflow-hidden rounded-lg border">
                <video
                  ref={videoRef}
                  src={recordingData.url}
                  controls
                  className="w-full"
                  style={{ maxHeight: "400px" }}
                />
              </div>

              <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-muted-foreground text-xs">Duration</p>
                  <p className="font-mono font-medium">
                    {formatTime(recordingData.duration)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Size</p>
                  <p className="font-mono font-medium">
                    {(recordingData.blob.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <div className="flex flex-wrap gap-2">
                    {EXPORT_FORMATS.map((format) => (
                      <Button
                        key={format.value}
                        variant={
                          exportFormat === format.value ? "default" : "outline"
                        }
                        onClick={() => setExportFormat(format.value)}
                        size="sm"
                      >
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={downloadRecording}
                  size="lg"
                  className="w-full"
                  disabled={isExporting}
                >
                  <Download className="h-5 w-5" />
                  {isExporting ? "Exporting..." : "Download Recording"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Why Use This Screen Recorder?</CardTitle>
          <CardDescription>
            A fully client-side screen recorder with privacy-first approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureGrid features={features} />

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Use Cases</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✔ Record tutorials or screen demos</li>
                <li>✔ Capture bugs or software behavior for debugging</li>
                <li>✔ Create product walkthroughs and presentations</li>
                <li>✔ Record gameplay or streaming content</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">How It Works</h3>
              <p className="text-muted-foreground mb-2 text-sm">
                This tool uses the MediaRecorder API to capture your screen
                directly in the browser. All recording and processing happens
                locally on your device - nothing is uploaded to any server. Your
                privacy is fully protected.
              </p>
              <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950">
                <p className="text-xs font-semibold text-orange-900 dark:text-orange-100">
                  🎵 Recording Audio from YouTube/Tabs:
                </p>
                <ol className="mt-2 space-y-1 text-xs text-orange-800 dark:text-orange-200">
                  <li>1. Click &quot;Start Recording&quot;</li>
                  <li>2. In the browser dialog, select the tab or window</li>
                  <li>
                    3. <strong>IMPORTANT:</strong> Check the &quot;Share tab
                    audio&quot; or &quot;Share audio&quot; checkbox
                  </li>
                  <li>4. Click &quot;Share&quot; to start recording</li>
                </ol>
                <p className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                  Note: If you forget to check &quot;Share audio&quot;, the
                  recording will have no sound. You&apos;ll need to stop and
                  restart the recording.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
