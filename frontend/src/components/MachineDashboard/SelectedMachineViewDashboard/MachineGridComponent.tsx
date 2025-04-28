import { Slot, COLORS } from "../../types";
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Group,
  Tooltip,
  Badge,
  Flex,
} from "@mantine/core";
import { IconTrash, IconCheckbox } from "@tabler/icons-react";

interface MachineGridProps {
  rows: number;
  cols: number;
  slots: Slot[];
  selectedSlots: Slot[];
  setSelectedSlots: (slots: Slot[]) => void;
  onSlotClick: (slot: Slot | null) => void;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MachineGrid = ({
  rows,
  cols,
  slots,
  selectedSlots,
  setSelectedSlots,
  onSlotClick,
}: MachineGridProps) => {
  const getSlotByCode = (code: string): Slot | null => {
    return slots.find((s) => s.slotCode === code) || null;
  };

  const handleSelectAll = () => {
    setSelectedSlots([...slots]);
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  // Slot állapot számítások
  const emptyCount = slots.filter(
    (s) => !s.product || s.product === null || s.quantity === 0
  ).length;
  const BottomHalfCount = slots.filter((s) =>
    s.product ? s.quantity <= s.capacity / 2 && s.quantity != 0 : 0
  ).length;
  const UpperHalfCount = slots.filter((s) =>
    s.product ? s.quantity >= s.capacity / 2 && s.quantity != s.capacity : 0
  ).length;
  const fullCount = slots.filter((s) =>
    s.product ? s.quantity === s.capacity : 0
  ).length;

  return (
    <Box
      p="md"
      style={{
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        boxShadow: "var(--mantine-shadow-sm)",
      }}
    >
      <Group justify="flex-start" mb="md">
        <Text fw={500}>Automata elrendezés</Text>
        <Group mt="xs">
          <Badge color={COLORS.danger}>{emptyCount} üres</Badge>
          <Badge color={COLORS.warning}>{BottomHalfCount} alacsony</Badge>
          <Badge color={COLORS.success}>{UpperHalfCount} sok</Badge>
          <Badge color={COLORS.primary}>{fullCount} tele</Badge>
        </Group>
      </Group>

      <Group mb="md" mt="xs">
        <Tooltip label="Összes kijelölése">
          <Button
            size="xs"
            variant="outline"
            leftSection={<IconCheckbox size={14} />}
            onClick={handleSelectAll}
          >
            Összes
          </Button>
        </Tooltip>

        <Tooltip label="Kijelölések törlése">
          <Button
            size="xs"
            variant="outline"
            color={COLORS.dark}
            leftSection={<IconTrash size={14} />}
            onClick={clearSelection}
          >
            Unselect
          </Button>
        </Tooltip>
      </Group>

      <SimpleGrid cols={cols} mt="xs">
        {Array.from({ length: rows }).flatMap((_, rowIdx) =>
          Array.from({ length: cols }).map((_, colIdx) => {
            const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
            const slot = getSlotByCode(slotCode);

            const isSelected =
              slot && selectedSlots.some((s) => s.slotCode === slot.slotCode);

            const isEmpty = !slot || slot.product === null;
            const isLow =
              slot && slot.product && slot.quantity <= slot.capacity / 2;
            const isFull =
              slot && slot.product && slot.quantity === slot.capacity;

            const getStatusColor = () => {
              if (isSelected) return "#e6f7ff";
              if (isEmpty) return "#fff1f0";
              if (isLow) return "#fff7e6";
              if (isFull) return "#f6ffed";
              return "#f5f5f5";
            };

            const getStatusBorder = () => {
              if (isSelected) return "2px solid #1890ff";
              if (isEmpty) return "1px solid #ffccc7";
              if (isLow) return "1px solid #ffd591";
              if (isFull) return "1px solid #b7eb8f";
              return "1px solid #d9d9d9";
            };

            const cellStyle = {
              cursor: "pointer",
              border: getStatusBorder(),
              borderRadius: "4px",
              height: "50px",
              backgroundColor: getStatusColor(),
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              position: "relative" as const,
              transition: "all 0.2s ease",
              boxShadow: isSelected
                ? "0 0 0 2px rgba(24, 144, 255, 0.3)"
                : "none",
            };

            const productName = slot?.product
              ? typeof slot.product === "object"
                ? slot.product.name
                : "Termék"
              : "Üres";

            return (
              <Tooltip
                key={slotCode}
                label={
                  slot
                    ? `${slotCode}: ${productName} (${slot.quantity}/${slot.capacity}) - ${slot.price} Ft`
                    : `${slotCode}: Nem konfigurált`
                }
                position="top"
                withArrow
              >
                <Box style={cellStyle} onClick={() => onSlotClick(slot)}>
                  <Text size="sm" fw={700} mb={1}>
                    {slotCode}
                  </Text>
                  {slot && slot.product && (
                    <Text size="xs" c="dimmed">
                      {slot.quantity}/{slot.capacity}
                    </Text>
                  )}
                </Box>
              </Tooltip>
            );
          })
        )}
      </SimpleGrid>

      <Flex justify="space-between" mt="md">
        <Text size="xs" c="dimmed">
          Kattints egy slotra a kijelöléshez
        </Text>
        {selectedSlots.length > 0 && (
          <Badge>{selectedSlots.length} kijelölve</Badge>
        )}
      </Flex>
    </Box>
  );
};

export default MachineGrid;
