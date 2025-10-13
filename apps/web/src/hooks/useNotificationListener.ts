import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useNotificationsStore } from "@/contexts/notifications-store";
import { toast } from "sonner";

export function useNotificationListener() {
  const { add } = useNotificationsStore();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewNotification = (notification: { message: string }) => {
      console.log("Nova notificação recebida:", notification);
      add(notification.message);

      toast("Nova Notificação ✨", {
        description: notification.message,
      });
    };

    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("new_notification", onNewNotification);
    };
  }, [add, toast]);
}
