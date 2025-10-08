import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useToast } from "@/components/ui/toast";
import { useNotificationsStore } from "@/contexts/notifications-store";

export function useNotificationListener() {
  const { add } = useNotificationsStore();
  const { toast } = useToast();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewNotification = (notification: {
      message: string;
      title: string;
    }) => {
      add(notification.title);

      toast({
        title: "Nova Notificação ✨",
        description: notification.message,
      });
    };

    socket.on("new_notification", onNewNotification);

    return () => {
      socket.off("new_notification", onNewNotification);
    };
  }, [add, toast]);
}
