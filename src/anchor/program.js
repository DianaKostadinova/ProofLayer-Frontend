/**
 * Proof Layer — Anchor program helpers for the browser.
 *
 * Builds the register_media instruction and transaction without requiring
 * @coral-xyz/anchor, so there are no IDL version compatibility issues.
 *
 * Anchor instruction layout:
 *   [8 bytes discriminator] + Borsh-serialized arguments
 *
 * register_media args:
 *   sha256_hash : [u8; 32]   — raw 32 bytes
 *   ipfs_cid   : String      — u32 LE length prefix + UTF-8 bytes
 */

import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js'

export const PROGRAM_ID = new PublicKey(
  '2WLR1HXnXDYaFePojS4nLibL7WoBGGutRVt32pwzwSgw'
)

/**
 * Compute Anchor instruction discriminator: SHA256("global:<methodName>")[0:8]
 * Uses the browser SubtleCrypto API (available in all modern browsers + Vite).
 */
async function discriminator(methodName) {
  const encoded = new TextEncoder().encode(`global:${methodName}`)
  const hashBuf = await crypto.subtle.digest('SHA-256', encoded)
  return new Uint8Array(hashBuf).slice(0, 8)
}

/**
 * Derive the MediaRecord PDA.
 * Seeds: [b"media", sha256_hash_bytes]
 */
export function findMediaPda(sha256Hex) {
  const hashBytes = Buffer.from(sha256Hex, 'hex')
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('media'), hashBytes],
    PROGRAM_ID
  )
  return pda
}

/**
 * Derive the VerificationRecord PDA.
 * Seeds: [b"verification", media_record_pubkey, verifier_pubkey]
 */
export function findVerificationPda(mediaPubkey, verifierPubkey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('verification'),
      mediaPubkey.toBuffer(),
      verifierPubkey.toBuffer(),
    ],
    PROGRAM_ID
  )
  return pda
}

/**
 * Serialize and return a TransactionInstruction for register_media.
 *
 * @param {PublicKey} ownerPubkey  — user's wallet (must sign)
 * @param {string}    sha256Hex   — 64-char hex SHA256 of the file
 * @param {string}    ipfsCid     — IPFS CID string (max 64 chars)
 */
export async function buildRegisterMediaInstruction(ownerPubkey, sha256Hex, ipfsCid) {
  const disc = await discriminator('register_media')

  const hashBytes = Buffer.from(sha256Hex, 'hex') // 32 bytes
  const cidBytes  = Buffer.from(ipfsCid, 'utf8')

  // Borsh u32 LE length prefix for the String field
  const cidLen = Buffer.allocUnsafe(4)
  cidLen.writeUInt32LE(cidBytes.length, 0)

  const data = Buffer.concat([
    Buffer.from(disc),
    hashBytes,
    cidLen,
    cidBytes,
  ])

  const mediaPda = findMediaPda(sha256Hex)

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: mediaPda,                    isSigner: false, isWritable: true  },
      { pubkey: ownerPubkey,                 isSigner: true,  isWritable: true  },
      { pubkey: SystemProgram.programId,     isSigner: false, isWritable: false },
    ],
    data,
  })
}

/**
 * Build a Transaction containing register_media, ready for the wallet to sign.
 *
 * @param {Connection} connection
 * @param {PublicKey}  ownerPubkey
 * @param {string}     sha256Hex
 * @param {string}     ipfsCid
 * @returns {Transaction}
 */
export async function createRegisterMediaTx(connection, ownerPubkey, sha256Hex, ipfsCid) {
  const ix = await buildRegisterMediaInstruction(ownerPubkey, sha256Hex, ipfsCid)
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('confirmed')

  const tx = new Transaction({
    recentBlockhash: blockhash,
    feePayer: ownerPubkey,
  })
  tx.add(ix)

  // Return blockhash context alongside the tx so the caller can use the
  // exact same lastValidBlockHeight when confirming — avoids "block height
  // exceeded" mismatches from fetching a second blockhash after signing.
  return { tx, blockhash, lastValidBlockHeight }
}

/**
 * Serialize and return a TransactionInstruction for verify_media.
 *
 * @param {PublicKey} verifierPubkey — user's wallet (must sign)
 * @param {PublicKey} mediaPubkey    — the existing MediaRecord PDA
 */
export async function buildVerifyMediaInstruction(verifierPubkey, mediaPubkey) {
  const disc = await discriminator('verify_media')
  const data = Buffer.from(disc) // no extra args

  const verificationPda = findVerificationPda(mediaPubkey, verifierPubkey)

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: mediaPubkey,              isSigner: false, isWritable: true  },
      { pubkey: verificationPda,          isSigner: false, isWritable: true  },
      { pubkey: verifierPubkey,           isSigner: true,  isWritable: true  },
      { pubkey: SystemProgram.programId,  isSigner: false, isWritable: false },
    ],
    data,
  })
}
