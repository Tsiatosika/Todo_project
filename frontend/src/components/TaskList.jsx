// frontend/src/components/TaskList.jsx
import React from 'react';
import { ClipboardList, Filter } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus, darkMode, filterStatus, sortBy }) {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <ClipboardList size={64} className={`mx-auto mb-4 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Aucune tâche pour le moment
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Commencez par ajouter votre première tâche !
                </p>
            </div>
        );
    }

    // Filtrer par statut
    let filteredTasks = [...tasks];
    if (filterStatus !== 'toutes') {
        filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }

    // Trier
    const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortBy === 'status') {
            if (a.status !== b.status) {
                return a.status === 'non terminée' ? -1 : 1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    if (sortedTasks.length === 0) {
        return (
            <div className="text-center py-12">
                <Filter size={64} className={`mx-auto mb-4 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Aucune tâche correspondante
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Essayez de changer le filtre
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h3 className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                    Mes Tâches ({sortedTasks.length})
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
    );
}