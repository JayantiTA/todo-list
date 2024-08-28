import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDto } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<CommentDto> {
    const { user } = req as unknown as { user: UserDto };
    createCommentDto.userId = user.id;

    return this.commentService.create(createCommentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<CommentDto[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: number): Promise<CommentDto> {
    return this.commentService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() editCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<CommentDto> {
    const { user } = req as unknown as { user: UserDto };
    editCommentDto.userId = user.id;

    return this.commentService.update(id, editCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: number,
    @Body('userId') userId: number,
  ): Promise<void> {
    return this.commentService.remove(id, userId);
  }

  @Delete('task/:taskId')
  @UseGuards(JwtAuthGuard)
  removeByTaskId(@Param('taskId') taskId: number): Promise<void> {
    return this.commentService.removeByTaskId(taskId);
  }
}
