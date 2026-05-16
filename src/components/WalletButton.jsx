import React, { useState } from 'react'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'

export default function WalletButton({ compact = false }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [open, setOpen] = useState(false)

  async function connect() {
    setConnecting(true)
    try {
      if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect()
        const addr = resp.publicKey.toString()
        setAddress(addr)
        setConnected(true)
      } else {
        // Demo mode: simulate connected wallet
        setAddress('0x4d...f291')
        setConnected(true)
      }
    } catch {
      // User rejected
    } finally {
      setConnecting(false)
    }
  }

  function disconnect() {
    setConnected(false)
    setAddress('')
    setOpen(false)
    if (window.solana) window.solana.disconnect().catch(() => {})
  }

  function truncate(addr) {
    if (!addr) return ''
    return addr.length > 10 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr
  }

  if (!connected) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="flex items-center gap-2 bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green/20 transition-all rounded-lg px-3 py-1.5 text-xs font-semibold"
      >
        <Wallet size={13} />
        {connecting ? 'Connecting...' : compact ? 'Connect' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-dark-600 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all rounded-lg px-3 py-1.5 text-xs font-mono"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
        {compact ? truncate(address) : address}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 card p-1 z-50 animate-fade-in">
          <button
            onClick={disconnect}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={13} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
