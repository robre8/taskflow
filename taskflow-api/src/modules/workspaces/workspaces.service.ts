import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find({
      relations: ['owner', 'members', 'projects'],
    });
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'projects'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async findBySlug(slug: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { slug },
      relations: ['owner', 'members', 'projects'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with slug ${slug} not found`);
    }

    return workspace;
  }

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    const { ownerId, ...workspaceData } = createWorkspaceDto;
    
    const existingWorkspace = await this.workspaceRepository.findOne({
      where: { slug: workspaceData.slug },
    });

    if (existingWorkspace) {
      throw new ConflictException(`Workspace with slug ${workspaceData.slug} already exists`);
    }

    const workspace = this.workspaceRepository.create(workspaceData);
    
    if (ownerId) {
      workspace.owner = { id: ownerId } as any;
    }
    
    return this.workspaceRepository.save(workspace);
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    // Verify ownership
    if (workspace.owner.id !== userId) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    if (updateWorkspaceDto.slug && updateWorkspaceDto.slug !== workspace.slug) {
      const existingWorkspace = await this.workspaceRepository.findOne({
        where: { slug: updateWorkspaceDto.slug },
      });

      if (existingWorkspace) {
        throw new ConflictException(`Workspace with slug ${updateWorkspaceDto.slug} already exists`);
      }
    }

    Object.assign(workspace, updateWorkspaceDto);
    return this.workspaceRepository.save(workspace);
  }

  async remove(id: string, userId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['projects', 'owner'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    // Verify ownership (allow deletion if owner is null for workspaces created before the fix)
    if (workspace.owner && workspace.owner.id !== userId) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    // Delete all comments for each task, then delete tasks, then projects, then workspace
    for (const project of workspace.projects) {
      const tasks = await this.taskRepository.find({
        where: { project: { id: project.id } },
      });

      for (const task of tasks) {
        const comments = await this.commentRepository.find({
          where: { task: { id: task.id } },
        });
        await this.commentRepository.remove(comments);
      }

      await this.taskRepository.remove(tasks);
    }

    // Delete all projects
    await this.projectRepository.remove(workspace.projects);

    // Delete the workspace
    await this.workspaceRepository.remove(workspace);
  }

  async addMember(workspaceId: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const isMember = workspace.members.some((member) => member.id === userId);
    if (isMember) {
      return workspace;
    }

    // Note: In a real implementation, you would load the user and add it to the members array
    // For now, this is a placeholder for the logic
    return workspace;
  }

  async removeMember(workspaceId: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    workspace.members = workspace.members.filter((member) => member.id !== userId);
    return this.workspaceRepository.save(workspace);
  }
}
