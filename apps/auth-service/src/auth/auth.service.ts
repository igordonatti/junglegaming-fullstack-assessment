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
import { RpcException } from '@nestjs/microservices';

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
      access_token: jwtToken,
    };
  }

  async validateUser({ email, password }: LoginRequestDTO) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new RpcException(
        new HttpException('Email não encontrado.', HttpStatus.NOT_FOUND),
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Senha incorreta!', HttpStatus.UNAUTHORIZED);
    }

    const { ...safeUser } = user;
    return safeUser as unknown as User;
  }

  validateToken(token: string) {
    const decoded = this.jwtService.verify(token);

    if (!decoded)
      throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);

    return decoded;
  }
}
