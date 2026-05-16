import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, GitBranch, ExternalLink, CheckCircle2, Clock, Wallet, File } from 'lucide-react'

const DEMO_RECORDS = [
  {
    hash: 'e3b0c44298fc1c149afbf4c8',
    cid: 'QmXoypiz...Wko6uco',
    wallet: '4xG9...mPk2',
    tx: '5Kyq9...v3Bz',
    file: 'election_speech_oct24.mp4',
    registeredAt: 'Oct 24, 2023 · 14:32',
    onChain: true,
  },
  {
    hash: 'a1b2c3d4e5f6a7b8c9d0e1f2',
    cid: 'QmAbcDef...Xyz1234',
    wallet: '7rT2...nQp8',
    tx: '3Lmn...k9Yw',
    file: 'press_conference_v2.png',
    registeredAt: 'Oct 22, 2023 · 09:15',
    onChain: true,
  },
  {
    hash: 'f8e7d6c5b4a3928190817263',
    cid: 'QmXyzAbc...Def5678',
    wallet: '9kP5...wRt1',
    tx: 'MOCK_demo_entry',
    file: 'satellite_image_10_21.jpg',
    registeredAt: 'Oct 21, 2023 · 17:04',
    onChain: false,
  },
]

export default function Provenance() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = DEMO_RECORDS.filter(r =>
    !query || r.hash.includes(query) || r.file.toLowerCase().includes(query.toLowerCase()) || r.wallet.includes(query)
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-white">Provenance Registry</h2>
        <p className="text-sm text-slate-400 mt-0.5">Browse all media records anchored on the Solana blockchain.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by hash, filename, or wallet…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-dark-700 border border-white/08 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-green/40 transition-colors"
        />
      </div>

      {/* Records */}
      <div className="space-y-3">
        {filtered.map((rec, i) => (
          <div key={rec.hash} className="card p-4 hover:border-brand-green/20 transition-all animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-dark-600 border border-white/08 flex items-center justify-center flex-shrink-0">
                  <File size={15} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{rec.file}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-500">{rec.hash.slice(0, 20)}...</span>
                    {rec.onChain
                      ? <span className="badge-network text-[10px] px-1.5 py-0.5"><CheckCircle2 size={9} /> On-Chain</span>
                      : <span className="badge-warning text-[10px] px-1.5 py-0.5">Demo</span>
                    }
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/verification/report/${rec.hash}`)}
                  className="btn-ghost text-xs"
                >
                  View Report
                </button>
                <a
                  href={`https://explorer.solana.com/tx/${rec.tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs"
                >
                  <ExternalLink size={11} />
                  Explorer
                </a>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <Wallet size={11} className="text-slate-600 flex-shrink-0" />
                <span className="text-[11px] font-mono text-slate-400">{rec.wallet}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitBranch size={11} className="text-slate-600 flex-shrink-0" />
                <span className="text-[11px] font-mono text-brand-cyan truncate">{rec.cid}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-slate-600 flex-shrink-0" />
                <span className="text-[11px] text-slate-500">{rec.registeredAt}</span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-10 text-center">
            <GitBranch size={28} className="text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No records found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
