import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [TasksModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
