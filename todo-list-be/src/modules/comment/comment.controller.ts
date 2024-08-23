import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Comment> {
    return this.commentService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body('content') content: string,
    @Body('userId') userId: number,
  ): Promise<Comment> {
    return this.commentService.update(id, userId, content);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @Body('userId') userId: number,
  ): Promise<void> {
    return this.commentService.remove(id, userId);
  }
}
