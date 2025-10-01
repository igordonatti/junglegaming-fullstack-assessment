import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import CreateTaskDTO from './dto/createTask.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @MessagePattern({ cmd: 'create_task' })
  async createTask(
    @Payload() payload: { createTaskDto: CreateTaskDTO; userId: string },
  ) {
    return await this.taskService.createTask(
      payload.createTaskDto,
      payload.userId,
    );
  }

  @MessagePattern({ cmd: 'update_task' })
  async updateTask(
    @Payload() payload: { updateTaskDto: UpdateTaskDTO; userId: string },
  ) {
    return await this.taskService.updateTask(
      payload.updateTaskDto,
      payload.userId,
    );
  }

  @MessagePattern({ cmd: 'delete_task' })
  async deleteTask(
    @Payload() payload: { deleteTaskDto: DeleteTaskDTO; userId: string },
  ) {
    return await this.taskService.deleteTask(
      payload.deleteTaskDto.taskId,
      payload.userId,
    );
  }

  @MessagePattern({ cmd: 'get_task_by_id' })
  async getTaskById(@Payload() payload: { taskId: string }) {
    return await this.taskService.getTaskById(payload.taskId);
  }

  @MessagePattern({ cmd: 'get_tasks' })
  findAll(@Payload() paginationQuery: PaginationQueryDTO) {
    return this.taskService.findAll({
      page: paginationQuery.page || 1,
      limit: paginationQuery.limit || 20,
    });
  }
}
