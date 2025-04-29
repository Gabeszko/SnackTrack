import { ReactNode, useEffect } from "react";
import { Notification, Transition } from "@mantine/core";
import { IconChecks, IconAlertCircle } from "@tabler/icons-react";

export type NotificationType = "success" | "error" | null;

export interface NotificationProps {
  message: string;
  type: NotificationType;
  duration?: number;
  onClose: () => void;
}
function NotificationComponent({
  message,
  type,
  duration = 3000,
  onClose,
}: NotificationProps) {
  // Auto-close notification after specified duration
  useEffect(() => {
    if (message && type) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onClose]);

  // Don't render anything if there's no notification
  if (!type || !message) {
    return null;
  }

  // Select icon based on notification type
  const icon: ReactNode =
    type === "success" ? (
      <IconChecks size={18} />
    ) : (
      <IconAlertCircle size={18} />
    );

  // Title based on notification type
  const title = type === "success" ? "Sikeres művelet" : "Hiba történt";

  return (
    <Transition
      mounted={!!message}
      transition="slide-down"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <Notification
          style={{
            ...styles,
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
          }}
          color={type === "success" ? "green" : "red"}
          title={title}
          icon={icon}
          withCloseButton
          onClose={onClose}
        >
          {message}
        </Notification>
      )}
    </Transition>
  );
}

export default NotificationComponent;
