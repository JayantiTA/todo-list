import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { assigneeEmail } = createTaskDto;

    // Check if the assignee exists
    let assignee;
    if (assigneeEmail) {
      assignee = await this.userService.findByEmail(assigneeEmail);
      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      assigneeId: assignee?.id,
    });

    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['assignee'] });
  }

  async findById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateData: Partial<CreateTaskDto>): Promise<Task> {
    const task = await this.findById(id);

    if (updateData.assigneeEmail) {
      const assignee = await this.userService.findByEmail(
        updateData.assigneeEmail,
      );
      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
      task.assigneeId = assignee.id;
    }

    Object.assign(task, updateData);
    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
