import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  @EventPattern('task_created')
  handleTaskCreated(@Payload() payload: Task) {
    console.log('--- Evento Recebido: task_created ---');
    console.log(payload);
  }

  @EventPattern('task_updated')
  handleTaskUpdated(@Payload() data: any) {
    console.log('--- Evento Recebido: task_updated ---');
    console.log('Dados:', data);
  }

  @EventPattern('comment_created')
  handleCommentCreated(@Payload() data: any) {
    console.log('--- Evento Recebido: comment_created ---');
    console.log('Dados:', data);
  }
}
