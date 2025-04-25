import { useState } from "react";
import { Slot, Product } from "../../types";
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
} from "@mantine/core";
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

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Javított típus-biztos getProductName függvény
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

        if (!slot || slot.product === null || slot.quantity != slot.capacity) {
          return {
            slotCode,
            productName: getProductName(slot?.product),
            productId: getProductId(slot?.product),
            capacity: slot?.capacity || 0,
            quantity: slot?.quantity || 0,
            price: slot?.price || 0,
            //            critical: slot.capacity <= slot.quantity / 2,
          };
        }
        return null;
      })
      .filter(Boolean)
  );

  const handleAssignToMe = async () => {
    setLoading(true);
    try {
      // Itt kell implementálni a backend hívást
      console.log("Feladat átvéve:", machineId);
      // Példa implementáció
      // await axios.post(`http://localhost:5000/api/machines/${machineId}/assign`);
      alert("Feladat átvéve! (Backend integráció folyamatban)");
    } catch (error) {
      console.error("Hiba a feladat átvételekor:", error);
    } finally {
      setLoading(false);
    }
  };
  /*
  const handleMarkAsRefilled = async () => {
    setLoading(true);
    try {
      const soldProducts = missingSlots.map((item) => ({
        productId: item?.productId,
        quantity: (item?.capacity ?? 0) - (item?.quantity ?? 0),
        productProfit:
          (item?.price ?? 0) * ((item?.capacity ?? 0) - (item?.quantity ?? 0)),
      }));

      const totalProfit = soldProducts.reduce(
        (sum, product) => sum + product.productProfit,
        0
      );

      await axios.post("http://localhost:5000/api/sales", {
        machineId,
        date: new Date().toISOString(),
        products: soldProducts,
        allProfit: totalProfit,
      });

      // Refill the machine
      await axios.put(`http://localhost:5000/api/machines/${machineId}/refill`);

      alert("Feltöltés sikeresen rögzítve!");

      // This will refresh the machine data if you're using a callback from parent component
      // You might need to add this prop to your component if it doesn't exist yet
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
    }
  };
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

      console.log("befor sale record", {
        machineId,
        date: new Date().toISOString(),
        products: soldProducts,
        allProfit: totalProfit,
      });

      // Record the sale
      await axios.post("http://localhost:5000/api/sales", {
        machineId,
        date: new Date().toISOString(),
        products: soldProducts,
        allProfit: totalProfit,
      });

      console.log("after sr and before machine refill");

      // Refill the machine
      await axios.put(`http://localhost:5000/api/machines/${machineId}/refill`);

      alert("Feltöltés sikeresen rögzítve és készlet frissítve!");

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
    }
  };

  return (
    <Paper p="md" withBorder radius="md" mt="lg">
      <Title order={4} mb="xs">
        Hiány:
      </Title>
      <Divider mb="md" />

      <Box mb="md" style={{ maxHeight: "200px", overflowY: "auto" }}>
        <List spacing="xs" size="sm">
          {missingSlots.length > 0 ? (
            missingSlots.map(
              (item, index) =>
                item && (
                  <List.Item key={index} className="">
                    <Group gap="xs">
                      <Box
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                        }}
                      />
                      <Text>
                        {item.slotCode}: {item.productName}{" "}
                        {item.capacity - item.quantity}db ({item.capacity}/
                        {item.quantity})
                      </Text>
                    </Group>
                  </List.Item>
                )
            )
          ) : (
            <Text ta="center" fs="italic">
              Nincs hiány
            </Text>
          )}
        </List>
      </Box>

      <Flex gap="md" justify="center" mt="xl">
        <Button variant="outline" onClick={handleAssignToMe} loading={loading}>
          Assign To me!
        </Button>
        <Button
          variant="outline"
          onClick={handleMarkAsRefilled}
          loading={loading}
        >
          Mark As refilled
        </Button>
      </Flex>
    </Paper>
  );
};

export default RefillableProducts;
