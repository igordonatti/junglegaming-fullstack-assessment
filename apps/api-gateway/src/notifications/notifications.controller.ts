/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @EventPattern('notification_created')
  handleNotificationCreated(@Payload() notification: any) {
    console.log('notification', notification);
    const recipientId = notification.recipientId as string;
    this.notificationsGateway.sendNotificationToUser(recipientId, notification);
  }
}
