import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

// Log every request and response to browser console for debugging
api.interceptors.request.use((config) => {
  console.log(`[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  return config
})

api.interceptors.response.use(
  (res) => {
    console.log(`[API] ← ${res.status} ${res.config.url}`, res.data)
    return res
  },
  (err) => {
    const status = err.response?.status
    const detail = err.response?.data?.detail || err.message
    console.error(`[API] ✗ ${status || 'Network Error'} ${err.config?.url} — ${detail}`)
    return Promise.reject(err)
  }
)

export async function checkHealth() {
  const { data } = await api.get('/health', { timeout: 3000 })
  return data
}

export async function uploadMedia(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function registerMedia(payload) {
  const { data } = await api.post('/register', payload)
  return data
}

export async function verifyMedia(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/verify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getMediaRecord(hash) {
  const { data } = await api.get(`/media/${hash}`)
  return data
}

export function getErrorMessage(err) {
  if (!err.response) return 'Backend unreachable — is uvicorn running on port 8000?'
  const detail = err.response.data?.detail
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ')
  return detail || `Server error (${err.response.status})`
}

export default api
