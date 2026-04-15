export type UserRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  slug: string;
  owner: User;
  members: User[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  workspace: Workspace;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  position: number;
  project: Project;
  assignee?: User;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  task: Task;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
  slug?: string;
  ownerId?: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  status?: ProjectStatus;
  workspaceId: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  workspaceId?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  position?: number;
  projectId: string;
  assigneeId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  position?: number;
  projectId?: string;
  assigneeId?: string;
}

export interface CreateCommentDto {
  content: string;
  taskId: string;
  authorId?: string;
}

export interface UpdateCommentDto {
  content?: string;
  taskId?: string;
  authorId?: string;
}
