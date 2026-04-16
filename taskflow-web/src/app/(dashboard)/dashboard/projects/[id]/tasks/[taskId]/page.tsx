'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Task, Comment } from '@/types';

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

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const taskId = params.taskId as string;
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const data = await api.get<Task>(`/tasks/${taskId}`);
      setTask(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tarea');
    }
  };

  const fetchComments = async () => {
    try {
      const data = await api.get<Comment[]>(`/comments/task/${taskId}`);
      setComments(data);
      console.log(comments);
    } catch (err: any) {
      setError(err.message || 'Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    setError('');

    try {
      await api.post('/comments', {
        content: commentText,
        taskId,
      });
      setCommentText('');
      fetchComments();
    } catch (err: any) {
      setError(err.message || 'Error al agregar comentario');
    } finally {
      setSubmittingComment(false);
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
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            className="text-gray-400 hover:text-white mb-2 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver al tablero</span>
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">{task?.title}</h1>
          <div className="flex items-center space-x-3">
            {task && (
              <>
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Cargando...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Task Details */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Detalles de la Tarea</h2>
            {task?.description && (
              <p className="text-gray-300 mb-4">{task.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Prioridad:</span>
                <span className="text-gray-300 ml-2">{task && PRIORITIES[task.priority as keyof typeof PRIORITIES]?.label}</span>
              </div>
              <div>
                <span className="text-gray-500">Estado:</span>
                <span className="text-gray-300 ml-2">{task && STATUSES[task.status as keyof typeof STATUSES]?.label}</span>
              </div>
              {task?.dueDate && (
                <div>
                  <span className="text-gray-500">Fecha de vencimiento:</span>
                  <span className="text-gray-300 ml-2">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {task?.assignee && (
                <div>
                  <span className="text-gray-500">Asignado a:</span>
                  <span className="text-gray-300 ml-2">{task.assignee.firstName} {task.assignee.lastName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Comentarios</h2>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder="Escribe un comentario..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none mb-3"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? 'Enviando...' : 'Enviar comentario'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay comentarios todavía
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
                        </div>
                        <div>
                          <span className="text-white font-medium">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
