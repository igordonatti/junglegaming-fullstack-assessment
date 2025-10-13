import { Body, Controller, Inject, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { Task } from 'src/tasks/entities/task.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController implements OnModuleInit {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject('API_GATEWAY_SERVICE')
    private readonly apiGatewayClient: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.apiGatewayClient.connect();
      console.log('[notifications-service] Connected to API_GATEWAY_SERVICE');
    } catch (err) {
      console.error(
        '[notifications-service] Failed to connect to API_GATEWAY_SERVICE',
        err,
      );
    }
  }

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

  @EventPattern('task_assigned')
  async handleTaskAssigned(
    @Payload()
    payload: {
      task: Task;
      assignedUserId: string;
      user: { id: string; username: string };
    },
  ) {
    console.log('--- Evento Recebido: task_assigned ---');
    console.log('payload', payload);
    const { task, assignedUserId, user } = payload;

    const message = `${user.username} atribuiu você à tarefa: ${task.title}`;

    const notificationData: CreateNotificationDto = {
      message,
      recipientId: assignedUserId,
    };

    const savedNotification =
      await this.notificationsService.createNotification(notificationData);

    if (savedNotification) {
      this.apiGatewayClient.emit('notification_created', {
        notification: savedNotification,
        user: assignedUserId,
      });
    }
  }

  @EventPattern('comment_created')
  async handleCommentCreated(
    @Payload()
    payload: {
      comment: { id: string; content: string; authorId: string };
      task: Task;
      recipientId: string;
    },
  ) {
    console.log('--- Evento Recebido: comment_created ---');
    console.log('payload', payload);
    const { task, recipientId, comment } = payload;

    const message = `Novo comentário em "${task.title}": ${comment.content}`;

    const notificationData: CreateNotificationDto = {
      message,
      recipientId,
    };

    const savedNotification =
      await this.notificationsService.createNotification(notificationData);

    if (savedNotification) {
      this.apiGatewayClient.emit('notification_created', {
        notification: savedNotification,
        user: recipientId,
      });
    }
  }
}
