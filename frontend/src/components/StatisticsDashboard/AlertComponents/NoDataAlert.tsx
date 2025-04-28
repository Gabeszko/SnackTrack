import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type NoDataAlertProps = {
  activeTab: string | null;
  show: boolean;
};

export const NoDataAlert = ({ activeTab, show }: NoDataAlertProps) => {
  if (!show) return null;

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Nincs adat"
      color="yellow"
      radius="md"
      className="mt-6"
    >
      {activeTab === "machines"
        ? "A kiválasztott automatához nem található értékesítési adat."
        : "A kiválasztott termékhez nem található értékesítési adat."}
    </Alert>
  );
};
