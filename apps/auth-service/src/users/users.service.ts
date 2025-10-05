/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'username'],
    });
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

  async findById(id: string): Promise<ResponseUserDTO> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new RpcException(
          new ForbiddenException('Usuário não encontrado'),
        );
      }

      return plainToInstance(ResponseUserDTO, user, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof RpcException) throw err;
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente!',
      );
    }
  }

  async findUsersByIds(
    userIds: string[],
  ): Promise<Omit<User, 'password' | 'hashedRefreshToken'>[]> {
    console.log('service', userIds);

    try {
      if (!userIds || userIds.length === 0) {
        return [];
      }
      return this.userRepository.find({
        where: {
          id: In(userIds),
        },
        select: ['id', 'username', 'email'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente!',
      );
    }
  }

  async logout(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new RpcException(
          new ForbiddenException('Usuário não encontrado'),
        );
      }

      const result = await this.userRepository.update(id, {
        refreshToken: undefined,
      });

      return result;
    } catch (err) {
      if (err instanceof RpcException) throw err;
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Algo deu errado, tente novamente!',
      );
    }
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
