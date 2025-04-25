import { Slot, Product } from "../../types";
import { Box, SimpleGrid, Text } from "@mantine/core";

interface MachineGridProps {
  rows: number;
  cols: number;
  slots: Slot[];
  selectedSlot: Slot | null;
  onSlotClick: (slot: Slot | null, slotCode: string) => void;
}
/*
interface ConvertedProduct {
  _id?: string;
  name: string;
  category?: string;
  price?: number;
  stock?: number;
}
*/

interface ConvertedSlot extends Omit<Slot, "product"> {
  slotCode: string;
  product: Product | null;
  quantity: number;
  capacity: number;
  price: number;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MachineGrid = ({
  rows,
  cols,
  slots,
  selectedSlot,
  onSlotClick,
}: MachineGridProps) => {
  // Típusbiztos átalakítás
  const getSlotByCode = (code: string): ConvertedSlot | null => {
    const originalSlot = slots.find((s) => s.slotCode === code);
    if (!originalSlot) return null;

    try {
      let convertedProduct: Product | null = null;

      if (originalSlot.product) {
        if (typeof originalSlot.product === "string") {
          // Ha string, létrehozunk egy kompatibilis Product objektumot
          convertedProduct = {
            _id: "",
            name: originalSlot.product,
            category: "",
            price: 0,
            stock: 0,
          };
        } else {
          // Ha már Product objektum, megtartjuk
          convertedProduct = originalSlot.product as Product;
        }
      }

      return {
        slotCode: originalSlot.slotCode,
        product: convertedProduct,
        quantity: originalSlot.quantity || 0,
        capacity: originalSlot.capacity,
        price: originalSlot.price,
      };
    } catch (err) {
      console.error("Slot kérése sikertelen:", err);
    }
    return null;
  };

  const handleSlotClick = (slot: ConvertedSlot | null, slotCode: string) => {
    if (onSlotClick && typeof onSlotClick === "function") {
      onSlotClick(slot, slotCode);
    } else {
      console.error("onSlotClick nem egy függvény vagy nincs megadva");
    }
  };

  return (
    <Box p="md" style={{ border: "1px solid #ddd", borderRadius: "8px" }}>
      <SimpleGrid cols={cols} spacing="xs">
        {Array.from({ length: rows }).flatMap((_, rowIdx) =>
          Array.from({ length: cols }).map((_, colIdx) => {
            const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
            const slot = getSlotByCode(slotCode);
            const isSelected = selectedSlot?.slotCode === slotCode;

            const cellStyle = {
              cursor: "pointer",
              border: "1px solid #ccc",
              height: "40px",
              backgroundColor: isSelected
                ? "#e3f2fd"
                : !slot ||
                  slot.product === null ||
                  slot.quantity <= slot.capacity / 2
                ? "#ffbabd"
                : slot.quantity == slot.capacity
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
                onClick={() => handleSlotClick(slot, slotCode)}
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
