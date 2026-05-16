import React, { useRef, useState, useEffect } from 'react'
import { Camera, SwitchCamera, X, CheckCircle2, RotateCcw } from 'lucide-react'

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [facing, setFacing] = useState('environment')
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [facing])

  async function startCamera() {
    stopCamera()
    setReady(false)
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setReady(true)
        }
      }
    } catch (err) {
      setError('Camera access denied or unavailable.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  function takePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setSnapshot(dataUrl)
    stopCamera()
  }

  function retake() {
    setSnapshot(null)
    startCamera()
  }

  function confirm() {
    if (!snapshot) return
    canvas.current?.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCapture?.(file)
      }
    }, 'image/jpeg', 0.9)

    // fallback: convert dataUrl → blob manually
    fetch(snapshot)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCapture?.(file)
      })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-900/80 backdrop-blur-sm">
        <button onClick={() => { stopCamera(); onClose?.() }} className="text-slate-400 hover:text-white">
          <X size={22} />
        </button>
        <span className="text-sm font-semibold text-white">Take Photo</span>
        {!snapshot && (
          <button
            onClick={() => setFacing(f => f === 'environment' ? 'user' : 'environment')}
            className="text-slate-400 hover:text-white"
          >
            <SwitchCamera size={20} />
          </button>
        )}
        {snapshot && <div className="w-6" />}
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {!snapshot && (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
        )}
        {snapshot && (
          <img src={snapshot} alt="captured" className="w-full h-full object-cover" />
        )}
        {!ready && !snapshot && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
            <div className="w-8 h-8 border-2 border-brand-green/40 border-t-brand-green rounded-full animate-spin-custom" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900 px-6 text-center">
            <Camera size={40} className="text-slate-600 mb-3" />
            <p className="text-slate-300 text-sm">{error}</p>
          </div>
        )}

        {/* Viewfinder corners */}
        {!snapshot && ready && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-brand-green/60 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-brand-green/60 rounded-tr-lg" />
            <div className="absolute bottom-24 left-8 w-12 h-12 border-l-2 border-b-2 border-brand-green/60 rounded-bl-lg" />
            <div className="absolute bottom-24 right-8 w-12 h-12 border-r-2 border-b-2 border-brand-green/60 rounded-br-lg" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 px-8 py-6 bg-dark-900/80 backdrop-blur-sm">
        {!snapshot ? (
          <button
            onClick={takePhoto}
            disabled={!ready}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full border-4 border-dark-900" />
          </button>
        ) : (
          <>
            <button
              onClick={retake}
              className="flex items-center gap-2 btn-ghost text-sm"
            >
              <RotateCcw size={15} />
              Retake
            </button>
            <button
              onClick={confirm}
              className="flex items-center gap-2 btn-primary text-sm"
            >
              <CheckCircle2 size={15} />
              Use Photo
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
