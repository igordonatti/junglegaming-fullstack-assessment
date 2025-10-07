import { Body, Controller, Inject } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { Task } from 'src/tasks/entities/task.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject('API_GATEWAY_SERVICE')
    private readonly apiGatewayClient: ClientProxy,
  ) {}

  @EventPattern('task_created')
  async handleTaskCreated(
    @Payload()
    payload: {
      task: Task;
      user: { id: string; username: string };
    },
  ) {
    console.log('--- Evento Recebido: task_created ---');
    console.log('payload', payload);
    const { task, user } = payload;

    const message = `${user.username} criou uma nova tarefa: ${task.title}`;

    const notificationData: CreateNotificationDto = {
      message,
      recipientId: user.id,
    };

    const savedNotification =
      await this.notificationsService.createNotification(notificationData);

    if (savedNotification) {
      this.apiGatewayClient.emit('notification_created', {
        notification: savedNotification,
        user: user.id,
      });
    }
  }
}
