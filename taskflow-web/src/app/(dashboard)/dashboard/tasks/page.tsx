'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task } from '@/types';

const PRIORITIES = {
  LOW: { label: 'Baja', color: 'bg-gray-600/20 text-gray-400 border-gray-600/50' },
  MEDIUM: { label: 'Media', color: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50' },
  HIGH: { label: 'Alta', color: 'bg-orange-600/20 text-orange-400 border-orange-600/50' },
  URGENT: { label: 'Urgente', color: 'bg-red-600/20 text-red-400 border-red-600/50' },
};

const STATUSES = {
  TODO: { label: 'Por Hacer', color: 'bg-gray-600/20 text-gray-400 border-gray-600/50' },
  IN_PROGRESS: { label: 'En Progreso', color: 'bg-blue-600/20 text-blue-400 border-blue-600/50' },
  IN_REVIEW: { label: 'En Revisión', color: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50' },
  DONE: { label: 'Completado', color: 'bg-green-600/20 text-green-400 border-green-600/50' },
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Task[]>('/tasks');
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = PRIORITIES[priority as keyof typeof PRIORITIES] || PRIORITIES.MEDIUM;
    return (
      <span className={`text-xs px-2 py-1 rounded border ${priorityConfig.color}`}>
        {priorityConfig.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = STATUSES[status as keyof typeof STATUSES] || STATUSES.TODO;
    return (
      <span className={`text-xs px-2 py-1 rounded border ${statusConfig.color}`}>
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mis Tareas</h1>
        <p className="text-gray-400">Todas tus tareas asignadas</p>
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
      ) : tasks.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay tareas</h3>
          <p className="text-gray-400 mb-6">No tienes tareas asignadas todavía</p>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Ir a Proyectos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex space-x-2">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Proyecto: {task.project?.name || 'Sin proyecto'}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => router.push(`/dashboard/projects/${task.project?.id}`)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Ver en Proyecto
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
