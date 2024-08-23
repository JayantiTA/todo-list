import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export class CreateTaskDto {
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
  userId: number;

  @IsOptional()
  @IsString()
  assigneeEmail?: string;
}
