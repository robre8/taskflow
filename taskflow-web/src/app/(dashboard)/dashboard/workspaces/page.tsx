'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getMe } from '@/lib/auth';
import { Workspace, User } from '@/types';
import ConfirmModal from '@/components/ConfirmModal';

export default function WorkspacesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    fetchWorkspaces();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData as User);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<Workspace[]>('/workspaces');
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar workspaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    setError('');

    try {
      await api.post('/workspaces', {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        ownerId: user.id,
      });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', slug: '' });
      fetchWorkspaces();
    } catch (err: any) {
      setError(err.message || 'Error al crear workspace');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    setWorkspaceToDelete(workspaceId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;

    setDeletingId(workspaceToDelete);
    setError('');
    setIsConfirmModalOpen(false);

    try {
      await api.delete(`/workspaces/${workspaceToDelete}`);
      fetchWorkspaces();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar workspace');
    } finally {
      setDeletingId(null);
      setWorkspaceToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workspaces</h1>
          <p className="text-gray-400">Gestiona tus espacios de trabajo</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Nuevo Workspace
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Cargando workspaces...</div>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay workspaces</h3>
          <p className="text-gray-400 mb-6">Crea tu primer workspace para empezar</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Crear Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                    {workspace.members?.length || 0} miembros
                  </span>
                  <button
                    onClick={() => handleDeleteWorkspace(workspace.id)}
                    disabled={deletingId === workspace.id}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar workspace"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{workspace.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {workspace.description || 'Sin descripción'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{workspace.projects?.length || 0} proyectos</span>
                <span className="text-gray-600">/{workspace.slug}</span>
              </div>

              <button
                onClick={() => router.push(`/dashboard/workspaces/${workspace.id}`)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Ver Proyectos
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Nuevo Workspace</h2>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
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
                  placeholder="Mi Workspace"
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
                  placeholder="Descripción del workspace..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  pattern="^[a-z0-9-]+$"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="mi-workspace"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo letras minúsculas, números y guiones
                </p>
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
        title="Eliminar Workspace"
        message="¿Estás seguro de que quieres eliminar este workspace? Esto también eliminará todos sus proyectos y tareas."
        onConfirm={confirmDeleteWorkspace}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setWorkspaceToDelete(null);
        }}
        confirmText="Eliminar"
        confirmColor="red"
      />
    </div>
  );
}
