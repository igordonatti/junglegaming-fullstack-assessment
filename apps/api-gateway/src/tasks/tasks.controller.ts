/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import CreateTaskDTO from './dto/createTask.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';

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

  @Delete()
  deleteTask(@Query() deleteTaskDto: DeleteTaskDTO, @Req() req) {
    const user = req.user;

    const payload = {
      deleteTaskDto,
      userId: user.id,
    };

    return this.tasksClient.send({ cmd: 'delete_task' }, payload);
  }

  @Put()
  updateTask(@Body() updateTaskDto: UpdateTaskDTO, @Req() req) {
    const user = req.user;

    const payload = {
      updateTaskDto,
      userId: user.id,
    };

    return this.tasksClient.send({ cmd: 'update_task' }, payload);
  }
}
