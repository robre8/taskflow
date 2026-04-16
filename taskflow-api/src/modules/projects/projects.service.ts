import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['workspace', 'tasks'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['workspace'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByWorkspace(workspaceId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['workspace'],
    });
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { workspaceId, ...projectData } = createProjectDto;
    
    const project = this.projectRepository.create(projectData);
    
    if (workspaceId) {
      project.workspace = { id: workspaceId } as any;
    }
    
    return this.projectRepository.save(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['workspace', 'workspace.owner'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Verify workspace ownership
    if (project.workspace.owner.id !== userId) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['workspace', 'workspace.owner'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Verify workspace ownership
    if (project.workspace.owner.id !== userId) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    await this.projectRepository.remove(project);
  }
}
