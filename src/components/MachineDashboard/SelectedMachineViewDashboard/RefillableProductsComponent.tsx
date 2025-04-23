import { useState } from 'react';
import { Slot, Product } from '../../types';
import { 
  Paper, 
  Text, 
  Group, 
  Title, 
  Divider, 
  Box, 
  Button,
  List,
  Flex
} from '@mantine/core';

interface RefillableProductsProps {
  slots: Slot[];
  rows: number;
  cols: number;
  machineId: string;
}

const RefillableProducts = ({ slots, rows, cols, machineId }: RefillableProductsProps) => {
  const [loading, setLoading] = useState(false);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Javított típus-biztos getProductName függvény
  const getProductName = (product: Product | string | null | undefined): string => {
    if (!product) return "Nincs termék";
    
    if (typeof product === 'string') {
      return product;
    }
    
    if (typeof product === 'object' && 'name' in product) {
      return product.name || "Ismeretlen termék";
    }
    
    return "Ismeretlen termék";
  };

  // Hiányzó slotok kiszámítása
  const missingSlots = Array.from({ length: rows }).flatMap((_, rowIdx) =>
    Array.from({ length: cols }).map((_, colIdx) => {
      const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
      const slot = slots.find(s => s.slotCode === slotCode);
      
      if (!slot || slot.quantity < 5) { // Példa logika: kevés mennyiség is "hiány"
        return {
          slotCode,
          productName: getProductName(slot?.product),
          quantity: slot?.quantity || 0
        };
      }
      return null;
    }).filter(Boolean)
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

  const handleMarkAsRefilled = async () => {
    setLoading(true);
    try {
      // Itt kell implementálni a backend hívást
      console.log("Feltöltve:", machineId);
      // Példa implementáció
      // await axios.post(`http://localhost:5000/api/machines/${machineId}/refill`);
      alert("Feltöltve! (Backend integráció folyamatban)");
    } catch (error) {
      console.error("Hiba a feltöltés jelzésekor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" withBorder radius="md" mt="lg">
      <Title order={4} mb="xs">Hiány:</Title>
      <Divider mb="md" />

      <Box mb="md" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <List spacing="xs" size="sm">
          {missingSlots.length > 0 ? (
            missingSlots.map((item, index) => (
              item && (
                <List.Item key={index}>
                  <Group gap="xs">
                    <Box 
                      style={{
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'red'
                      }}
                    />
                    <Text>
                      Slot {item.slotCode}: {item.productName} ({item.quantity})
                    </Text>
                  </Group>
                </List.Item>
              )
            ))
          ) : (
            <Text ta="center" fs="italic">Nincs hiány</Text>
          )}
        </List>
      </Box>

      <Flex gap="md" justify="center" mt="xl">
        <Button variant="outline" onClick={handleAssignToMe} loading={loading}>
          Assign To me!
        </Button>
        <Button variant="outline" onClick={handleMarkAsRefilled} loading={loading}>
          Mark As refilled
        </Button>
      </Flex>
    </Paper>
  );
};

export default RefillableProducts;