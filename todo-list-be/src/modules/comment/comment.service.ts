import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { CommentDto } from './dto/comment.dto';
import { toCommentDto } from '../../utils/mapper';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentDto> {
    const { userId, taskId, content } = createCommentDto;

    const user = await this.userService.findById(userId);
    const task = await this.taskService.findById(taskId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const comment = this.commentRepository.create({
      content,
      userId,
      taskId,
      user,
      task,
    });

    const commentResult = await this.commentRepository.save(comment);
    return toCommentDto(commentResult);
  }

  async findAll(): Promise<CommentDto[]> {
    const comments = await this.commentRepository.find({
      relations: ['user', 'task'],
    });
    return comments.map((comment) => toCommentDto(comment));
  }

  async findById(id: number): Promise<CommentDto> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return toCommentDto(comment);
  }

  async update(
    id: number,
    editCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    const comment = await this.findById(id);
    if (comment.user.id !== editCommentDto.userId) {
      throw new ForbiddenException('You can only update your own comments');
    }
    comment.content = editCommentDto.content;
    const updatedComment = await this.commentRepository.save(comment);
    return toCommentDto(updatedComment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findById(id);
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentRepository.delete(id);
  }

  async removeByTaskId(taskId: number): Promise<void> {
    await this.commentRepository.delete({ taskId });
  }
}
