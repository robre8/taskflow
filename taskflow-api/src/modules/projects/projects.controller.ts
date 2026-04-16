import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Project created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Projects retrieved successfully' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Get projects by workspace' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Projects retrieved successfully' })
  findByWorkspace(@Param('workspaceId', ParseUUIDPipe) workspaceId: string) {
    return this.projectsService.findByWorkspace(workspaceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Project retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Project updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.update(id, updateProjectDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Project deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.remove(id, user.id);
  }
}
