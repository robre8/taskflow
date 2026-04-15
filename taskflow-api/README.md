# TaskFlow Pro API

A modern project management platform built with NestJS, inspired by Linear. TaskFlow Pro provides a powerful backend API for managing workspaces, projects, tasks, and team collaboration.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Workspaces**: Organize your team's work into dedicated workspaces
- **Projects**: Create and manage projects within workspaces
- **Tasks**: Track tasks with status (TODO, IN_PROGRESS, IN_REVIEW, DONE) and priority levels
- **Comments**: Collaborate with comments on tasks
- **User Management**: Comprehensive user management with role-based permissions
- **API Documentation**: Interactive Swagger UI for API exploration

## 🛠 Tech Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Configuration**: @nestjs/config with Joi validation

## 📁 Project Structure

```
taskflow-api/
├── src/
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators (@CurrentUser, @Roles, @Public)
│   │   ├── filters/           # Exception filters (HTTP, Validation)
│   │   └── guards/            # Guards (JwtAuthGuard, RolesGuard)
│   ├── config/                 # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── index.ts
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/             # Users module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── workspaces/        # Workspaces module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── workspaces.controller.ts
│   │   │   ├── workspaces.service.ts
│   │   │   └── workspaces.module.ts
│   │   ├── projects/          # Projects module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.service.ts
│   │   │   └── projects.module.ts
│   │   ├── tasks/             # Tasks module
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   └── comments/          # Comments module
│   │       ├── dto/
│   │       ├── entities/
│   │       ├── comments.controller.ts
│   │       ├── comments.service.ts
│   │       └── comments.module.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/robre8/taskflow.git
   cd taskflow/taskflow-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the `.env.example` file to `.env` and configure the required variables:
   
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Application
   PORT=3000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=taskflow
   
   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Set up PostgreSQL database**
   
   Create a PostgreSQL database named `taskflow` or update the `DB_DATABASE` variable in your `.env` file.

## 🏃 Running the Project

### Development Mode
```bash
npm run start:dev
```
The API will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

**http://localhost:3000/api/docs**

The Swagger UI provides:
- Interactive API exploration
- Request/response examples
- Authentication via Bearer token
- Detailed endpoint descriptions

## 🔐 Authentication

The API uses JWT authentication. To access protected endpoints:

1. **Register a new user** or **Login** to get an access token
2. Click the "Authorize" button in Swagger UI
3. Enter your Bearer token: `your_jwt_token_here`
4. All subsequent requests will include the authentication header

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login with email and password | ❌ |
| POST | `/refresh` | Refresh access token | ❌ |
| POST | `/logout` | Logout (invalidate refresh token) | ❌ |
| GET | `/me` | Get current user info | ✅ |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new user | ✅ |
| GET | `/` | Get all users | ✅ |
| GET | `/:id` | Get user by ID | ✅ |
| PATCH | `/:id` | Update user by ID | ✅ |
| DELETE | `/:id` | Delete user by ID | ✅ |

### Workspaces (`/api/workspaces`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new workspace | ✅ |
| GET | `/` | Get all workspaces | ✅ |
| GET | `/:id` | Get workspace by ID | ✅ |
| GET | `/slug/:slug` | Get workspace by slug | ✅ |
| PATCH | `/:id` | Update workspace by ID | ✅ |
| DELETE | `/:id` | Delete workspace by ID | ✅ |
| POST | `/:id/members/:userId` | Add member to workspace | ✅ |
| DELETE | `/:id/members/:userId` | Remove member from workspace | ✅ |

### Projects (`/api/projects`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new project | ✅ |
| GET | `/` | Get all projects | ✅ |
| GET | `/workspace/:workspaceId` | Get projects by workspace | ✅ |
| GET | `/:id` | Get project by ID | ✅ |
| PATCH | `/:id` | Update project by ID | ✅ |
| DELETE | `/:id` | Delete project by ID | ✅ |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new task | ✅ |
| GET | `/` | Get all tasks | ✅ |
| GET | `/project/:projectId` | Get tasks by project | ✅ |
| GET | `/assignee/:assigneeId` | Get tasks by assignee | ✅ |
| GET | `/:id` | Get task by ID | ✅ |
| PATCH | `/:id` | Update task by ID | ✅ |
| DELETE | `/:id` | Delete task by ID | ✅ |

### Comments (`/api/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new comment (author auto-injected) | ✅ |
| GET | `/` | Get all comments | ✅ |
| GET | `/task/:taskId` | Get comments by task | ✅ |
| GET | `/author/:authorId` | Get comments by author | ✅ |
| GET | `/:id` | Get comment by ID | ✅ |
| PATCH | `/:id` | Update comment by ID | ✅ |
| DELETE | `/:id` | Delete comment by ID | ✅ |

## 🔑 User Roles

- **ADMIN**: Full access to all resources
- **MEMBER**: Standard access to assigned resources
- **VIEWER**: Read-only access

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 License

This project is licensed under the MIT License.
