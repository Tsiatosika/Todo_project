// frontend/src/App.jsx
import React, { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  function showNotification(message, type = 'success') {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
  }

  async function loadTasks() {
    setLoading(true)
    try {
      console.log('🔄 Chargement des tâches...')
      const data = await getTasks()
      console.log('✅ Tâches chargées:', data)
      setTasks(data)
    } catch (err) {
      console.error('❌ Erreur chargement tâches', err)
      showNotification('Erreur lors du chargement des tâches', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleCreate(task) {
    try {
      console.log('➕ Création tâche:', task)
      const res = await createTask(task)
      console.log('✅ Réponse création:', res)
      
      showNotification('Tâche créée avec succès! 🎉')
      await loadTasks()
      
    } catch (err) {
      console.error('❌ Erreur création', err)
      showNotification('Erreur lors de la création: ' + err.message, 'error')
    }
  }

  async function handleUpdate(id, updated) {
    try {
      console.log('✏️ Mise à jour tâche:', id, updated)
      await updateTask(id, updated)
      showNotification('Tâche mise à jour! ✅')
      await loadTasks()
      setEditingTask(null)
    } catch (err) {
      console.error('❌ Erreur update', err)
      showNotification('Erreur lors de la mise à jour: ' + err.message, 'error')
    }
  }

  async function handleDelete(id) {
    try {
      console.log('🗑️ Suppression tâche:', id)
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t._id !== id))
      showNotification('Tâche supprimée! 🗑️')
    } catch (err) {
      console.error('❌ Erreur suppression', err)
      showNotification('Erreur lors de la suppression: ' + err.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-4 rounded-lg ${
            notification.type === 'error' 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Todo App
          </h1>
          <p className="text-gray-600">Gérez vos tâches avec MongoDB & Node.js</p>
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {tasks.length} tâches</span>
              <span className="text-green-600">
                Terminées: {tasks.filter(t => t.status === 'terminée').length}
              </span>
              <span className="text-blue-600">
                En cours: {tasks.filter(t => t.status === 'non terminée').length}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <TaskForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editingTask={editingTask}
            cancelEdit={() => setEditingTask(null)}
          />

          <div className="border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Chargement des tâches...</span>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={(task) => setEditingTask(task)}
                onDelete={handleDelete}
                onToggleStatus={async (task) => {
                  await handleUpdate(task._id, {
                    ...task,
                    status: task.status === 'terminée' ? 'non terminée' : 'terminée'
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}