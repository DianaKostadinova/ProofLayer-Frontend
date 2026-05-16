import React, { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Minus, Shield, Award, AlertTriangle } from 'lucide-react'

const SOURCES = [
  { rank: 1, name: '@GlobalNewsNetwork', handles: 847, verified: 812, score: 95.9, trend: 2.1, badge: 'Elite' },
  { rank: 2, name: '@PressWire_Official', handles: 1203, verified: 1143, score: 94.1, trend: 0.8, badge: 'Elite' },
  { rank: 3, name: '@OfficialNews', handles: 320, verified: 294, score: 91.9, trend: -1.2, badge: 'Trusted' },
  { rank: 4, name: '@FieldReporter_7', handles: 78, verified: 69, score: 88.4, trend: 3.5, badge: 'Trusted' },
  { rank: 5, name: '@CityDesk_Live', handles: 445, verified: 384, score: 86.3, trend: -0.5, badge: 'Trusted' },
  { rank: 6, name: '@IndieMedia_Co', handles: 112, verified: 92, score: 82.1, trend: 1.1, badge: 'Moderate' },
  { rank: 7, name: '@NewsFlash24', handles: 2104, verified: 1648, score: 78.3, trend: -4.2, badge: 'Moderate' },
  { rank: 8, name: '@AnonSource_X', handles: 55, verified: 22, score: 40.0, trend: -8.1, badge: 'Low' },
]

function Badge({ label }) {
  const styles = {
    Elite: 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan',
    Trusted: 'bg-brand-green/10 border-brand-green/30 text-brand-green',
    Moderate: 'bg-brand-amber/10 border-brand-amber/30 text-brand-amber',
    Low: 'bg-brand-red/10 border-brand-red/30 text-brand-red',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styles[label] || styles.Moderate}`}>
      {label}
    </span>
  )
}

function ScoreBar({ value }) {
  const color = value >= 90 ? 'bg-brand-cyan' : value >= 75 ? 'bg-brand-green' : value >= 50 ? 'bg-brand-amber' : 'bg-brand-red'
  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar-bg flex-1" style={{ height: '4px' }}>
        <div className={`progress-bar-fill ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold font-mono text-slate-300 w-10 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

export default function TrustScores() {
  const [filter, setFilter] = useState('all')

  const FILTERS = ['all', 'Elite', 'Trusted', 'Moderate', 'Low']
  const filtered = filter === 'all' ? SOURCES : SOURCES.filter(s => s.badge === filter)

  const avg = (SOURCES.reduce((a, s) => a + s.score, 0) / SOURCES.length).toFixed(1)
  const elite = SOURCES.filter(s => s.badge === 'Elite' || s.badge === 'Trusted').length
  const risky = SOURCES.filter(s => s.badge === 'Low').length

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-white">Trust Scores</h2>
        <p className="text-sm text-slate-400 mt-0.5">Ranked source authenticity based on on-chain verification history.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="card p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 size={12} className="text-brand-cyan flex-shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-500 truncate">Avg Score</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{avg}</p>
          <p className="text-[11px] sm:text-xs text-brand-green mt-0.5">+1.4 <span className="hidden sm:inline">this month</span></p>
        </div>
        <div className="card p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Award size={12} className="text-brand-green flex-shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-500 truncate"><span className="hidden sm:inline">Trusted </span>Sources</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{elite}</p>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">of {SOURCES.length}</p>
        </div>
        <div className="card p-3 sm:p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle size={12} className="text-brand-red flex-shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-500 truncate">High Risk</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-brand-red">{risky}</p>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">flagged</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
              ${filter === f ? 'bg-brand-green/15 text-brand-green border border-brand-green/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}
          >
            {f === 'all' ? 'All Sources' : f}
          </button>
        ))}
      </div>

      {/* Leaderboard — desktop table */}
      <div className="card overflow-hidden hidden sm:block">
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-white/[0.06] text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Source</div>
          <div className="col-span-2">Uploads</div>
          <div className="col-span-3">Trust Score</div>
          <div className="col-span-1">Trend</div>
          <div className="col-span-1">Tier</div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {filtered.map((src) => (
            <div key={src.name} className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors">
              <div className="col-span-1">
                <span className={`text-sm font-bold ${src.rank <= 3 ? 'text-brand-amber' : 'text-slate-600'}`}>{src.rank}</span>
              </div>
              <div className="col-span-4">
                <p className="text-xs font-semibold text-white truncate">{src.name}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{src.verified}/{src.handles} verified</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400">{src.handles.toLocaleString()}</p>
              </div>
              <div className="col-span-3">
                <ScoreBar value={src.score} />
              </div>
              <div className="col-span-1">
                <span className={`flex items-center gap-0.5 text-[10px] font-bold ${src.trend > 0 ? 'text-brand-green' : src.trend < 0 ? 'text-brand-red' : 'text-slate-500'}`}>
                  {src.trend > 0 ? <TrendingUp size={10} /> : src.trend < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                  {Math.abs(src.trend)}
                </span>
              </div>
              <div className="col-span-1">
                <Badge label={src.badge} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard — mobile cards */}
      <div className="sm:hidden space-y-2">
        {filtered.map((src) => (
          <div key={src.name} className="card p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold w-5 ${src.rank <= 3 ? 'text-brand-amber' : 'text-slate-600'}`}>{src.rank}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{src.name}</p>
                  <p className="text-[10px] text-slate-600">{src.verified}/{src.handles} verified</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-0.5 text-[10px] font-bold ${src.trend > 0 ? 'text-brand-green' : src.trend < 0 ? 'text-brand-red' : 'text-slate-500'}`}>
                  {src.trend > 0 ? <TrendingUp size={10} /> : src.trend < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                  {Math.abs(src.trend)}
                </span>
                <Badge label={src.badge} />
              </div>
            </div>
            <ScoreBar value={src.score} />
          </div>
        ))}
      </div>
    </div>
  )
}
