import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ApiException } from 'src/helpers/exceptions/api.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(LoginDto: LoginDto) {
    const user = await this.usersService.find.byEmail(LoginDto.email);

    if (!user) {
      throw new ApiException(
        {
          key: 'NOT_FOUND',
          args: {
            field: 'User',
          },
        },
        'NOT_FOUND',
      );
    }

    return {
      access_token: this.jwtService.sign({ id: user.id }),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.find.byEmail(registerDto.email);

    if (user) {
      throw new ApiException(
        {
          key: 'ALREADY_EXISTS',
          args: {
            field: 'User',
          },
        },
        'BAD_REQUEST',
      );
    }

    return this.usersService.create.one(registerDto);
  }
}
