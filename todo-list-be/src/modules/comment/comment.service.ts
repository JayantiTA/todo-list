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

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
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

    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'task'] });
  }

  async findById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: number, userId: number, content: string): Promise<Comment> {
    const comment = await this.findById(id);
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }
    comment.content = content;
    return this.commentRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findById(id);
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentRepository.delete(id);
  }
}
