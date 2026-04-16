'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Project, Workspace } from '@/types';
import ConfirmModal from '@/components/ConfirmModal';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkspace();
    fetchProjects();
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    try {
      const data = await api.get<Workspace>(`/workspaces/${workspaceId}`);
      setWorkspace(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar workspace');
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Project[]>(`/projects/workspace/${workspaceId}`);
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await api.post('/projects', {
        name: formData.name,
        description: formData.description,
        workspaceId,
      });
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Error al crear proyecto');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjectToDelete(projectId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeletingId(projectToDelete);
    setError('');
    setIsConfirmModalOpen(false);

    try {
      await api.delete(`/projects/${projectToDelete}`);
      fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar proyecto');
    } finally {
      setDeletingId(null);
      setProjectToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-600/20 text-green-400 border-green-600/50';
      case 'ARCHIVED':
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
      case 'COMPLETED':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/dashboard/workspaces')}
            className="text-gray-400 hover:text-white mb-2 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver a Workspaces</span>
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">{workspace?.name}</h1>
          <p className="text-gray-400">{workspace?.description || 'Sin descripción'}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Nuevo Proyecto
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Cargando proyectos...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay proyectos</h3>
          <p className="text-gray-400 mb-6">Crea tu primer proyecto en este workspace</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Crear Proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deletingId === project.id}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar proyecto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description || 'Sin descripción'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{project.tasks?.length || 0} tareas</span>
              </div>

              <button
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Ver Tareas
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Nuevo Proyecto</h2>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mi Proyecto"
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
                  placeholder="Descripción del proyecto..."
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
        title="Eliminar Proyecto"
        message="¿Estás seguro de que quieres eliminar este proyecto?"
        onConfirm={confirmDeleteProject}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setProjectToDelete(null);
        }}
        confirmText="Eliminar"
        confirmColor="red"
      />
    </div>
  );
}
