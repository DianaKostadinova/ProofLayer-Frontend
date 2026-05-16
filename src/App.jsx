import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RegisterMedia from './pages/RegisterMedia.jsx'
import Verification from './pages/Verification.jsx'
import VerificationProcess from './pages/VerificationProcess.jsx'
import VisualForensics from './pages/VisualForensics.jsx'
import VerificationReport from './pages/VerificationReport.jsx'
import Provenance from './pages/Provenance.jsx'
import TrustScores from './pages/TrustScores.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="register" element={<RegisterMedia />} />
          <Route path="verification" element={<Verification />} />
          <Route path="verification/process/:jobId" element={<VerificationProcess />} />
          <Route path="verification/forensics/:hash" element={<VisualForensics />} />
          <Route path="verification/report/:hash" element={<VerificationReport />} />
          <Route path="provenance" element={<Provenance />} />
          <Route path="trust-scores" element={<TrustScores />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
