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
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
@ApiBearerAuth()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Workspace created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Workspace with this slug already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspaces retrieved successfully' })
  findAll() {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspace retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workspace not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workspacesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get workspace by slug' })
  @ApiParam({ name: 'slug', description: 'Workspace slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspace retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workspace not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.workspacesService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Workspace updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workspace not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Slug already exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workspace by ID' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Workspace deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workspace not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.workspacesService.remove(id);
  }

  @Post(':id/members/:userId')
  @ApiOperation({ summary: 'Add member to workspace' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Member added successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workspace not found' })
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.workspacesService.addMember(id, userId);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from workspace' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Member removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Workspace not found' })
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.workspacesService.removeMember(id, userId);
  }
}
