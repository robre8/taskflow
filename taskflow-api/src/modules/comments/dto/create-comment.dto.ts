import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsUUID()
  @IsNotEmpty()
  taskId: string;

  @IsUUID()
  @IsOptional()
  authorId?: string;
}
