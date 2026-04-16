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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Comment created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
    createCommentDto.authorId = user.id;
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments retrieved successfully' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get comments by task' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments retrieved successfully' })
  findByTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get comments by author' })
  @ApiParam({ name: 'authorId', description: 'User UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments retrieved successfully' })
  findByAuthor(@Param('authorId', ParseUUIDPipe) authorId: string) {
    return this.commentsService.findByAuthor(authorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comment not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comment not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Comment deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Comment not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.remove(id, user.id);
  }
}
