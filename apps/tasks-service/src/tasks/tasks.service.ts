/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreaeteTaskDTO from './dto/createTask.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateTaskDTO } from './dto/updateTask.dto';

@Injectable()
export class TasksService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(taskDTO: CreaeteTaskDTO, user: { userId: string }) {
    try {
      const task = this.taskRepository.create({
        ...taskDTO,
        creatorId: user.userId,
      });
      return await this.taskRepository.save(task);
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }

  async updateTask(taskDTO: UpdateTaskDTO, user: { userId: string }) {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskDTO.taskId });

      if (!task)
        throw new RpcException(new NotFoundException('Task não encontrada.'));

      if (task.creatorId !== user.userId)
        throw new RpcException(
          new ForbiddenException('Você não é autorizado a editar esta task.'),
        );

      Object.assign(task, taskDTO);
      return this.taskRepository.save(task);
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }

  async deleteTask(taskId: string, user: { userId: string }) {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });

      if (!task)
        throw new RpcException(new NotFoundException('Task não encontrada.'));

      if (task.creatorId !== user.userId)
        throw new RpcException(
          new ForbiddenException('Você não é autorizado a deletar esta task.'),
        );

      return await this.taskRepository.delete({ id: taskId });
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }

  async getTaskById(taskId: string) {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });

      if (!task)
        throw new RpcException(new NotFoundException('Task não encontrada.'));

      return task;
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }
}
