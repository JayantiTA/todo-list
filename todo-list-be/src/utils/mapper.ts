import { TaskDto, TaskStatus } from '../modules/task/dto/task.dto';
import { UserDto } from '../modules/user/dto/user.dto';
import { User } from '../modules/user/user.entity';
import { Task } from '../modules/task/task.entity';
import { Comment } from '../modules/comment/comment.entity';
import { CommentDto } from '../modules/comment/dto/comment.dto';

export const toUserDto = (data: User): UserDto => {
  const { id, email } = data;

  const userDto: UserDto = {
    id,
    email,
  };

  return userDto;
};

export const toTaskDto = (data: Task) => {
  const {
    id,
    title,
    description,
    status,
    dueDate,
    assignee,
    user,
    createdAt,
    updatedAt,
  } = data;

  const taskDto: TaskDto = {
    id,
    title,
    description,
    status: status as TaskStatus,
    dueDate,
    user: toUserDto(user),
    assignee: assignee ? toUserDto(assignee) : null,
    createdAt,
    updatedAt,
  };

  return taskDto;
};

export const toCommentDto = (data: Comment) => {
  const { id, content, taskId, createdAt, updatedAt } = data;

  const commentDto: CommentDto = {
    id,
    content,
    taskId,
    user: toUserDto(data.user),
    createdAt,
    updatedAt,
  };

  return commentDto;
};
