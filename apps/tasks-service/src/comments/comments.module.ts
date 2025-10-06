import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI as string],
          queue: 'notifications_queue',
        },
      },
    ]),
  ],
})
export class CommentsModule {}
