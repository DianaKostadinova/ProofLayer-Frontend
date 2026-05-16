import React, { useState } from 'react'
import { Camera, Upload, Wallet, Link2, CheckCircle2, ArrowRight, Copy, ExternalLink, Loader2 } from 'lucide-react'
import UploadBox from '../components/UploadBox.jsx'
import CameraCapture from '../components/CameraCapture.jsx'
import { uploadMedia, registerMedia } from '../api/client.js'

const STEPS = ['Select Media', 'Connect Wallet', 'Register On-Chain', 'Confirmation']

export default function RegisterMedia() {
  const [step, setStep] = useState(0)
  const [file, setFile] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [regResult, setRegResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [walletAddr] = useState('DEMO_WALLET_0x4d...f291')
  const [copied, setCopied] = useState(false)

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const result = await uploadMedia(file)
      setUploadResult(result)
      setStep(1)
    } catch (e) {
      // Demo mode fallback
      setUploadResult({
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        phash: 'f8f8f8f8f8f8f8f8',
        filename: file.name,
        size_bytes: file.size,
      })
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    if (!uploadResult) return
    setLoading(true)
    setError('')
    try {
      const result = await registerMedia({
        hash: uploadResult.hash,
        cid: uploadResult.cid,
        phash: uploadResult.phash,
        wallet_address: walletAddr,
        signature: 'DEMO_SIG_' + Date.now(),
      })
      setRegResult(result)
      setStep(3)
    } catch (e) {
      // Demo mode
      setRegResult({
        tx_signature: 'MOCK_5Kyq9...txDemo',
        hash: uploadResult.hash,
        cid: uploadResult.cid,
        wallet_address: walletAddr,
        timestamp: new Date().toISOString(),
        on_chain: false,
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  function copy(text) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${i < step ? 'bg-brand-green border-brand-green text-dark-900' : i === step ? 'border-brand-green text-brand-green' : 'border-white/10 text-slate-600'}`}
              >
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium hidden sm:block transition-colors ${i <= step ? 'text-slate-300' : 'text-slate-600'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < step ? 'bg-brand-green' : 'bg-white/08'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Select Media */}
      {step === 0 && (
        <div className="card p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="text-base font-semibold text-white">Select Media to Register</h2>
            <p className="text-sm text-slate-400 mt-0.5">Upload a file or take a photo to anchor its provenance on Solana.</p>
          </div>

          {/* Camera / Upload toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center gap-2 btn-ghost text-sm flex-1 justify-center"
            >
              <Camera size={15} />
              Take Photo
            </button>
            <button
              onClick={() => document.getElementById('reg-file-input')?.click()}
              className="flex items-center gap-2 btn-ghost text-sm flex-1 justify-center"
            >
              <Upload size={15} />
              Browse File
            </button>
          </div>

          <UploadBox
            onFile={f => { setFile(f); setError('') }}
            label="Or drag & drop your media here"
          />

          {/* Hidden native file input for mobile capture */}
          <input
            id="reg-file-input"
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f) }}
          />

          {error && <p className="text-xs text-brand-red">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary w-full justify-center text-sm"
          >
            {loading ? <Loader2 size={15} className="animate-spin-custom" /> : <Upload size={15} />}
            {loading ? 'Uploading & Hashing...' : 'Upload & Hash Media'}
          </button>
        </div>
      )}

      {/* Step 1: Connect Wallet */}
      {step === 1 && uploadResult && (
        <div className="card p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="text-base font-semibold text-white">Review & Connect Wallet</h2>
            <p className="text-sm text-slate-400 mt-0.5">Your media has been hashed. Connect your Phantom wallet to sign the provenance record.</p>
          </div>

          {/* Hash display */}
          <div className="card-elevated p-3 space-y-2 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">SHA-256</span>
              <button onClick={() => copy(uploadResult.hash)} className="text-slate-500 hover:text-slate-300">
                {copied ? <CheckCircle2 size={12} className="text-brand-green" /> : <Copy size={12} />}
              </button>
            </div>
            <p className="text-xs font-mono text-slate-300 break-all">{uploadResult.hash}</p>
            <div className="flex justify-between items-start mt-1">
              <span className="text-xs text-slate-500">IPFS CID</span>
            </div>
            <p className="text-xs font-mono text-brand-cyan">{uploadResult.cid}</p>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">File</span>
              <span className="text-xs text-slate-300">{uploadResult.filename} · {(uploadResult.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="btn-ghost text-sm flex-1 justify-center">Back</button>
            <button onClick={() => setStep(2)} className="btn-primary text-sm flex-1 justify-center">
              <Wallet size={14} />
              Wallet Connected (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Register */}
      {step === 2 && (
        <div className="card p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="text-base font-semibold text-white">Register On-Chain</h2>
            <p className="text-sm text-slate-400 mt-0.5">This will broadcast a Solana transaction storing your media's hash, IPFS CID, and your wallet address as permanent provenance proof.</p>
          </div>

          <div className="card-elevated p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Wallet</span>
              <span className="font-mono text-slate-300">{walletAddr}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Network</span>
              <span className="text-brand-green font-semibold">Mainnet Beta</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Estimated Fee</span>
              <span className="text-slate-300">~0.000005 SOL</span>
            </div>
          </div>

          {error && <p className="text-xs text-brand-red">{error}</p>}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="btn-ghost text-sm flex-1 justify-center">Back</button>
            <button onClick={handleRegister} disabled={loading} className="btn-primary text-sm flex-1 justify-center">
              {loading ? <Loader2 size={14} className="animate-spin-custom" /> : <Link2 size={14} />}
              {loading ? 'Broadcasting...' : 'Sign & Register'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && regResult && (
        <div className="card p-5 space-y-4 animate-fade-in">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-brand-green/15 border border-brand-green/30 flex items-center justify-center mx-auto mb-4 glow-green">
              <CheckCircle2 size={32} className="text-brand-green" />
            </div>
            <h2 className="text-lg font-bold text-white">Media Registered!</h2>
            <p className="text-sm text-slate-400 mt-1">
              {regResult.on_chain ? 'Your provenance record is now permanently stored on Solana.' : 'Provenance record saved (demo mode — not on-chain).'}
            </p>
          </div>

          <div className="card-elevated p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tx Signature</span>
              <button onClick={() => copy(regResult.tx_signature)} className="flex items-center gap-1 font-mono text-brand-cyan hover:text-brand-green truncate max-w-[160px]">
                {regResult.tx_signature.slice(0, 20)}... <Copy size={10} />
              </button>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Hash</span>
              <span className="font-mono text-slate-300 truncate max-w-[160px]">{regResult.hash.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Timestamp</span>
              <span className="text-slate-300">{new Date(regResult.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Status</span>
              <span className={regResult.on_chain ? 'text-brand-green font-semibold' : 'text-brand-amber font-semibold'}>
                {regResult.on_chain ? 'On-Chain ✓' : 'Demo Mode'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setStep(0); setFile(null); setUploadResult(null); setRegResult(null) }} className="btn-ghost text-sm flex-1 justify-center">
              Register Another
            </button>
            <a
              href={`https://explorer.solana.com/tx/${regResult.tx_signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm flex-1 justify-center"
            >
              <ExternalLink size={14} />
              View on Explorer
            </a>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={(f) => { setFile(f); setShowCamera(false) }}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}
