/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { ResponseUserDTO } from './dto/responseUser.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUser: CreateUserDTO): Promise<ResponseUserDTO> {
    try {
      const user = this.userRepository.create(createUser);
      user.password = await bcrypt.hash(user.password, 10);
      await this.userRepository.save(user);

      return plainToInstance(ResponseUserDTO, user, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err.code == 23505) {
        this.logger.error(err.message);
        throw new RpcException(new ConflictException('Email já existente.'));
      }
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente!',
      );
    }
  }
}
