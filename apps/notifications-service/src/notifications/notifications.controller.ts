import { Body, Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Task } from 'src/tasks/entities/task.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('task_created')
  handleTaskCreated(
    @Payload()
    payload: {
      data: Task;
      user: { userId: string; username: string };
    },
  ) {
    console.log('--- Evento Recebido: task_created ---');
    const { data, user } = payload;

    const message = `${user.username} criou uma nova tarefa: ${data.title}`;

    const notificationData: CreateNotificationDto = {
      message,
      recipientId: user.userId,
    };

    const notification =
      this.notificationsService.createNotification(notificationData);

    return notification;
  }
}
