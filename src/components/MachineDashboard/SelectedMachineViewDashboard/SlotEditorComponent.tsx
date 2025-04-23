import { Select } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Slot as OriginalSlot, Product } from '../../types'; 
import {
  Paper,
  Title,
  Divider,
  NumberInput,
  Group,
  Button,
  Stack
} from '@mantine/core';

// Újra definiáljuk a Slot típust az eredeti alapján, de csak azokkal a mezőkkel amit használunk
export type Slot = Pick<OriginalSlot, 'slotCode' | 'quantity' | 'capacity' | 'price' > & {
  product?: Product | null;
};

type SlotEditorProps = {
  selectedSlot: Slot | null;
  machineId: string;
  onSaveSuccess?: () => void;
};

const SlotEditor = ({ selectedSlot, machineId, onSaveSuccess }: SlotEditorProps) => {
  const [productId, setProductId] = useState<string>("");
  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
  const [quantity, setQuantity] = useState<number | "">(0);
  const [capacity, setCapacity] = useState<number | "">(0);
  const [price, setPrice] = useState<number | "">(0);
  
  // Termékek betöltése
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        const options = res.data.map((product: Product) => ({
          label: product.name,
          value: product._id
        }));
        setProductOptions(options);
      })
      .catch(err => {
        console.error("Termékek betöltése sikertelen:", err);
      });
  }, []);

  // Slot változásakor frissítjük az adatokat
  useEffect(() => {
    if (selectedSlot) {
      setProductId(
        selectedSlot.product && typeof selectedSlot.product === 'object'
          ? selectedSlot.product._id || ''
          : ''
      );
      setQuantity(selectedSlot.quantity || 0);
      setCapacity(selectedSlot.capacity || 0);
      setPrice(selectedSlot.price || 0);
    } else {
      setProductId("");
      setQuantity(0);
      setCapacity(0);
      setPrice(0);
    }
  }, [selectedSlot]);

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedSlot.slotCode) return;
  
    const slotData = {
      product: productId,
      quantity,
      capacity,
      price
    };
  
    try {
      console.log("Mentési adatok:", slotData);
      await axios.patch(
        `http://localhost:5000/api/machines/${machineId}/slots/${selectedSlot.slotCode}`,
        slotData
      );
      console.log("Mentés sikeres!");
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Mentés sikertelen:", err);
    }
  };
  
  return (
    <Paper p="md" withBorder radius="md" mb="lg">
      <Title order={4} mb="xs">Slot: {selectedSlot?.slotCode || "Nincs kiválasztva"}</Title>
      <Divider mb="md" />

      <Stack gap="md">
        <Select
          label="Termék"
          placeholder="Válassz terméket"
          data={productOptions}
          value={productId}
          onChange={(val) => setProductId(val || "")}
          disabled={!selectedSlot}
        />

        <Group grow>
          <NumberInput
            label="Mennyiség:"
            value={quantity}
            onChange={(value) => setQuantity(value as number | "")}
            min={0}
            disabled={!selectedSlot}
          />
          
          <NumberInput
            label="Kapacitás:"
            value={capacity}
            onChange={(value) => setCapacity(value as number | "")}
            min={0}
            disabled={!selectedSlot}
          />

          <NumberInput
            label="Eladási ár:"
            value={price}
            onChange={(value) => setPrice(value as number | "")}
            min={0}
            disabled={!selectedSlot}
          />
        </Group>

        <Group justify="flex-end">
          <Button onClick={handleSubmit} disabled={!selectedSlot}>
            Mentés
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default SlotEditor;