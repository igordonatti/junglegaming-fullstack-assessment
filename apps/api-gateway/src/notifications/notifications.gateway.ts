import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.logger.log(`Cliente conectado: ${client.id} - UserId: ${userId}`);
      this.connectedUsers.set(userId, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove o usuário do mapa ao desconectar
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  // Deixarei como any para não ter que importar a interface de notification
  // mas considero um erro, deveria ser importada a interface de varias tipos de notificações
  sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.logger.log(
        `Sending notification to UserID: ${userId} on SocketID: ${socketId}`,
      );
      this.server.to(socketId).emit('new_notification', notification);
    }
  }
}
