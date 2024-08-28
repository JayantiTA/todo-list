import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';
import { RegistrationStatus } from './interface/registration-status.interface';
import { UserService } from '../modules/user/user.service';
import { LoginStatus } from './interface/login-status.interface';
import { LoginDto } from '../modules/user/dto/login-user.dto';
import { UserDto } from '../modules/user/dto/user.dto';
import { JwtPayload } from './interface/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  async login(loginUserDto: LoginDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);

    const token = this._createToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private _createToken({ email }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
