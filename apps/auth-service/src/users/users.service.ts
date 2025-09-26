/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { ResponseUserDTO } from './dto/responseUser.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  private logger = new Logger();
  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

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
        this.logger.error(err.message, err.stack);
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async findByEmail(email: string): Promise<ResponseUserDTO> {
    try {
      const user = await this.userRepository.findOneBy({ email });

      return plainToInstance(ResponseUserDTO, user, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err.code === 23505) {
        this.logger.error(err.message, err.stack);
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Sommething went wrong, Try again!',
      );
    }
  }
}
