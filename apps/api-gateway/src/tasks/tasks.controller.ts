/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import CreateTaskDTO from './dto/createTask.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Get('health')
  getTasksHealth() {
    console.log('Health check requested from api gateway to: tasks');
    return this.tasksClient.send({ cmd: 'get_tasks_health' }, {});
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDTO, @Req() req) {
    const user = req.user;

    const payload = {
      createTaskDto,
      userId: user.id,
    };

    return this.tasksClient.send({ cmd: 'create_task' }, payload);
  }

  @Get()
  getTasks() {
    return this.tasksClient.send({ cmd: 'get_tasks' }, {});
  }

  @Delete(':taskId')
  deleteTask(@Param('taskId') taskId: string, @Req() req) {
    const user = req.user;

    const payload = {
      taskId,
      userId: user.id,
    };

    return this.tasksClient.send({ cmd: 'delete_task' }, payload);
  }
}
