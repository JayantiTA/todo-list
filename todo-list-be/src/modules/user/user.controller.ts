import {
  Body,
  Controller,
  Post,
  Get,
  HttpException,
  HttpStatus,
  ConflictException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  async findByEmail(
    @Param('email') email: string,
  ): Promise<UserDto | undefined> {
    return this.userService.findByEmail(email);
  }
}
