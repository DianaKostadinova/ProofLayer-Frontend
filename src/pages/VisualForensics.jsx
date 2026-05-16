import React, { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, Upload, Flag, Database, Eye, Volume2, Info, ArrowLeft } from 'lucide-react'

const TABS = [
  { id: 'visual', label: 'Visual Diff', icon: Eye },
  { id: 'audio', label: 'Audio Track', icon: Volume2 },
  { id: 'metadata', label: 'Metadata', icon: Info },
]

const DEMO_ANOMALIES = [
  { x: '58%', y: '20%', label: 'Lip-sync anomaly (98%)', color: 'bg-brand-red border-brand-red' },
  { x: '72%', y: '45%', label: 'Facial artifact (94%)', color: 'bg-brand-amber border-brand-amber' },
]

const METADATA_ROWS = [
  ['Format', 'MP4 / H.264', 'MP4 / H.265'],
  ['Resolution', '1920×1080', '1920×1080'],
  ['Duration', '02:14', '02:14'],
  ['Created', 'Oct 24, 2023 14:32', 'Oct 25, 2023 03:17'],
  ['Camera Model', 'Sony A7III', 'Unknown (modified)'],
  ['GPS Data', 'Washington DC', 'None (stripped)'],
  ['Compression', 'Standard', 'High (re-encoded)'],
]

export default function VisualForensics() {
  const { hash } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyResult } = location.state || {}
  const [tab, setTab] = useState('visual')
  const [flagged, setFlagged] = useState(false)

  const fakePercent = verifyResult ? Math.round(verifyResult.deepfake_probability * 100) : 85

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Comparing suspicious upload against verified Solana provenance registry.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === id ? 'bg-dark-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Visual Diff */}
      {tab === 'visual' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Verified Original */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-brand-green" />
                  <span className="text-xs font-semibold text-brand-green">Verified Original</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Solana: 8f2...9c4a</span>
              </div>
              <div className="relative bg-dark-900" style={{ aspectRatio: '16/9' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck size={28} className="text-brand-green/60" />
                    </div>
                    <p className="text-xs text-slate-500">Verified_Broadcast_v1.mp4</p>
                    <p className="text-[10px] text-slate-600 mt-1">Anchored Oct 24, 2023</p>
                  </div>
                </div>
                {/* Simulated news image bg */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-blue-900 via-slate-800 to-slate-900" />
              </div>
            </div>

            {/* Uploaded Media */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Upload size={13} className="text-brand-amber" />
                  <span className="text-xs font-semibold text-brand-amber">Uploaded Media</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Hash: {hash?.slice(0, 8) || 'a1b...7f2x'}</span>
              </div>
              <div className="relative bg-dark-900" style={{ aspectRatio: '16/9' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                <div className="absolute inset-0 opacity-25 bg-gradient-to-b from-blue-800 via-slate-700 to-slate-900" />

                {/* Anomaly Markers */}
                {DEMO_ANOMALIES.map((a, i) => (
                  <div key={i} className="absolute" style={{ left: a.x, top: a.y }}>
                    <div className={`w-20 h-20 rounded-full border-2 ${a.color} opacity-70 -translate-x-1/2 -translate-y-1/2`} />
                    <div className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold px-1.5 py-0.5 rounded ${a.color} bg-opacity-90 text-dark-900`}>
                      {a.label}
                    </div>
                  </div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Upload size={28} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Suspicious_Upload.mp4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Bar */}
          <div className={`card p-4 flex flex-col sm:flex-row items-center gap-4 ${fakePercent >= 70 ? 'step-card-failed' : 'step-card-success'}`}>
            {/* Circular indicator */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke={fakePercent >= 70 ? '#ef4444' : '#10b981'}
                  strokeWidth="8"
                  strokeDasharray={`${(fakePercent / 100) * 163} 163`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${fakePercent >= 70 ? 'text-brand-red' : 'text-brand-green'}`}>{fakePercent}%</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className={`text-sm font-bold ${fakePercent >= 70 ? 'text-brand-red' : 'text-brand-green'}`}>
                {fakePercent >= 70 ? 'Critical Deviations Found' : 'Minor Deviations Detected'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                AI models detected significant artifacts in facial regions and audio-visual synchronization compared to the on-chain verified original.
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0 flex-wrap justify-center">
              <button className="btn-ghost text-xs">
                <Database size={12} />
                View Raw Data
              </button>
              <button
                onClick={() => setFlagged(f => !f)}
                className={`text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg border font-semibold transition-all
                  ${flagged ? 'bg-brand-red/20 border-brand-red/40 text-brand-red' : 'btn-danger'}`}
              >
                <Flag size={12} />
                {flagged ? 'Flagged ✓' : 'Flag as Malicious'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Track Tab */}
      {tab === 'audio' && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <p className="text-sm font-semibold text-white">Audio Waveform Comparison</p>
          <div className="space-y-3">
            {['Original Audio', 'Suspicious Audio'].map((label, idx) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-2">{label}</p>
                <div className="flex items-center gap-1 h-12">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const h = Math.abs(Math.sin(i * 0.4 + idx)) * 40 + 5
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${idx === 0 ? 'bg-brand-green/50' : i > 30 && i < 45 ? 'bg-brand-red/70' : 'bg-brand-amber/50'}`}
                        style={{ height: `${h}px` }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-brand-red/10 border border-brand-red/20 rounded-lg p-3">
            <p className="text-xs text-brand-red font-semibold">Audio Sync Anomaly Detected (frames 940–1350)</p>
            <p className="text-xs text-slate-400 mt-1">86% probability of audio track replacement in the flagged segment.</p>
          </div>
        </div>
      )}

      {/* Metadata Tab */}
      {tab === 'metadata' && (
        <div className="card overflow-hidden animate-fade-in">
          <div className="grid grid-cols-3 gap-0 text-xs">
            <div className="px-4 py-2 bg-dark-600 text-slate-400 font-semibold border-b border-white/[0.06]">Field</div>
            <div className="px-4 py-2 bg-dark-600 text-brand-green font-semibold border-b border-white/[0.06]">Original</div>
            <div className="px-4 py-2 bg-dark-600 text-brand-amber font-semibold border-b border-white/[0.06]">Uploaded</div>
            {METADATA_ROWS.map(([field, orig, susp], i) => {
              const mismatch = orig !== susp
              return (
                <React.Fragment key={field}>
                  <div className={`px-4 py-2.5 text-slate-500 ${i % 2 === 0 ? '' : 'bg-white/[0.01]'} border-b border-white/[0.04]`}>{field}</div>
                  <div className={`px-4 py-2.5 text-slate-300 font-mono ${i % 2 === 0 ? '' : 'bg-white/[0.01]'} border-b border-white/[0.04]`}>{orig}</div>
                  <div className={`px-4 py-2.5 font-mono ${mismatch ? 'text-brand-red' : 'text-slate-300'} ${i % 2 === 0 ? '' : 'bg-white/[0.01]'} border-b border-white/[0.04]`}>{susp}</div>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
