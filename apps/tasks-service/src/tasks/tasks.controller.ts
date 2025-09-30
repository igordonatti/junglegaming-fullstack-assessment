import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import CreateTaskDTO from './dto/createTask.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import { UserPayload } from 'src/payloads/user.payload';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @MessagePattern({ cmd: 'create_task' })
  async createTask(
    @Payload() payload: { createTaskDto: CreateTaskDTO; user: UserPayload },
  ) {
    return await this.taskService.createTask(
      payload.createTaskDto,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'update_task' })
  async updateTask(
    @Payload() payload: { updateTaskDto: UpdateTaskDTO; user: UserPayload },
  ) {
    return await this.taskService.updateTask(
      payload.updateTaskDto,
      payload.user,
    );
  }

  @MessagePattern({ cmd: 'delete_task' })
  async deleteTask(@Payload() payload: { taskId: string; user: UserPayload }) {
    return await this.taskService.deleteTask(payload.taskId, payload.user);
  }

  @MessagePattern({ cmd: 'get_task_by_id' })
  async getTaskById(@Payload() payload: { taskId: string }) {
    return await this.taskService.getTaskById(payload.taskId);
  }
}
