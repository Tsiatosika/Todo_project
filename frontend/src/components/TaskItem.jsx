// frontend/src/components/TaskItem.jsx
import React from 'react'

export default function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const statusColors = {
    'terminée': 'bg-green-50 border-green-200 text-green-800',
    'non terminée': 'bg-white border-gray-200 text-blue-800'
  }

  const statusIcons = {
    'terminée': '✅',
    'non terminée': '🟡'
  }

  return (
    <div className={`p-4 border rounded-lg shadow-sm transition-all hover:shadow-md ${
      task.status === 'terminée' 
        ? 'border-green-300 bg-green-50' 
        : 'border-gray-300 bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onToggleStatus}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.status === 'terminée'
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500 bg-white'
            }`}
          >
            {task.status === 'terminée' && '✓'}
          </button>
          
          <div className="flex-1">
            <div className={`font-semibold ${
              task.status === 'terminée' ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}>
              {task.name}
            </div>
            {task.description && (
              <div className="text-sm text-gray-600 mt-1">
                {task.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            task.status === 'terminée'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {statusIcons[task.status]} {task.status}
          </span>
          
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Modifier"
          >
            ✏️
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}