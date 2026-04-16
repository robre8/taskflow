# TaskFlow Pro

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

## Descripción

TaskFlow Pro es una plataforma de gestión de proyectos estilo Linear con tablero Kanban, diseñada para equipos modernos. Ofrece una experiencia fluida con autenticación segura, gestión de workspaces, proyectos y tareas en tiempo real.

## Demo

- **Frontend**: https://taskflow-smoky-seven.vercel.app
- **Backend API**: https://taskflow-production-1922.up.railway.app/api
- **Swagger**: https://taskflow-production-1922.up.railway.app/api/docs

## Funcionalidades Principales

- 🔐 **Autenticación JWT con cookies httpOnly** - Seguridad mejorada con tokens almacenados en cookies httpOnly
- 📁 **Gestión de Workspaces, Projects y Tasks** - Organización jerárquica de proyectos
- 📋 **Tablero Kanban con cambio de status en tiempo real** - Visualización y gestión ágil de tareas
- 💬 **Sistema de comentarios por tarea** - Colaboración en tiempo real
- 📊 **Dashboard con métricas en tiempo real** - Análisis de productividad
- 🔒 **Autorización por ownership** - Control de acceso basado en propiedad de recursos
- 🛡️ **Rate limiting y Helmet** - Seguridad adicional con headers HTTP y límites de tasa

## Stack Tecnológico

### Backend (taskflow-api)
- **Framework**: NestJS
- **Base de datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT con Passport
- **Seguridad**: Helmet, Rate Limiting, Cookies httpOnly
- **Documentación**: Swagger/OpenAPI

### Frontend (taskflow-web)
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, shadcn/ui
- **Estado**: React Hooks
- **HTTP**: Fetch API
- **Iconos**: Lucide React

## Estructura del Monorepo

```
taskflow/
├── taskflow-api/          # Backend NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/     # Autenticación y autorización
│   │   │   ├── users/    # Gestión de usuarios
│   │   │   ├── workspaces/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   └── comments/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   └── filters/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── package.json
│   └── README.md
│
└── taskflow-web/          # Frontend Next.js
    ├── src/
    │   ├── app/
    │   │   ├── (dashboard)/
    │   │   │   └── dashboard/
    │   │   ├── login/
    │   │   └── register/
    │   ├── components/
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   └── layout.tsx
    ├── package.json
    └── README.md
```

## Instrucciones para Correr Localmente

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

### Backend (taskflow-api)

1. Navegar al directorio del backend:
   ```bash
   cd taskflow-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus credenciales de PostgreSQL y configuración JWT.

4. Ejecutar migraciones:
   ```bash
   npm run migration:run
   ```

5. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```

   La API estará disponible en `http://localhost:3000/api`
   La documentación de Swagger en `http://localhost:3000/api/docs`

### Frontend (taskflow-web)

1. Navegar al directorio del frontend:
   ```bash
   cd taskflow-web
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
   Configurar `NEXT_PUBLIC_API_URL` apuntando al backend.

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3001`

## Documentación Adicional

- [Backend README](./taskflow-api/README.md) - Documentación detallada del backend
- [Frontend README](./taskflow-web/README.md) - Documentación detallada del frontend

## Seguridad

- Autenticación JWT con tokens de acceso y refresh
- Cookies httpOnly para protección contra XSS
- Autorización por ownership para recursos
- Rate limiting para prevenir abuso
- Helmet para headers de seguridad HTTP
- Validación de datos con class-validator
- Sanitización de entradas

## Licencia

MIT
