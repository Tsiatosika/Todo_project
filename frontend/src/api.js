import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
})

export async function getTasks() {
  const res = await API.get('/tasks')
  return res.data
}

export async function createTask(task) {
  const res = await API.post('/tasks', task)
  return res.data
}

export async function updateTask(id, update) {
  const res = await API.put(`/tasks/${id}`, update)
  return res.data
}

export async function deleteTask(id) {
  const res = await API.delete(`/tasks/${id}`)
  return res.data
}