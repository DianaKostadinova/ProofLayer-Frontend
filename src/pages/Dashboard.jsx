import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, FilePlus2, AlertTriangle, TrendingUp,
  Activity, Clock, ArrowRight, CheckCircle2, XCircle, Minus
} from 'lucide-react'

const STATS = [
  { label: 'Media Registered', value: '2,847', change: '+12%', up: true, icon: FilePlus2, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  { label: 'Verifications Run', value: '14,231', change: '+8%', up: true, icon: ShieldCheck, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
  { label: 'Manipulations Detected', value: '341', change: '+3%', up: false, icon: AlertTriangle, color: 'text-brand-red', bg: 'bg-brand-red/10' },
  { label: 'Avg Trust Score', value: '81.4', change: '+2.1', up: true, icon: TrendingUp, color: 'text-brand-amber', bg: 'bg-brand-amber/10' },
]

const RECENT = [
  { id: 'JOB-992', file: 'news_segment_oct25.mp4', status: 'Manipulated', score: 12, time: '2 min ago', hash: 'a1b7f2x' },
  { id: 'JOB-991', file: 'press_release_v2.png', status: 'Authentic', score: 96, time: '18 min ago', hash: 'c3e9d1a' },
  { id: 'JOB-990', file: 'interview_raw.mp4', status: 'Authentic', score: 88, time: '1 hr ago', hash: 'f8b2c4e' },
  { id: 'JOB-989', file: 'document_scan.jpg', status: 'Unknown', score: 54, time: '3 hr ago', hash: '2d7f9b1' },
  { id: 'JOB-988', file: 'broadcast_clip.mp4', status: 'Manipulated', score: 8, time: '5 hr ago', hash: 'e5a3c7f' },
]

function StatusBadge({ status }) {
  if (status === 'Authentic') return (
    <span className="flex items-center gap-1 text-xs text-brand-green font-medium">
      <CheckCircle2 size={12} /> Authentic
    </span>
  )
  if (status === 'Manipulated') return (
    <span className="flex items-center gap-1 text-xs text-brand-red font-medium">
      <XCircle size={12} /> Manipulated
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
      <Minus size={12} /> Unknown
    </span>
  )
}

function ScorePill({ score }) {
  const color = score >= 70 ? 'text-brand-green bg-brand-green/10' : score >= 40 ? 'text-brand-amber bg-brand-amber/10' : 'text-brand-red bg-brand-red/10'
  return <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${color}`}>{score}%</span>
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="card-elevated rounded-xl p-5 border-l-2 border-brand-green relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full opacity-[0.03] bg-gradient-to-l from-brand-green to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-slow" />
              <span className="text-xs text-brand-green font-semibold tracking-wide">SYSTEM ONLINE · MAINNET BETA</span>
            </div>
            <h2 className="text-lg font-bold text-white">ProofLayer Provenance Network</h2>
            <p className="text-sm text-slate-400 mt-0.5">Decentralized media authenticity powered by Solana</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => navigate('/register')} className="btn-primary text-sm">
              <FilePlus2 size={14} />
              Register Media
            </button>
            <button onClick={() => navigate('/verification')} className="btn-ghost text-sm">
              <ShieldCheck size={14} />
              Verify
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={14} className={color} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className={`text-xs mt-0.5 font-medium ${up ? 'text-brand-green' : 'text-brand-red'}`}>{change} this week</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Verifications */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-brand-green" />
            <h3 className="text-sm font-semibold text-white">Recent Verifications</h3>
          </div>
          <button onClick={() => navigate('/verification')} className="text-xs text-brand-green hover:text-brand-greenLight flex items-center gap-1">
            View all <ArrowRight size={11} />
          </button>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {RECENT.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
              onClick={() => navigate(`/verification/report/${job.hash}`, { state: { mock: true, ...job } })}
            >
              <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0">
                <Activity size={13} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{job.file}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-slate-600">{job.id}</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <Clock size={10} className="text-slate-600" />
                  <span className="text-[10px] text-slate-600">{job.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <ScorePill score={job.score} />
                <StatusBadge status={job.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/register')}
          className="card p-4 text-left hover:border-brand-green/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
              <FilePlus2 size={18} className="text-brand-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Register New Media</p>
              <p className="text-xs text-slate-500 mt-0.5">Upload & anchor on Solana blockchain</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-brand-green transition-colors" />
          </div>
        </button>

        <button
          onClick={() => navigate('/verification')}
          className="card p-4 text-left hover:border-brand-blue/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
              <ShieldCheck size={18} className="text-brand-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Verify Suspicious Media</p>
              <p className="text-xs text-slate-500 mt-0.5">Run AI + blockchain authenticity check</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-brand-blue transition-colors" />
          </div>
        </button>
      </div>
    </div>
  )
}
