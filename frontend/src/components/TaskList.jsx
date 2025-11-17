// frontend/src/components/TaskList.jsx
import React from 'react'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus, darkMode }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className={`text-xl font-semibold mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Aucune tâche pour le moment
        </h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Commencez par ajouter votre première tâche !
        </p>
      </div>
    )
  }

  // Trier : non terminées d'abord, puis par date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'non terminée' ? -1 : 1
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Mes Tâches ({tasks.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {sortedTasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task._id)}
            onToggleStatus={() => onToggleStatus(task)}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  )
}