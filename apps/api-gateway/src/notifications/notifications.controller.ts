import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications.gateway';

interface NotificationCreatedPayload {
  notification: { recipientId: string } & Record<string, unknown>;
  user: string;
}

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @EventPattern('notification_created')
  handleNotificationCreated(@Payload() payload: NotificationCreatedPayload) {
    // Expected payload shape: { notification: NotificationEntity, user: string }
    if (!payload || !payload.notification) return;
    const { notification } = payload;
    const recipientId = notification.recipientId;
    this.notificationsGateway.sendNotificationToUser(recipientId, notification);
  }
}
