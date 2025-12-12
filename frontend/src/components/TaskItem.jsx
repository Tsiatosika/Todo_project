// frontend/src/components/TaskItem.jsx
import React from 'react';
import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';

export default function TaskItem({ task, onEdit, onDelete, onToggleStatus, darkMode }) {
    return (
        <div className={`p-4 border rounded-lg shadow-sm transition-all hover:shadow-md ${
            task.status === 'terminée'
                ? darkMode
                    ? 'border-green-600 bg-green-900/30'
                    : 'border-green-300 bg-green-50'
                : darkMode
                    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    <button
                        onClick={onToggleStatus}
                        className={`transition-all ${
                            task.status === 'terminée'
                                ? 'text-green-500'
                                : darkMode
                                    ? 'text-gray-400 hover:text-green-500'
                                    : 'text-gray-300 hover:text-green-500'
                        }`}
                    >
                        {task.status === 'terminée' ? (
                            <CheckCircle2 size={24} />
                        ) : (
                            <Circle size={24} />
                        )}
                    </button>

                    <div className="flex-1">
                        <div className={`font-semibold ${
                            task.status === 'terminée'
                                ? darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                                : darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            {task.name}
                        </div>
                        {task.description && (
                            <div className={`text-sm mt-1 ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {task.description}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              task.status === 'terminée'
                  ? darkMode
                      ? 'bg-green-800 text-green-200'
                      : 'bg-green-100 text-green-800'
                  : darkMode
                      ? 'bg-blue-800 text-blue-200'
                      : 'bg-blue-100 text-blue-800'
          }`}>
            {task.status === 'terminée' ? (
                <CheckCircle2 size={12} />
            ) : (
                <Circle size={12} />
            )}
              {task.status}
          </span>

                    <button
                        onClick={onEdit}
                        className={`p-2 rounded-lg transition-colors ${
                            darkMode
                                ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                        }`}
                        title="Modifier"
                    >
                        <Edit2 size={18} />
                    </button>

                    <button
                        onClick={onDelete}
                        className={`p-2 rounded-lg transition-colors ${
                            darkMode
                                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}