import React from 'react'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Aucune tâche pour le moment
        </h3>
        <p className="text-gray-500">
          Commencez par ajouter votre première tâche ci-dessus !
        </p>
      </div>
    )
  }

  // Trier les tâches : non terminées d'abord
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === b.status) return 0
    return a.status === 'non terminée' ? -1 : 1
  })

  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
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
          />
        ))}
      </div>
    </div>
  )
}