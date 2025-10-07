import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

const apiGatewayHost =
  process.env.API_GATEWAY_HOST ||
  (process.env.NODE_ENV === 'production' ? 'api-gateway' : 'localhost');
const apiGatewayPort = Number(process.env.API_GATEWAY_PORT ?? 3001);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'API_GATEWAY_SERVICE', // Token de injeção
        transport: Transport.TCP,
        options: {
          host: apiGatewayHost, // Nome do serviço no docker-compose ou localhost em dev
          port: apiGatewayPort, // Porta do gateway
        },
      },
    ]),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
