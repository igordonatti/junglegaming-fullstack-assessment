import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let socket: Socket | null;

export const initSocket = (userId: string): Socket => {
  if (socket) return socket;

  // Conecta ao servidor, passando o userId como query.
  // O backend usará isso no handleConnection.
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
