import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class CommentDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  user: UserDto;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  updatedAt: Date;
}
