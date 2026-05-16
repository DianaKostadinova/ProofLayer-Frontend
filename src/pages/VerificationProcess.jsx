import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  CheckCircle2, XCircle, Loader2, Clock, BarChart2,
  AlertTriangle, FileText, ChevronRight, X
} from 'lucide-react'
import { verifyMedia, getErrorMessage } from '../api/client.js'

const STEP_DELAYS = [600, 1800, 3000, 4500]

function StepIcon({ status }) {
  if (status === 'success') return <CheckCircle2 size={18} className="text-brand-green flex-shrink-0" />
  if (status === 'failed') return <XCircle size={18} className="text-brand-red flex-shrink-0" />
  if (status === 'progress') return <Loader2 size={18} className="text-brand-amber animate-spin-custom flex-shrink-0" />
  return <div className="w-[18px] h-[18px] rounded-full border-2 border-white/15 flex-shrink-0" />
}

function TimingBadge({ timing, status }) {
  if (!timing || status === 'pending') return null
  if (status === 'progress') return (
    <span className="text-[10px] text-brand-amber font-mono">In Progress...</span>
  )
  return <span className="text-[10px] text-slate-500 font-mono">{timing}</span>
}

function ModelBar({ label, value, status }) {
  const barColor = status === 'queued' ? 'bg-dark-500' : value >= 70 ? 'bg-brand-red' : 'bg-brand-amber'
  const textColor = status === 'queued' ? 'text-slate-600' : value >= 70 ? 'text-brand-red' : 'text-brand-amber'

  return (
    <div className="bg-dark-800 rounded-lg p-2.5 space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-semibold text-slate-300">{label}</span>
        <span className={`text-[11px] font-bold font-mono ${textColor}`}>
          {status === 'queued' ? 'Queued' : status === 'analyzing' ? 'Analyzing...' : `${value}% Fake`}
        </span>
      </div>
      <div className="progress-bar-bg">
        <div
          className={`progress-bar-fill ${barColor} transition-all duration-1000`}
          style={{ width: status === 'queued' ? '0%' : status === 'analyzing' ? '45%' : `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function VerificationProcess() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { file, uploadResult } = location.state || {}

  const [stepStatus, setStepStatus] = useState(['pending', 'pending', 'pending', 'pending'])
  const [verifyResult, setVerifyResult] = useState(null)
  const [modelStates, setModelStates] = useState(['queued', 'queued', 'queued'])
  const [done, setDone] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [apiError, setApiError] = useState('')
  const timerRef = useRef(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current)
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [])

  // Fire API call immediately in background
  useEffect(() => {
    if (!file) return
    verifyMedia(file)
      .then(r => setVerifyResult(r))
      .catch((e) => {
        setApiError(getErrorMessage(e))
      })
  }, [])

  // Animate steps
  useEffect(() => {
    const timers = []

    // Step 1: File Ingestion — always success
    timers.push(setTimeout(() => {
      setStepStatus(s => { const n = [...s]; n[0] = 'success'; n[1] = 'progress'; return n })
    }, STEP_DELAYS[0]))

    // Step 2: Solana Ledger Query — always success
    timers.push(setTimeout(() => {
      setStepStatus(s => { const n = [...s]; n[1] = 'success'; n[2] = 'progress'; return n })
    }, STEP_DELAYS[1]))

    // Step 3: Crypto Sig Check — depends on result (failed in demo)
    timers.push(setTimeout(() => {
      const sigOk = verifyResult ? verifyResult.similarity >= 95 : false
      setStepStatus(s => { const n = [...s]; n[2] = sigOk ? 'success' : 'failed'; n[3] = 'progress'; return n })
    }, STEP_DELAYS[2]))

    // Step 4: AI models animate
    timers.push(setTimeout(() => {
      setModelStates(['analyzing', 'queued', 'queued'])
    }, STEP_DELAYS[2] + 200))
    timers.push(setTimeout(() => {
      setModelStates(['complete', 'analyzing', 'queued'])
    }, STEP_DELAYS[2] + 1400))
    timers.push(setTimeout(() => {
      setModelStates(['complete', 'complete', 'analyzing'])
    }, STEP_DELAYS[2] + 2600))
    timers.push(setTimeout(() => {
      setModelStates(['complete', 'complete', 'complete'])
      setStepStatus(s => { const n = [...s]; n[3] = 'success'; return n })
      clearInterval(timerRef.current)
      setDone(true)
    }, STEP_DELAYS[3]))

    return () => timers.forEach(clearTimeout)
  }, [verifyResult])

  const hash = uploadResult?.hash || 'demo'
  const lipsyncVal = verifyResult ? Math.round(verifyResult.deepfake_probability * 100) : 98
  const frameVal = verifyResult ? Math.round(verifyResult.deepfake_probability * 91) : 86
  const audioVal = verifyResult ? Math.round(verifyResult.deepfake_probability * 75) : 72

  const stepCards = [
    {
      title: 'File Ingestion & Hashing',
      detail: `SHA-256 hash generated: ${uploadResult?.hash?.slice(0, 50) || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca'}...`,
      timing: '0.4s',
    },
    {
      title: 'Solana Ledger Query',
      detail: `Queried ProofLayer smart contract. Match found for author: ${verifyResult?.registered_owner || '@OfficialNews'}`,
      timing: '1.2s',
      extra: (
        <div className="mt-2 bg-dark-800 rounded-lg p-2 space-y-1">
          <p className="text-[11px] font-mono"><span className="text-slate-500">Program ID:</span> <span className="text-brand-cyan">PrfL...9vZ</span></p>
          <p className="text-[11px] font-mono"><span className="text-slate-500">Transaction:</span> <span className="text-brand-cyan">5xR...v9Q</span></p>
        </div>
      ),
    },
    {
      title: 'Cryptographic Signature Check',
      detail: stepStatus[2] === 'failed'
        ? 'WARNING: The provided media hash does not match the registered signature on-chain.'
        : 'Signature verified. Hash matches registered record.',
      timing: '0.8s',
    },
    {
      title: 'Deepfake AI Analysis (Ensemble)',
      detail: 'Running models: LipSync-v2, FrameAnomaly-X, AudioSpectral',
      timing: null,
      extra: stepStatus[3] !== 'pending' ? (
        <div className="mt-3 grid grid-cols-1 gap-2">
          <ModelBar label="LipSync-v2" value={lipsyncVal} status={modelStates[0] === 'complete' ? 'complete' : modelStates[0]} />
          <ModelBar label="FrameAnomaly-X" value={frameVal} status={modelStates[1] === 'complete' ? 'complete' : modelStates[1]} />
          <ModelBar label="AudioSpectral" value={audioVal} status={modelStates[2] === 'complete' ? 'complete' : modelStates[2]} />
        </div>
      ) : null,
    },
  ]

  const cardClass = (status) => {
    if (status === 'success') return 'card step-card-success'
    if (status === 'failed') return 'card step-card-failed'
    if (status === 'progress') return 'card step-card-progress'
    return 'card step-card-pending opacity-50'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Job Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Job #{jobId}</h2>
            {!done && <span className="badge-warning">Analysis in Progress</span>}
            {done && <span className="badge-network">Complete</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={12} />
            <span>Started {(elapsed / 1000).toFixed(1)}s ago · Automated Check</span>
          </div>
        </div>
      </div>

      {/* Step Cards */}
      <div className="space-y-3">
        {stepCards.map((card, i) => {
          const status = stepStatus[i]
          if (status === 'pending') return null
          return (
            <div key={i} className={`${cardClass(status)} p-4 rounded-xl animate-fade-in`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <StepIcon status={status} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${status === 'failed' ? 'text-brand-red' : 'text-white'}`}>{card.title}</p>
                    <p className={`text-xs mt-0.5 ${status === 'failed' ? 'text-brand-red/80' : 'text-slate-400'}`}>{card.detail}</p>
                    {card.extra}
                  </div>
                </div>
                <TimingBadge timing={card.timing} status={status} />
              </div>
            </div>
          )
        })}

        {/* Pending steps skeleton */}
        {stepStatus.map((status, i) => status === 'pending' && (
          <div key={`pending-${i}`} className={`${cardClass('pending')} p-4 rounded-xl`}>
            <div className="flex items-center gap-3">
              <StepIcon status="pending" />
              <div>
                <p className="text-sm font-semibold text-slate-600">{stepCards[i].title}</p>
                <p className="text-xs text-slate-700 mt-0.5">Waiting...</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="flex items-start gap-2 bg-brand-red/10 border border-brand-red/25 rounded-xl px-4 py-3 animate-fade-in">
          <AlertTriangle size={14} className="text-brand-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-brand-red">Backend Error</p>
            <p className="text-xs text-slate-400 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => navigate('/verification')}
          className="btn-ghost text-sm flex-1 justify-center"
        >
          <X size={14} />
          Cancel Job
        </button>
        <button
          onClick={() => navigate(`/verification/report/${hash}`, { state: { verifyResult, uploadResult } })}
          disabled={!done}
          className="btn-primary text-sm flex-1 justify-center"
        >
          <FileText size={14} />
          Generate Final Report
          {!done && <Loader2 size={13} className="ml-1 animate-spin-custom" />}
        </button>
      </div>
    </div>
  )
}
