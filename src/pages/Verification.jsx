import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Camera, Upload, Loader2, Info } from 'lucide-react'
import UploadBox from '../components/UploadBox.jsx'
import CameraCapture from '../components/CameraCapture.jsx'
import { uploadMedia } from '../api/client.js'

function genJobId() {
  return `JOB-${Math.floor(Math.random() * 900 + 100)}-${['VX', 'AX', 'TX'][Math.floor(Math.random() * 3)]}`
}

export default function Verification() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startVerification() {
    if (!file) return
    setLoading(true)
    setError('')
    const jobId = genJobId()
    try {
      const uploadResult = await uploadMedia(file)
      navigate(`/verification/process/${jobId}`, { state: { file, uploadResult } })
    } catch {
      // Demo fallback
      navigate(`/verification/process/${jobId}`, {
        state: {
          file,
          uploadResult: {
            hash: 'a1b...7f2x_' + Date.now(),
            cid: 'QmDemo...',
            phash: 'f1f2f3f4f5f6f7f8',
            filename: file.name,
            size_bytes: file.size,
          },
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white">Verify Media Authenticity</h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload suspicious media. ProofLayer will run a multi-layer check: blockchain provenance, cryptographic signature, and AI deepfake analysis.
        </p>
      </div>

      {/* Upload Card */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={15} className="text-brand-green" />
          <span className="text-sm font-semibold text-white">Upload Suspicious Media</span>
        </div>

        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 btn-ghost text-sm flex-1 justify-center"
          >
            <Camera size={14} />
            Take Photo
          </button>
          <button
            onClick={() => document.getElementById('verify-file-input')?.click()}
            className="flex items-center gap-2 btn-ghost text-sm flex-1 justify-center"
          >
            <Upload size={14} />
            Browse File
          </button>
        </div>

        <UploadBox
          onFile={f => { setFile(f); setError('') }}
          label="Drop suspicious image or video here"
        />

        <input
          id="verify-file-input"
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f) }}
        />

        {error && <p className="text-xs text-brand-red">{error}</p>}

        <button
          onClick={startVerification}
          disabled={!file || loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? <Loader2 size={15} className="animate-spin-custom" /> : <ShieldCheck size={15} />}
          {loading ? 'Preparing Analysis...' : 'Start Verification'}
        </button>
      </div>

      {/* What happens next */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-slate-500" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Pipeline</span>
        </div>
        <div className="space-y-2">
          {[
            { n: 1, title: 'File Ingestion & Hashing', desc: 'SHA-256 + perceptual hash generated' },
            { n: 2, title: 'Solana Ledger Query', desc: 'ProofLayer smart contract queried for matching hash' },
            { n: 3, title: 'Cryptographic Signature Check', desc: 'On-chain hash vs uploaded hash comparison' },
            { n: 4, title: 'Deepfake AI Analysis', desc: 'Ensemble models: LipSync, FrameAnomaly, AudioSpectral' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0 mt-0.5">{n}</div>
              <div>
                <p className="text-xs font-semibold text-slate-300">{title}</p>
                <p className="text-[11px] text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={f => { setFile(f); setShowCamera(false) }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}
