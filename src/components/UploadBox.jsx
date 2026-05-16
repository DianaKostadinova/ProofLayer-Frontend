import React, { useRef, useState } from 'react'
import { Upload, ImageIcon, Film, X, CheckCircle2 } from 'lucide-react'

const ACCEPTED = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime'
const MAX_MB = 50

export default function UploadBox({ onFile, label = 'Upload or drag media here', accept = ACCEPTED, className = '' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  function handleFile(f) {
    setError('')
    if (!f) return

    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File too large (max ${MAX_MB} MB)`)
      return
    }

    setFile(f)
    onFile?.(f)

    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  function onInputChange(e) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function clear(e) {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    setError('')
    onFile?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isVideo = file?.type?.startsWith('video/')
  const isImage = file?.type?.startsWith('image/')

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${dragging ? 'drag-over border-brand-green' : 'border-white/10 hover:border-white/20'}
          ${file ? 'border-brand-green/40 bg-brand-green/[0.03]' : 'bg-dark-700/40'}
        `}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* Preview */}
        {preview && isImage && (
          <div className="relative">
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-64 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-brand-green" />
              <span className="text-xs text-white font-medium truncate max-w-[200px]">{file.name}</span>
            </div>
            <button
              onClick={clear}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Video / no preview */}
        {file && !isImage && (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-dark-500 flex items-center justify-center">
                {isVideo ? <Film size={18} className="text-brand-amber" /> : <ImageIcon size={18} className="text-brand-green" />}
              </div>
              <div>
                <p className="text-sm text-white font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
            <button onClick={clear} className="text-slate-500 hover:text-red-400 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!file && (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-dark-600 border border-white/08 flex items-center justify-center mb-4">
              <Upload size={22} className="text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">{label}</p>
            <p className="text-xs text-slate-600">JPEG, PNG, WebP, MP4 — max 50 MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}
