/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import CreaeteTaskDTO from './dto/createTask.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class TasksService {
  private logger = new Logger();
  private readonly taskRepository: Repository<Task>;

  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
    private readonly dataSource: DataSource,
  ) {
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  async createTask(taskDTO: CreaeteTaskDTO, user: UserDTO) {
    try {
      const task = this.taskRepository.create({
        ...taskDTO,
        creatorId: user.id,
      });
      const savedTask = await this.taskRepository.save(task);

      this.notificationsClient.emit('task_created', { task: savedTask, user });

      if (
        Array.isArray(savedTask.assigneeIds) &&
        savedTask.assigneeIds.length > 0
      ) {
        for (const assignedUserId of savedTask.assigneeIds) {
          this.notificationsClient.emit('task_assigned', {
            task: savedTask,
            assignedUserId,
            user,
          });
        }
      }

      return savedTask;
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDTO, user: UserDTO) {
    try {
      const task = await this.taskRepository.findOneBy({
        id: updateTaskDto.taskId,
      });

      if (!task)
        throw new RpcException(new NotFoundException('Task não encontrada.'));

      if (task.creatorId !== user.id)
        throw new RpcException(
          new ForbiddenException('Você não é autorizado a editar esta task.'),
        );

      const previousAssigneeIds = Array.isArray(task.assigneeIds)
        ? [...task.assigneeIds]
        : [];

      const updatedTask = Object.assign(task, updateTaskDto);
      const savedTask = await this.taskRepository.save(updatedTask);

      // Emit generic update event
      this.notificationsClient.emit('task_updated', {
        task: savedTask,
        user,
      });

      // If assignees changed, notify only newly added assignees
      const nextAssigneeIds = Array.isArray(savedTask.assigneeIds)
        ? savedTask.assigneeIds
        : [];
      const newlyAssigned = nextAssigneeIds.filter(
        (assigneeId) => !previousAssigneeIds.includes(assigneeId),
      );

      for (const assignedUserId of newlyAssigned) {
        this.notificationsClient.emit('task_assigned', {
          task: savedTask,
          assignedUserId,
          user, // who assigned
        });
      }

      return savedTask;
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException(
        new InternalServerErrorException('Algo deu errado, tente novamente!'),
      );
    }
  }

  async deleteTask(taskId: string, user: UserDTO) {
    try {
      const task = await this.taskRepository.findOneBy({ id: taskId });

      if (!task)
        throw new RpcException(new NotFoundException('Task não encontrada.'));

      if (task.creatorId !== user.id)
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

  findAll(options: IPaginationOptions): Promise<Pagination<Task>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.orderBy('task.created_at', 'DESC');

    return paginate<Task>(queryBuilder, options);
  }
}
