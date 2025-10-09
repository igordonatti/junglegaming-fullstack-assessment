import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'API_GATEWAY_SERVICE', // Token de injeção
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const host =
            config.get<string>('API_GATEWAY_HOST') ||
            (config.get<string>('NODE_ENV') === 'production'
              ? 'api-gateway'
              : '0.0.0.0');
          const port = Number(config.get('API_GATEWAY_PORT', 3001));
          return {
            transport: Transport.TCP,
            options: {
              host,
              port,
            },
          };
        },
      },
    ]),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
