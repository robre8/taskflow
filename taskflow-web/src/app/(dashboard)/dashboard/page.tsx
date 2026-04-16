'use client';

import { useState, useEffect } from 'react';
import { getMe } from '@/lib/auth';
import { api } from '@/lib/api';
import { User, Workspace, Project, Task } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userData, workspacesData, projectsData, tasksData] = await Promise.all([
        getMe(),
        api.get<Workspace[]>('/workspaces'),
        api.get<Project[]>('/projects'),
        api.get<Task[]>('/tasks'),
      ]);
      setUser(userData as User);
      setWorkspaces(workspacesData);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenido, {user?.firstName}
        </h1>
        <p className="text-gray-400">Aquí tienes un resumen de tu actividad</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Workspaces */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">{workspaces.length}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Workspaces</h3>
        </div>

        {/* Total Projects */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">{projects.length}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Projects</h3>
        </div>

        {/* Total Tasks */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">{tasks.length}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Tasks</h3>
        </div>

        {/* Completed Tasks */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white">{completedTasks}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Tasks Completadas</h3>
        </div>
      </div>

      {/* Additional Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <p>Nuevo proyecto creado en Workspace Principal</p>
            <span className="text-gray-500 text-sm ml-auto">Hace 2 horas</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p>Tarea "Actualizar documentación" completada</p>
            <span className="text-gray-500 text-sm ml-auto">Hace 4 horas</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <p>Nuevo miembro agregado a Workspace Design</p>
            <span className="text-gray-500 text-sm ml-auto">Hace 1 día</span>
          </div>
        </div>
      </div>
    </div>
  );
}
