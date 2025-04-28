import { useState } from "react";
import { Slot, Product, letters } from "../../types";
import {
  Paper,
  Text,
  Group,
  Title,
  Divider,
  Box,
  Button,
  List,
  Flex,
  Badge,
  Tooltip,
} from "@mantine/core";
import { IconClipboardCheck } from "@tabler/icons-react";
import axios from "axios";

interface RefillableProductsProps {
  slots: Slot[];
  rows: number;
  cols: number;
  machineId: string;
  onRefill?: () => void;
}

const RefillableProducts = ({
  slots,
  rows,
  cols,
  machineId,
  onRefill,
}: RefillableProductsProps) => {
  const [loading, setLoading] = useState(false);
  //  const [assignedToMe, setAssignedToMe] = useState(false);

  const getProductName = (
    product: Product | string | null | undefined
  ): string => {
    if (!product) return "Nincs termék";

    if (typeof product === "string") {
      return product;
    }

    if (typeof product === "object" && "name" in product) {
      return product.name || "Ismeretlen termék";
    }

    return "Ismeretlen termék";
  };

  const getProductId = (
    product: Product | string | null | undefined
  ): string => {
    if (!product) return "Nincs termék";

    if (typeof product === "string") {
      return product;
    }

    if (typeof product === "object" && "name" in product) {
      return product._id || "Ismeretlen termék";
    }

    return "Ismeretlen termék";
  };

  // Hiányzó slotok kiszámítása
  const missingSlots = Array.from({ length: rows }).flatMap((_, rowIdx) =>
    Array.from({ length: cols })
      .map((_, colIdx) => {
        const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
        const slot = slots.find((s) => s.slotCode === slotCode);

        if (!slot || slot.product === null || slot.quantity !== slot.capacity) {
          return {
            slotCode,
            productName: getProductName(slot?.product),
            productId: getProductId(slot?.product),
            capacity: slot?.capacity || 0,
            quantity: slot?.quantity || 0,
            price: slot?.price || 0,
            critical: slot ? slot.quantity <= slot.capacity / 2 : true,
          };
        }
        return null;
      })
      .filter(Boolean)
  );

  /*
  const handleAssignToMe = async () => {
    setLoading(true);
    try {
      // Itt kell implementálni a backend hívást
      console.log("Feladat átvéve:", machineId);
      // Példa implementáció
      // await axios.post(`http://localhost:5000/api/machines/${machineId}/assign`);
      setAssignedToMe(true);
    } catch (error) {
      console.error("Hiba a feladat átvételekor:", error);
    } finally {
      setLoading(false);
    }
  };

          <Tooltip
          label={
            assignedToMe
              ? "Már átvetted ezt a feladatot"
              : "Jelentkezz a feltöltési feladatra"
          }
        >
          <Button
            leftSection={<IconTruckDelivery size={16} />}
            variant={assignedToMe ? "filled" : "outline"}
            color={assignedToMe ? "blue" : "gray"}
            onClick={handleAssignToMe}
            loading={loading}
            disabled={assignedToMe || missingSlots.length === 0}
          >
            {assignedToMe ? "Feladat hozzám rendelve" : "Átveszem a feladatot"}
          </Button>
        </Tooltip>


  */

  const handleMarkAsRefilled = async () => {
    setLoading(true);
    try {
      // Calculate sold products with valid productIds only
      const soldProducts = missingSlots
        .filter(
          (item) =>
            item?.productId &&
            item.productId !== "Nincs termék" &&
            item.productId !== "Ismeretlen termék"
        )
        .map((item) => ({
          productId: item?.productId,
          quantity: (item?.capacity ?? 0) - (item?.quantity ?? 0),
          productProfit:
            (item?.price ?? 0) *
            ((item?.capacity ?? 0) - (item?.quantity ?? 0)),
        }));

      // Calculate total profit
      const totalProfit = soldProducts.reduce(
        (sum, product) => sum + product.productProfit,
        0
      );

      // Record the sale
      await axios.post("http://localhost:5000/api/sales", {
        machineId,
        date: new Date().toISOString(),
        products: soldProducts,
        allProfit: totalProfit,
      });

      // Refill the machine
      await axios.put(`http://localhost:5000/api/machines/${machineId}/refill`);

      // Reset assignment status
//      setAssignedToMe(false);

      // Refresh the machine data
      if (typeof onRefill === "function") {
        onRefill();
      }
    } catch (error) {
      console.error("Hiba a feltöltés rögzítésekor:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Hiba: ${error.response.data.error || "Ismeretlen hiba történt"}`
        );
      } else {
        alert("Hiba történt a feltöltés során");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" withBorder radius="md" mt="lg" shadow="sm">
      <Group justify="space-between" mb="xs">
        <Title order={4}>Feltöltendő termékek</Title>
        <Badge color={missingSlots.length > 0 ? "red" : "green"} size="lg">
          {missingSlots.length > 0
            ? `${missingSlots.length} hiány`
            : "Feltöltve"}
        </Badge>
      </Group>
      <Divider mb="md" />

      <Box mb="md" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {missingSlots.length > 0 ? (
          <List mt="xs" size="sm">
            {missingSlots.map(
              (item, index) =>
                item && (
                  <List.Item
                    key={index}
                    icon={
                      <Box
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: item.critical ? "red" : "orange",
                        }}
                      />
                    }
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Text fw={500}>
                        {item.slotCode}: {item.productName}
                      </Text>
                      <Badge color={item.critical ? "red" : "orange"}>
                        {item.capacity - item.quantity} db hiányzik
                      </Badge>
                    </Group>
                  </List.Item>
                )
            )}
          </List>
        ) : (
          <Flex align="center" justify="center" style={{ height: "100px" }}>
            <Text c="dimmed" fs="italic" ta="center">
              Nincs hiányzó termék, minden feltöltve!
            </Text>
          </Flex>
        )}
      </Box>

      <Divider my="md" />

      <Flex gap="md" justify="center">
        <Tooltip label="Jelöld a gépet feltöltöttként">
          <Button
            leftSection={<IconClipboardCheck size={16} />}
            variant="outline"
            color="green"
            onClick={handleMarkAsRefilled}
            loading={loading}
          >
            Feltöltés!
          </Button>
        </Tooltip>
      </Flex>
    </Paper>
  );
};

export default RefillableProducts;
