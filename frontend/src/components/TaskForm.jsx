// frontend/src/components/TaskForm.jsx
import React, { useEffect, useState } from 'react'

export default function TaskForm({ onCreate, editingTask, onUpdate, cancelEdit, darkMode }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('non terminée')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name || '')
      setDescription(editingTask.description || '')
      setStatus(editingTask.status || 'non terminée')
    } else {
      setName('')
      setDescription('')
      setStatus('non terminée')
    }
  }, [editingTask])

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!name.trim()) {
      alert('Veuillez entrer un nom pour la tâche')
      return
    }

    setIsSubmitting(true)
    
    try {
      const payload = { 
        name: name.trim(), 
        description: description.trim(), 
        status 
      }

      if (editingTask) {
        await onUpdate(editingTask._id, payload)
      } else {
        await onCreate(payload)
      }
      
    } catch (error) {
      console.error('Erreur dans handleSubmit:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      {/* En-tête de la modale */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {editingTask ? '✏️ Modifier la tâche' : '➕ Nouvelle tâche'}
        </h2>
        <button
          type="button"
          onClick={cancelEdit}
          className={`text-2xl transition-colors ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nom de la tâche *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Que souhaitez-vous accomplir ?"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Détails supplémentaires (optionnel)"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Statut
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              disabled={isSubmitting}
            >
              <option value="non terminée">🟡 En cours</option>
              <option value="terminée">✅ Terminée</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors shadow-md ${
              isSubmitting || !name.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
            }`}
          >
            {isSubmitting ? '⏳ En cours...' : editingTask ? '💾 Enregistrer' : '➕ Ajouter'}
          </button>
          
          <button
            type="button"
            onClick={cancelEdit}
            disabled={isSubmitting}
            className={`px-6 py-3 border rounded-lg transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}