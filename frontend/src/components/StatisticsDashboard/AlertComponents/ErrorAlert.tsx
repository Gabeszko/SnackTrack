import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type ErrorAlertProps = {
  message: string | null;
};

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Betöltési hiba"
      color="red"
      radius="md"
    >
      {message}
    </Alert>
  );
};
