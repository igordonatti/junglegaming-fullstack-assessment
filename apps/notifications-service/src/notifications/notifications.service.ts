import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Notification } from './entities/notifications.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsService {
  private logger = new Logger();
  private readonly notificationsRepository: Repository<Notification>;

  constructor(
    @Inject('API_GATEWAY_SERVICE')
    private readonly apiGatewayClient: ClientProxy,
    private readonly dataSource: DataSource,
  ) {
    this.notificationsRepository = this.dataSource.getRepository(Notification);
  }

  async createNotification(notification: CreateNotificationDto) {
    console.log('notification', notification);

    try {
      const newNotification = this.notificationsRepository.create(notification);
      const notificationSaved =
        await this.notificationsRepository.save(newNotification);

      this.apiGatewayClient.emit('notification_created', {
        notification: notificationSaved,
        user: notification.recipientId,
      });

      console.log('notificationSaved', notificationSaved);

      return notificationSaved;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
