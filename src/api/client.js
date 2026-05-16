import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

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

export default api
