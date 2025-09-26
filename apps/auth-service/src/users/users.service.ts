/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
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

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  private logger = new Logger();
  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async createUser(createUser: CreateUserDTO): Promise<ResponseUserDTO> {
    try {
      const user = await this.userRepository.create(createUser);
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
