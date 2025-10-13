import { io, Socket } from "socket.io-client";

// Socket.IO server runs on the same HTTP port as the API Gateway (3000 by default)
const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let socket: Socket | null;

export const initSocket = (userId: string): Socket => {
  if (socket) return socket;

  socket = io(URL, {
    query: {
      userId,
    },
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected successfully!");
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected.");
  });

  return socket;
};

// Função para obter a instância do socket
export const getSocket = (): Socket | null => {
  if (!socket) {
    console.warn("Socket.IO not initialized.");
    return null;
  }
  return socket;
};

// Função para fechar a conexão
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
