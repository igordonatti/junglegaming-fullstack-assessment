/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { firstValueFrom } from 'rxjs';
import { ResponseTaskDTO } from './dto/responseTask.dto';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get('health')
  @isPublic()
  getTasksHealth() {
    console.log('Health check requested from api gateway to: tasks');
    return this.tasksClient.send({ cmd: 'get_tasks_health' }, {});
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDTO, @Req() req) {
    const user = req.user;

    console.log('user', user);

    const payload = {
      createTaskDto,
      user: user,
    };

    return this.tasksClient.send({ cmd: 'create_task' }, payload);
  }

  @Get()
  getTasks(@Query() paginationDto: PaginationQueryDTO) {
    return this.tasksClient.send({ cmd: 'get_tasks' }, paginationDto);
  }

  @Get(':taskId')
  async getTask(@Param('taskId', ParseUUIDPipe) taskId: string) {
    const payload = {
      taskId,
    };

    const task: ResponseTaskDTO = await firstValueFrom(
      this.tasksClient.send({ cmd: 'get_task_by_id' }, payload),
    );

    if (task && task.assigneeIds && task.assigneeIds.length > 0) {
      const assignees = await firstValueFrom(
        this.usersClient.send(
          { cmd: 'get_users_by_ids' },
          { userIds: task.assigneeIds },
        ),
      );

      task.assigneeIds = assignees;
    }

    return task;
  }

  @Delete()
  deleteTask(@Query() deleteTaskDto: DeleteTaskDTO, @Req() req) {
    const user = req.user;

    const payload = {
      deleteTaskDto,
      user: user,
    };

    return this.tasksClient.send({ cmd: 'delete_task' }, payload);
  }

  @Put()
  updateTask(
    @Body() updateTaskDto: UpdateTaskDTO,
    @Query('taskId', ParseUUIDPipe) taskId: string,
    @Req() req,
  ) {
    const user = req.user;

    updateTaskDto.taskId = taskId;

    const payload = {
      updateTaskDto,
      user: user,
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
    console.log('createCommentDto', createCommentDto);

    const payload = {
      createCommentDto,
      user: user,
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

    // Enrich comments with author data from Users Service
    return firstValueFrom(
      this.tasksClient.send({ cmd: 'all_comments_for_task' }, payload),
    ).then(async (paginated: any) => {
      try {
        const items: Array<{ authorId?: string }> = Array.isArray(
          paginated?.items,
        )
          ? paginated.items
          : [];

        const authorIds = Array.from(
          new Set(
            items
              .map((c) => c.authorId)
              .filter((id): id is string => typeof id === 'string'),
          ),
        );

        if (authorIds.length === 0) return paginated;

        const users = await firstValueFrom(
          this.usersClient.send(
            { cmd: 'get_users_by_ids' },
            { userIds: authorIds },
          ),
        );

        const byId = new Map<string, any>();
        if (Array.isArray(users)) {
          for (const u of users) {
            if (u?.id) byId.set(u.id as string, u);
          }
        }

        const enrichedItems = items.map((c: any) => ({
          ...c,
          author: c.authorId ? (byId.get(c.authorId) ?? undefined) : undefined,
        }));

        return { ...paginated, items: enrichedItems };
      } catch {
        return paginated;
      }
    });
  }
}
