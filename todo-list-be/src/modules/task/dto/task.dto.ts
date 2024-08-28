import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export class TaskDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsNotEmpty()
  user: UserDto;

  @IsOptional()
  assignee?: UserDto;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  updatedAt: Date;
}
