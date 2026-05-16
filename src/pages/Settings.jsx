import React, { useState } from 'react'
import { Settings as SettingsIcon, Globe, Bell, Shield, Key, Save } from 'lucide-react'

export default function Settings() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000')
  const [network, setNetwork] = useState('mainnet-beta')
  const [notifications, setNotifications] = useState(true)
  const [autoVerify, setAutoVerify] = useState(false)
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-brand-green' : 'bg-dark-500 border border-white/10'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">Configure ProofLayer network and application preferences.</p>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Globe size={14} className="text-brand-green" />
          <h3 className="text-sm font-semibold text-white">Network</h3>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1.5">API Endpoint</label>
          <input
            type="text"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            className="w-full bg-dark-700 border border-white/08 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green/40 font-mono transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1.5">Solana Network</label>
          <select
            value={network}
            onChange={e => setNetwork(e.target.value)}
            className="w-full bg-dark-700 border border-white/08 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green/40 transition-colors"
          >
            <option value="mainnet-beta">Mainnet Beta</option>
            <option value="devnet">Devnet</option>
            <option value="testnet">Testnet</option>
          </select>
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Bell size={14} className="text-brand-amber" />
          <h3 className="text-sm font-semibold text-white">Preferences</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Verification Notifications</p>
            <p className="text-xs text-slate-500">Alert when verification completes</p>
          </div>
          <Toggle value={notifications} onChange={setNotifications} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Auto-Verify on Upload</p>
            <p className="text-xs text-slate-500">Run deepfake check automatically</p>
          </div>
          <Toggle value={autoVerify} onChange={setAutoVerify} />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Key size={14} className="text-brand-cyan" />
          <h3 className="text-sm font-semibold text-white">API Keys</h3>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1.5">Pinata JWT</label>
          <input
            type="password"
            placeholder="eyJ..."
            className="w-full bg-dark-700 border border-white/08 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none focus:border-brand-green/40 font-mono transition-colors"
          />
        </div>
      </div>

      <button onClick={save} className="btn-primary w-full justify-center">
        <Save size={14} />
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
