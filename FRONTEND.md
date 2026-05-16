# FRONTEND CONTEXT — ProofLayer

## Overview

Frontend for ProofLayer, a Solana-based decentralized media provenance and verification platform.

The frontend is a mobile-first web app that:
- accesses camera
- uploads media
- connects Solana wallet
- registers provenance
- verifies suspicious media
- visualizes AI authenticity analysis

---

# Stack

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Solana Wallet Adapter

---

# Pages

## /

Landing page.

Sections:
- Hero
- Problem
- How it works
- Solana integration
- CTA buttons

---

## /register

Features:
- Camera access
- Upload image
- Connect Phantom wallet
- Register provenance

Workflow:
1. User takes/uploads image
2. Send image to backend
3. Receive CID/hash
4. Trigger Solana transaction
5. Display proof confirmation

---

## /verify

Features:
- Upload suspicious image
- Compare against registered media
- Display similarity + AI result

---

## /result/[id]

Displays:
- Similarity %
- Deepfake probability
- Solana tx hash
- Timestamp
- Provenance status

---

# Components

## UploadBox.tsx
Handles:
- drag/drop
- uploads

---

## CameraCapture.tsx
Uses:
navigator.mediaDevices.getUserMedia()

Captures:
- image blob

---

## WalletButton.tsx
Connects Phantom wallet.

---

## ResultCard.tsx
Displays:
- trust score
- similarity
- tx info

---

# API Calls

## POST /upload

Input:
- image

Returns:
- hash
- CID

---

## POST /verify

Input:
- image

Returns:
- similarity
- deepfake probability

---

# Folder Structure

frontend/
│
├── app/
├── components/
├── lib/
├── hooks/
└── styles/

---

# UI Direction

Style:
- dark mode
- futuristic
- cybersecurity/Web3 feel
- glassmorphism
- clean enterprise dashboard

Inspirations:
- Vercel
- Stripe
- Arkham Intelligence

---

# Important

Focus on:
- clean UX
- upload flow
- mobile responsiveness
- demo clarity

Do NOT overcomplicate animations.