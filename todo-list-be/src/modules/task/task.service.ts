import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserService } from '../user/user.service';
import { TaskDto } from './dto/task.dto';
import { toTaskDto } from '../../utils/mapper';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDto> {
    const { assigneeEmail } = createTaskDto;

    let assignee: UserDto;
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

    const taskResult = await this.taskRepository.save(task);
    const taskWithRelations = await this.taskRepository.findOne({
      where: { id: taskResult.id },
      relations: ['user', 'assignee'],
    });
    return toTaskDto(taskWithRelations);
  }

  async findAll(): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.find({
      relations: ['user', 'assignee'],
    });
    return tasks.map((task) => toTaskDto(task));
  }

  async findById(id: number): Promise<TaskDto> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'assignee'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return toTaskDto(task);
  }

  async findByUserId(userId: number): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.find({
      where: [{ userId: userId }, { assigneeId: userId }],
    });
    return tasks.map((task) => toTaskDto(task));
  }

  async update(
    id: number,
    updateData: Partial<CreateTaskDto>,
  ): Promise<TaskDto> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'assignee'],
    });

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
    const updatedTask = await this.taskRepository.save(task);
    return toTaskDto(updatedTask);
  }

  async remove(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (task) {
      await this.taskRepository.delete(id);
    } else {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
