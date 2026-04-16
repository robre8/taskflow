# TaskFlow Pro Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## Descripción

Frontend de TaskFlow Pro, una plataforma de gestión de proyectos estilo Linear con tablero Kanban. Construido con Next.js 16, Tailwind CSS y TypeScript, ofrece una interfaz moderna y responsiva para gestionar workspaces, proyectos y tareas.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS
- **Lenguaje**: TypeScript
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **HTTP**: Fetch API
- **Autenticación**: Cookies httpOnly + localStorage (fallback)

## Páginas y Funcionalidades

### Autenticación
- **Login**: Inicio de sesión con email y contraseña
- **Register**: Registro de nuevos usuarios

### Dashboard
- Resumen de workspaces, proyectos y tareas
- Métricas de tareas completadas
- Actividad reciente con últimas 5 tareas actualizadas

### Workspaces
- Listado de workspaces
- Creación de nuevos workspaces
- Detalle de workspace con proyectos
- Eliminación de workspaces (con confirmación)

### Projects
- Listado de proyectos
- Creación de nuevos proyectos
- Detalle de proyecto con tablero Kanban
- Eliminación de proyectos (con confirmación)

### Tasks
- Listado de tareas
- Creación de nuevas tareas
- Detalle de tarea con comentarios
- Eliminación de tareas (con confirmación)

### Tablero Kanban
- Visualización de tareas por status (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- Cambio de status en tiempo real
- Filtros por asignado

## Instrucciones para Correr Localmente

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Configurar las siguientes variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir el navegador en `http://localhost:3001`

## Variables de Entorno Necesarias

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL de la API del backend | `http://localhost:3000/api` |

## Documentación Adicional

- [Backend README](../taskflow-api/README.md) - Documentación detallada del backend
- [Monorepo README](../README.md) - Documentación general del proyecto

## Deployment

El frontend está desplegado en Vercel:
- **Producción**: https://taskflow-smoky-seven.vercel.app
