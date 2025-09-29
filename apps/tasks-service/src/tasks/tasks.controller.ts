/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern } from '@nestjs/microservices';
import CreaeteTaskDTO from './dto/createTask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @MessagePattern({ cmd: 'create_task' })
  async createTask(body: CreaeteTaskDTO) {
    return await this.createTask(body);
  }
}
