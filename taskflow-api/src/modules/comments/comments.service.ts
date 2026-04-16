import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['task', 'author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['task', 'author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
    
    return comments.map(comment => {
      if (comment.author) {
        const { password, ...authorWithoutPassword } = comment.author as any;
        comment.author = authorWithoutPassword;
      }
      return comment;
    });
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { author: { id: authorId } },
      relations: ['task'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { taskId, authorId, ...commentData } = createCommentDto;
    
    const comment = this.commentRepository.create(commentData);
    
    if (taskId) {
      comment.task = { id: taskId } as any;
    }
    
    if (authorId) {
      comment.author = { id: authorId } as any;
    }
    
    const saved = await this.commentRepository.save(comment);
    const commentWithRelations = await this.commentRepository.findOne({ 
      where: { id: saved.id }, 
      relations: ['author'] 
    });
    
    if (!commentWithRelations) {
      throw new NotFoundException(`Comment with ID ${saved.id} not found after creation`);
    }
    
    // Remove password from author
    if (commentWithRelations.author) {
      const { password, ...authorWithoutPassword } = commentWithRelations.author as any;
      commentWithRelations.author = authorWithoutPassword;
    }
    
    return commentWithRelations;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.commentRepository.remove(comment);
  }
}
