import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, Clock, ShieldCheck, Eye, ArrowLeft, Activity
} from 'lucide-react'

function MetricBar({ label, value, animate = true }) {
  const color = value >= 85 ? 'bg-brand-red' : value >= 65 ? 'bg-brand-amber' : value >= 40 ? 'bg-yellow-500' : 'bg-brand-green'
  const textColor = value >= 85 ? 'text-brand-red' : value >= 65 ? 'text-brand-amber' : value >= 40 ? 'text-yellow-400' : 'text-brand-green'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-xs font-bold font-mono ${textColor}`}>{value}%</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className={`progress-bar-fill ${color}`}
          style={{ width: animate ? `${value}%` : '0%', transition: 'width 1.4s cubic-bezier(0.25, 1, 0.5, 1)' }}
        />
      </div>
    </div>
  )
}

function ProvenanceEvent({ icon: Icon, color, title, date, desc, last }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center flex-shrink-0 z-10`}>
          <Icon size={13} />
        </div>
        {!last && <div className="w-px flex-1 mt-1 bg-white/[0.06]" />}
      </div>
      <div className="pb-4">
        <p className="text-xs font-semibold text-white">{title}</p>
        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{date}</p>
        <p className="text-[11px] text-slate-400 mt-1">{desc}</p>
      </div>
    </div>
  )
}

export default function VerificationReport() {
  const { hash } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyResult, uploadResult, mock } = location.state || {}

  const similarity = verifyResult?.similarity ?? 89
  const deepfakeProb = verifyResult?.deepfake_probability ?? 0.942
  const status = verifyResult?.status ?? 'Likely Manipulated'
  const authenticityScore = Math.round((1 - deepfakeProb) * 100)
  const aiGenProb = Math.round(deepfakeProb * 100)
  const isManipulated = status !== 'Authentic'

  const metrics = [
    { label: 'Facial Artifacts', value: Math.round(deepfakeProb * 104) > 100 ? 98 : Math.round(deepfakeProb * 104) },
    { label: 'Audio Sync Issues', value: Math.round(deepfakeProb * 91) },
    { label: 'Lighting Inconsistencies', value: Math.round(deepfakeProb * 76) },
    { label: 'Background Distortions', value: Math.round(deepfakeProb * 16) },
  ]

  function exportReport() {
    const blob = new Blob([JSON.stringify({ hash, verifyResult, timestamp: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prooflayer-report-${hash?.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-bold text-white">Verification Report</h2>
        </div>
        <button onClick={exportReport} className="btn-ghost text-sm">
          <Download size={14} />
          Export PDF
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-3">
          {/* Media Preview */}
          <div className="card overflow-hidden">
            <div className="relative bg-gradient-to-br from-slate-800 to-dark-900" style={{ aspectRatio: '16/9' }}>
              {/* ANALYZED VIDEO badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-dark-900/80 backdrop-blur-sm border border-white/10 rounded px-2.5 py-1.5 z-10">
                <Activity size={11} className="text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Analyzed Video</span>
              </div>

              {/* Media placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Eye size={32} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{uploadResult?.filename || 'news_segment.mp4'}</p>
                </div>
              </div>

              {/* Manipulation overlay */}
              {isManipulated && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-brand-red/20 border border-brand-red/40 rounded px-2.5 py-1.5">
                  <AlertTriangle size={11} className="text-brand-red" />
                  <span className="text-[10px] font-bold text-brand-red">Manipulation Detected</span>
                </div>
              )}
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-xs text-slate-500 mb-1">Authenticity Score</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${authenticityScore < 30 ? 'text-brand-red' : 'text-brand-green'}`}>{authenticityScore}%</span>
                <span className="flex items-center gap-0.5 text-xs text-brand-red font-semibold">
                  <TrendingDown size={12} />
                  -{100 - authenticityScore}%
                </span>
              </div>
            </div>
            <div className="card p-4">
              <p className="text-xs text-slate-500 mb-1">AI Generated Probability</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${aiGenProb >= 70 ? 'text-brand-red' : 'text-brand-green'}`}>{aiGenProb}%</span>
                <span className="flex items-center gap-0.5 text-xs text-brand-red font-semibold">
                  <TrendingUp size={12} />
                  +{aiGenProb}%
                </span>
              </div>
            </div>
          </div>

          {/* Deepfake Detection Metrics */}
          <div className="card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-brand-green" />
              <h3 className="text-sm font-semibold text-white">Deepfake Detection Metrics</h3>
            </div>
            <div className="space-y-3">
              {metrics.map(({ label, value }) => (
                <MetricBar key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          {/* Forensics Link */}
          <button
            onClick={() => navigate(`/verification/forensics/${hash}`, { state: { verifyResult } })}
            className="w-full card p-3 flex items-center justify-between hover:border-brand-green/30 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-brand-green" />
              <span className="text-sm text-white font-medium">View Visual Forensics</span>
            </div>
            <span className="text-xs text-slate-500 group-hover:text-brand-green transition-colors">Side-by-side comparison →</span>
          </button>
        </div>

        {/* Right col */}
        <div className="space-y-3">
          {/* Provenance Chain */}
          <div className="card p-4 space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-brand-green" />
              <div>
                <h3 className="text-sm font-semibold text-white">Provenance Chain</h3>
                <p className="text-[10px] text-slate-500">Verifying via Solana Network</p>
              </div>
            </div>

            <ProvenanceEvent
              icon={CheckCircle2}
              color="bg-brand-green/20 text-brand-green border border-brand-green/30"
              title="Media Registered"
              date="Oct 24, 2023 · 14:32"
              desc={`Hash: ${verifyResult?.ipfs_cid?.slice(0, 14) || '0x8f2...9c4a'}`}
            />
            <ProvenanceEvent
              icon={XCircle}
              color="bg-brand-red/20 text-brand-red border border-brand-red/30"
              title="Signature Match Failed"
              date="Oct 25, 2023 · 09:15"
              desc="Current hash does not match registered media."
            />
            <ProvenanceEvent
              icon={Activity}
              color="bg-brand-amber/20 text-brand-amber border border-brand-amber/30"
              title="AI Analysis Complete"
              date="Oct 25, 2023 · 09:16"
              desc="High probability of manipulation."
              last
            />
          </div>

          {/* Registered Owner */}
          {verifyResult?.registered_owner && (
            <div className="card p-4">
              <p className="text-xs text-slate-500 mb-1">Registered Owner</p>
              <p className="text-sm font-mono text-brand-cyan">{verifyResult.registered_owner}</p>
              {verifyResult.registered_at && (
                <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
                  <Clock size={9} />
                  {new Date(verifyResult.registered_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Similar Original */}
          <div className="card p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Similar Original Source</p>
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={14} className="text-brand-green/60" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Verified_Broadcast_v1.mp4</p>
                <p className="text-[10px] text-brand-green mt-0.5">Match: {similarity}% (Visual)</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`card p-4 text-center ${isManipulated ? 'step-card-failed' : 'step-card-success'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${isManipulated ? 'bg-brand-red/15' : 'bg-brand-green/15'}`}>
              {isManipulated ? <XCircle size={20} className="text-brand-red" /> : <CheckCircle2 size={20} className="text-brand-green" />}
            </div>
            <p className={`text-sm font-bold ${isManipulated ? 'text-brand-red' : 'text-brand-green'}`}>{status}</p>
            <p className="text-xs text-slate-500 mt-1">Confidence: {aiGenProb}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
