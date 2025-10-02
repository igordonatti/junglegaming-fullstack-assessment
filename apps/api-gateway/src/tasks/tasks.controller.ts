/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import CreateTaskDTO from './dto/createTask.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import { CreateCommentDTO } from './dto/createComment.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';

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
  getTasks(@Query() paginationDto: PaginationQueryDTO) {
    console.log(paginationDto);

    return this.tasksClient.send({ cmd: 'get_tasks' }, paginationDto);
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

  @Post(':id/comments')
  createComment(
    @Body() createCommentDto: CreateCommentDTO,
    @Param('id', ParseUUIDPipe) taskId: string,
    @Req() req,
  ) {
    const user = req.user;
    createCommentDto.taskId = taskId;

    const payload = {
      createCommentDto,
      userId: user.id,
    };

    return this.tasksClient.send({ cmd: 'create_comment' }, payload);
  }

  @Get(':id/comments')
  getAllComentsForTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Query() paginationDto: PaginationQueryDTO,
  ) {
    const payload = {
      taskId,
      paginationQuery: paginationDto,
    };

    return this.tasksClient.send({ cmd: 'all_comments_for_task' }, payload);
  }
}
