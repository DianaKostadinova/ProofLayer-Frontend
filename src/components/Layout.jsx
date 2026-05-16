import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FilePlus2, ShieldCheck, GitBranch, BarChart3,
  Settings, Menu, Copy, Check, WifiOff
} from 'lucide-react'
import WalletButton from './WalletButton.jsx'
import { checkHealth } from '../api/client.js'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/register', label: 'Register Media', icon: FilePlus2 },
  { to: '/verification', label: 'Verification', icon: ShieldCheck },
  { to: '/provenance', label: 'Provenance', icon: GitBranch },
  { to: '/trust-scores', label: 'Trust Scores', icon: BarChart3 },
]

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/register': 'Register Media',
  '/verification': 'Verification',
  '/provenance': 'Provenance',
  '/trust-scores': 'Trust Scores',
  '/settings': 'Settings',
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/verification/process')) return 'Verification Process Flow'
  if (pathname.startsWith('/verification/forensics')) return 'Visual Forensics'
  if (pathname.startsWith('/verification/report')) return 'AI Verification Analysis'
  return PAGE_TITLES[pathname] || 'ProofLayer'
}

const SESSION_ID = '0x9f...3a9c'
const WALLET_ADDR = '0x4d...f291'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking' | 'online' | 'offline'
  const location = useLocation()

  useEffect(() => {
    async function ping() {
      try {
        await checkHealth()
        setBackendStatus('online')
      } catch {
        setBackendStatus('offline')
      }
    }
    ping()
    const interval = setInterval(ping, 15000)
    return () => clearInterval(interval)
  }, [])

  const pageTitle = getPageTitle(location.pathname)

  function copyId() {
    navigator.clipboard.writeText(SESSION_ID).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-[#0d1117] border-r border-white/[0.06] w-[220px] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
        <img src="/logo.svg" alt="ProofLayer" className="w-8 h-8 flex-shrink-0" />
        <span className="text-[15px] font-bold text-brand-green tracking-wide">ProofLayer</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Menu</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] px-3 py-3">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        >
          <Settings size={16} />
          <span>Settings</span>
        </NavLink>
        <div className="flex items-center gap-3 px-3 pt-3 pb-1">
          <div className="w-7 h-7 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-xs font-bold flex-shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate">admin@prooflayer.io</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-[#080b12] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        {sidebar}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="flex animate-slide-in">
            {sidebar}
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* TopBar */}
        <header className="flex items-center gap-2 px-3 py-2.5 bg-[#0d1117] border-b border-white/[0.06] flex-shrink-0 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">{pageTitle}</h1>
          </div>

          {/* ID badge — sm+ only */}
          <button
            onClick={copyId}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
          >
            ID: {SESSION_ID}
            {copied ? <Check size={11} className="text-brand-green" /> : <Copy size={11} />}
          </button>

          {/* Network badge — full on sm+, dot-only on mobile */}
          <span className="badge-network flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-slow flex-shrink-0" />
            <span className="hidden sm:inline">Mainnet Beta</span>
          </span>

          {/* Backend status */}
          {backendStatus === 'offline' && (
            <span className="badge-danger flex-shrink-0 hidden sm:inline-flex">
              <WifiOff size={10} />
              API Offline
            </span>
          )}
          {backendStatus === 'offline' && (
            <WifiOff size={14} className="text-brand-red sm:hidden flex-shrink-0" />
          )}

          <WalletButton compact />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
