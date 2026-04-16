'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task, Project } from '@/types';
import ConfirmModal from '@/components/ConfirmModal';

const COLUMNS = [
  { id: 'TODO', label: 'Por Hacer', color: 'border-gray-600' },
  { id: 'IN_PROGRESS', label: 'En Progreso', color: 'border-blue-600' },
  { id: 'IN_REVIEW', label: 'En Revisión', color: 'border-yellow-600' },
  { id: 'DONE', label: 'Completado', color: 'border-green-600' },
];

const PRIORITIES = {
  LOW: { label: 'Baja', color: 'bg-gray-600/20 text-gray-400 border-gray-600/50' },
  MEDIUM: { label: 'Media', color: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50' },
  HIGH: { label: 'Alta', color: 'bg-orange-600/20 text-orange-400 border-orange-600/50' },
  URGENT: { label: 'Urgente', color: 'bg-red-600/20 text-red-400 border-red-600/50' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    dueDate: '',
  });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const data = await api.get<Project>(`/projects/${projectId}`);
      setProject(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar proyecto');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Task[]>(`/tasks/project/${projectId}`);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        projectId,
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
      fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Error al crear tarea');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTaskToDelete(taskId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    setDeletingId(taskToDelete);
    setError('');
    setIsConfirmModalOpen(false);

    try {
      await api.delete(`/tasks/${taskToDelete}`);
      fetchTasks();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar tarea');
    } finally {
      setDeletingId(null);
      setTaskToDelete(null);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));

    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado');
      // Revert on error
      setTasks(previousTasks);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = PRIORITIES[priority as keyof typeof PRIORITIES] || PRIORITIES.MEDIUM;
    return (
      <span className={`text-xs px-2 py-1 rounded border ${priorityConfig.color}`}>
        {priorityConfig.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-gray-400 hover:text-white mb-2 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver a Proyectos</span>
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">{project?.name}</h1>
          <p className="text-gray-400">{project?.description || 'Sin descripción'}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Nueva Tarea
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Cargando tareas...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <div key={column.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className={`flex items-center justify-between mb-4 pb-2 border-b ${column.color}`}>
                <h3 className="font-semibold text-white">{column.label}</h3>
                <span className="text-sm text-gray-400">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">{task.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(task.priority)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          disabled={deletingId === task.id}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar tarea"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="mb-3">
                      <select
                        value={task.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(task.id, e.target.value);
                        }}
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-600 transition-colors"
                      >
                        <option value="TODO">Por Hacer</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="IN_REVIEW">En Revisión</option>
                        <option value="DONE">Completado</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      {task.assignee && (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {task.assignee.firstName[0]}{task.assignee.lastName[0]}
                          </div>
                          <span>{task.assignee.firstName} {task.assignee.lastName}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <span className="text-gray-400">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/projects/${projectId}/tasks/${task.id}`);
                      }}
                      className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Sin tareas
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Nueva Tarea</h2>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Título de la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Descripción de la tarea..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de vencimiento (opcional)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Eliminar Tarea"
        message="¿Estás seguro de que quieres eliminar esta tarea?"
        onConfirm={confirmDeleteTask}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setTaskToDelete(null);
        }}
        confirmText="Eliminar"
        confirmColor="red"
      />
    </div>
  );
}
