import { useState } from "react";
import { NotificationType } from "./NotificationComponent";

interface NotificationState {
  message: string;
  type: NotificationType;
}

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (message: string, type: "success" | "error") => void;
  clearNotification: () => void;
}

/**
 * Custom hook for managing notification state
 * @param defaultDuration Default time in ms before notification auto-dismisses
 * @returns Object containing notification state and control functions
 */
export function useNotification(defaultDuration = 3000): UseNotificationReturn {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: null,
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });

    // Auto-clear after duration (can be overridden by passing duration to the component)
    if (defaultDuration > 0) {
      setTimeout(() => {
        clearNotification();
      }, defaultDuration);
    }
  };

  const clearNotification = () => {
    setNotification({ message: "", type: null });
  };

  return {
    notification,
    showNotification,
    clearNotification,
  };
}

export default useNotification;
