import { Slot /*, Product*/ } from "../../types";
import { Box, SimpleGrid, Text, Button, Group } from "@mantine/core";

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

  /*
  const handleSlotClick = (slot: Slot | null) => {
    if (!slot) return;

    const isSelected = selectedSlots.some((s) => s.slotCode === slot.slotCode);

    if (isSelected) {
      // Ha már ki van jelölve ➔ vegyük ki
      setSelectedSlots(
        selectedSlots.filter((s) => s.slotCode !== slot.slotCode)
      );
    } else {
      // Ha nincs kijelölve ➔ adjuk hozzá
      setSelectedSlots([...selectedSlots, slot]);
    }
  };
*/

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  return (
    <Box p="md" style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
      <Group justify="space-between" mb="sm">
        <Text size="sm">Kattints a slotokra kijelöléshez vagy törléshez!</Text>
        <Button size="xs" variant="light" color="red" onClick={clearSelection}>
          ❌ Kijelölések törlése
        </Button>
      </Group>

      <SimpleGrid cols={cols} spacing="xs">
        {Array.from({ length: rows }).flatMap((_, rowIdx) =>
          Array.from({ length: cols }).map((_, colIdx) => {
            const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
            const slot = getSlotByCode(slotCode);

            const isSelected =
              slot && selectedSlots.some((s) => s.slotCode === slot.slotCode);

            const cellStyle = {
              cursor: "pointer",
              border: "1px solid #ccc",
              height: "40px",
              backgroundColor: isSelected
                ? "#cce5ff"
                : !slot ||
                  slot.product === null ||
                  slot.quantity <= slot.capacity / 2
                ? "#ffbabd"
                : slot.quantity === slot.capacity
                ? "white"
                : "#ffebbb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative" as const,
            };

            return (
              <Box
                key={slotCode}
                style={cellStyle}
                onClick={() => onSlotClick(slot)}
              >
                <Text size="s" fw={500}>
                  {slotCode}
                </Text>
              </Box>
            );
          })
        )}
      </SimpleGrid>
    </Box>
  );
};

export default MachineGrid;
