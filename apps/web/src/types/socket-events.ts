export type SocketNotification = {
  id?: number;
  message: string;
  recipientId: string;
  isRead?: boolean;
  createdAt?: string | Date;
};

export type ServerToClientEvents = {
  new_notification: (payload: SocketNotification) => void;
  "task:created"?: (payload: unknown) => void;
  "task:updated"?: (payload: unknown) => void;
  "comment:new"?: (payload: unknown) => void;
  "notification:new"?: (payload: unknown) => void;
};

export type ClientToServerEvents = Record<string, never>;
