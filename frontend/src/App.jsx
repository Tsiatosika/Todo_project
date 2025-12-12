import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import { ClipboardList, Plus, Sun, Moon, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [filterStatus, setFilterStatus] = useState('toutes');
    const [sortBy, setSortBy] = useState('status');

    // État pour le mode sombre
    const [darkMode, setDarkMode] = useState(() => {
        // Vérifier la préférence système ou le localStorage
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Sauvegarder la préférence dans le localStorage
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    function showNotification(message, type = 'success') {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }

    async function loadTasks() {
        setLoading(true);
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            console.error('Erreur chargement tâches', err);
            showNotification('Erreur lors du chargement des tâches', 'error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function handleCreate(task) {
        try {
            await createTask(task);
            showNotification('Tâche créée avec succès! 🎉');
            await loadTasks();
            closeModal();
        } catch (err) {
            console.error('Erreur création', err);
            showNotification('Erreur lors de la création', 'error');
        }
    }

    async function handleUpdate(id, updated) {
        try {
            await updateTask(id, updated);
            showNotification('Tâche mise à jour! ✅');
            await loadTasks();
            closeModal();
        } catch (err) {
            console.error('Erreur update', err);
            showNotification('Erreur lors de la mise à jour', 'error');
        }
    }

    async function handleDelete(id) {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            try {
                await deleteTask(id);
                setTasks(prev => prev.filter(t => t._id !== id));
                showNotification('Tâche supprimée! 🗑️');
            } catch (err) {
                console.error('Erreur suppression', err);
                showNotification('Erreur lors de la suppression', 'error');
            }
        }
    }

    function openCreateModal() {
        setEditingTask(null);
        setIsFormModalOpen(true);
    }

    function openEditModal(task) {
        setEditingTask(task);
        setIsFormModalOpen(true);
    }

    function closeModal() {
        setIsFormModalOpen(false);
        setEditingTask(null);
    }

    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }

    const pendingTasks = tasks.filter(t => t.status === 'non terminée').length;
    const completedTasks = tasks.filter(t => t.status === 'terminée').length;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
        }`}>
            <div className="max-w-4xl mx-auto py-8 px-4">

                {/* Header avec bouton mode sombre */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <ClipboardList size={40} />
                            Todo App
                        </h1>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Gérez vos tâches efficacement
                        </p>
                    </div>

                    {/* Bouton toggle mode sombre */}
                    <button
                        onClick={toggleDarkMode}
                        className={`p-3 rounded-full transition-all duration-300 ${
                            darkMode
                                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-center gap-2 ${
                        notification.type === 'error'
                            ? 'bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
                            : 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
                    }`}>
                        <AlertCircle size={20} />
                        {notification.message}
                    </div>
                )}

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`rounded-xl shadow-sm p-6 border transition-colors ${
                        darkMode
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                    }`}>
                        <div className={`text-2xl font-bold ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            {tasks.length}
                        </div>
                        <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Total tâches
                        </div>
                    </div>

                    <div className={`rounded-xl shadow-sm p-6 border transition-colors ${
                        darkMode
                            ? 'bg-blue-900 border-blue-700'
                            : 'bg-white border-blue-200'
                    }`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {pendingTasks}
                        </div>
                        <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            En cours
                        </div>
                    </div>

                    <div className={`rounded-xl shadow-sm p-6 border transition-colors ${
                        darkMode
                            ? 'bg-green-900 border-green-700'
                            : 'bg-white border-green-200'
                    }`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {completedTasks}
                        </div>
                        <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            Terminées
                        </div>
                    </div>
                </div>

                {/* Filtres et tri */}
                <div className={`rounded-xl shadow-sm p-4 mb-6 border transition-colors ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                            <label className={`text-sm font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Filtre:
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                <option value="toutes">Toutes</option>
                                <option value="non terminée">En cours</option>
                                <option value="terminée">Terminées</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                            <label className={`text-sm font-medium ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Trier par:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`px-3 py-2 border rounded-lg text-sm ${
                                    darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                <option value="status">Statut</option>
                                <option value="name">Nom</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bouton Ajouter */}
                <div className="text-center mb-8">
                    <button
                        onClick={openCreateModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                        <Plus size={20} />
                        Ajouter une nouvelle tâche
                    </button>
                </div>

                {/* Liste des tâches */}
                <div className={`rounded-xl shadow-lg overflow-hidden transition-colors ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Chargement...
              </span>
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            darkMode={darkMode}
                            filterStatus={filterStatus}
                            sortBy={sortBy}
                            onToggleStatus={async (task) => {
                                await handleUpdate(task._id, {
                                    ...task,
                                    status: task.status === 'terminée' ? 'non terminée' : 'terminée'
                                });
                            }}
                        />
                    )}
                </div>

                {/* Modal pour le formulaire */}
                {isFormModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className={`rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <TaskForm
                                onCreate={handleCreate}
                                onUpdate={handleUpdate}
                                editingTask={editingTask}
                                cancelEdit={closeModal}
                                darkMode={darkMode}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}