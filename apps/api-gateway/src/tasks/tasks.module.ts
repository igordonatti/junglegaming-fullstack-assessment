import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

const tasksHost = process.env.TASKS_HOST || 'localhost';
const tasksPort = Number(process.env.TASKS_PORT) || 3003;

const usersHost = process.env.USERS_HOST || 'localhost';
const usersPort = Number(process.env.USERS_PORT) || 3002;

console.log('task host', process.env.TASKS_HOST);
console.log('tasksPort', process.env.TASKS_PORT);
console.log('usersHost', process.env.USERS_HOST);
console.log('usersPort', process.env.USERS_PORT);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASKS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: tasksHost,
          port: tasksPort,
        },
      },
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: usersHost,
          port: usersPort,
        },
      },
    ]),
  ],
  controllers: [TasksController],
})
export class TasksModule {}
