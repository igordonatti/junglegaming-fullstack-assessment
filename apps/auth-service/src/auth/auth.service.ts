/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserPayload } from './dto/UserPayload.dto';
import { UserTokenDTO } from './dto/UserToken.dto';
import { LoginRequestDTO } from './dto/LoginRequest.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserTokenDTO {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      ...user,
      access_token: jwtToken,
    };
  }

  async validateUser({ email, password }: LoginRequestDTO) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email not found.', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passord);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return {
      ...user,
      password: undefined,
    };
  }

  validateToken(token: string) {
    const decoded = this.jwtService.verify(token);

    if (!decoded)
      throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);

    return decoded;
  }
}
