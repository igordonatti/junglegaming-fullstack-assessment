import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TASKS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>('TASKS_HOST', '0.0.0.0');
          const port = Number(configService.get('TASKS_PORT', 3003));
          return {
            transport: Transport.TCP,
            options: {
              host,
              port,
            },
          };
        },
      },
      {
        name: 'USERS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const host = configService.get<string>('USERS_HOST', '0.0.0.0');
          const port = Number(configService.get('USERS_PORT', 3002));
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
  controllers: [TasksController],
})
export class TasksModule {}
