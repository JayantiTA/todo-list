import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../modules/user/dto/login-user.dto';
import { RegistrationStatus } from './interface/registration-status.interface';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';
import { LoginStatus } from './interface/login-status.interface';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './interface/payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  }

  @Get('whoami')
  @UseGuards(AuthGuard())
  public async testAuth(@Req() req: Express.Request): Promise<JwtPayload> {
    return req as JwtPayload;
  }
}
