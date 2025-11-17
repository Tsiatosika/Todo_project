// frontend/src/App.jsx
import React, { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  function showNotification(message, type = 'success') {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }, 3000))
  }

  async function loadTasks() {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      console.error('Erreur chargement tâches', err)
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
      await createTask(task)
      showNotification('Tâche créée avec succès! 🎉')
      await loadTasks()
      closeModal()
    } catch (err) {
      console.error('Erreur création', err)
      showNotification('Erreur lors de la création', 'error')
    }
  }

  async function handleUpdate(id, updated) {
    try {
      await updateTask(id, updated)
      showNotification('Tâche mise à jour! ✅')
      await loadTasks()
      closeModal()
    } catch (err) {
      console.error('Erreur update', err)
      showNotification('Erreur lors de la mise à jour', 'error')
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask(id)
        setTasks(prev => prev.filter(t => t._id !== id))
        showNotification('Tâche supprimée! 🗑️')
      } catch (err) {
        console.error('Erreur suppression', err)
        showNotification('Erreur lors de la suppression', 'error')
      }
    }
  }

  function openCreateModal() {
    setEditingTask(null)
    setIsFormModalOpen(true)
  }

  function openEditModal(task) {
    setEditingTask(task)
    setIsFormModalOpen(true)
  }

  function closeModal() {
    setIsFormModalOpen(false)
    setEditingTask(null)
  }

  const pendingTasks = tasks.filter(t => t.status === 'non terminée').length
  const completedTasks = tasks.filter(t => t.status === 'terminée').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'error' 
              ? 'bg-red-100 border-red-400 text-red-700' 
              : 'bg-green-100 border-green-400 text-green-700'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header avec Statistiques */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Todo App
          </h1>
          <p className="text-gray-600 mb-6">Gérez vos tâches efficacement</p>
          
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
              <div className="text-gray-600">Total tâches</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
              <div className="text-gray-600">En cours</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-gray-600">Terminées</div>
            </div>
          </div>

          {/* Bouton Ajouter */}
          <button
            onClick={openCreateModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <span>➕</span>
            Ajouter une nouvelle tâche
          </button>
        </div>

        {/* Liste des tâches */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={openEditModal}
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

        {/* Modal pour le formulaire */}
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <TaskForm
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                editingTask={editingTask}
                cancelEdit={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}