import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserDto } from '../user/dto/user.dto';
import { TaskDto } from './dto/task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskDto> {
    const { user } = req as unknown as { user: UserDto };
    const userId = user.id;

    return await this.taskService.create({
      ...createTaskDto,
      userId: userId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<TaskDto[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: number): Promise<TaskDto> {
    return this.taskService.findById(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Param('userId') userId: number): Promise<TaskDto[]> {
    return this.taskService.findByUserId(userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() updateData: Partial<CreateTaskDto>,
  ): Promise<TaskDto> {
    const { user } = req as unknown as { user: UserDto };
    const userId = user.id;

    const task: TaskDto = await this.taskService.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.user.id !== userId) {
      throw new UnauthorizedException(
        `You are not authorized to update this task`,
      );
    }

    return this.taskService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.taskService.remove(id);
  }
}
