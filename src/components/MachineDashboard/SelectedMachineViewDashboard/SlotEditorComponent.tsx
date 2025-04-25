import { Select } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Slot /*as OriginalSlot*/, Product } from '../../types'; 
import {
  Paper,
  Title,
  Divider,
  NumberInput,
  Group,
  Button,
  Stack,
  Text
} from '@mantine/core';

// Újra definiáljuk a Slot típust az eredeti alapján, de csak azokkal a mezőkkel amit használunk
/*export type Slot = Pick<OriginalSlot, 'slotCode' | 'quantity' | 'capacity' | 'price' > & {
  product: Product | null;
};
*/

type SlotEditorProps = {
  selectedSlot: Slot | null;
  machineId: string;
  onSaveSuccess?: () => void;
};

const SlotEditor = ({ selectedSlot, machineId, onSaveSuccess }: SlotEditorProps) => {
  const [productId, setProductId] = useState<string>("");
  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
  const [quantity, setQuantity] = useState<number | 0>(0);
  const [capacity, setCapacity] = useState<number | 0>(0);
  const [price, setPrice] = useState<number | 0>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        setError("Termékek betöltése sikertelen");
      });
  }, []);

  // Slot változásakor frissítjük az adatokat
  useEffect(() => {
    if (selectedSlot) {
      // Először reseteljük
      setProductId("");
      setQuantity(0);
      setCapacity(0);
      setPrice(0);
      setError(null);
      
      // beállítjuk az értékeket
      if (selectedSlot.product){
        if(typeof selectedSlot.product === 'string'){
          setProductId(selectedSlot.product)
        } else if(typeof selectedSlot.product === 'object'){
          setProductId(selectedSlot.product._id)
        }
      }

      setQuantity(selectedSlot.quantity || 0);
      setCapacity(selectedSlot.capacity || 0);
      setPrice(selectedSlot.price || 0);
    } else {
      setProductId("");
      setQuantity(0);
      setCapacity(0);
      setPrice(0);
      setError(null);
    }
  }, [selectedSlot]);

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedSlot.slotCode) return;
  
    const slotData = {
      product: productId || null, // Ha üres string, akkor null-t küldünk
      quantity: quantity || 0,    // Ha üres, akkor 0-t küldünk
      capacity: capacity || 0,    // Ha üres, akkor 0-t küldünk
      price: price || 0           // Ha üres, akkor 0-t küldünk
    };
  
    setSaving(true);
    setError(null);
    
    try {
      console.log("Mentési adatok:", slotData);
      console.log("Mentési URL:", `http://localhost:5000/api/machines/${machineId}/slots/${selectedSlot.slotCode}`);
      
      const response = await axios.patch(
        `http://localhost:5000/api/machines/${machineId}/slots/${selectedSlot.slotCode}`,
        slotData
      );
      
      console.log("Mentés sikeres! Válasz:", response.data);
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Mentés sikertelen:", err);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Paper p="md" withBorder radius="md" mb="lg">
      <Title order={4} mb="xs">Slot: {selectedSlot?.slotCode || "Nincs kiválasztva"}</Title>
      <Divider mb="md" />

      {error && (
        <Text c="red" mb="md">
          {error}
        </Text>
      )}

      <Stack gap="md">
        <Select
          label="Termék"
          placeholder={"válassz terméket"}
          data={productOptions}
          value={productId}
          onChange={(val) => setProductId(val || "")}
          disabled={!selectedSlot || saving /*|| selectedSlot.product.stock <= selectedSlot.capacity*/}
          clearable
          searchable
          nothingFoundMessage="Nincs ilyen termék"
        />

        <Group grow>
          <NumberInput
            label="Mennyiség:"
            value={quantity}
            onChange={(value) => setQuantity(value as number | 0)}
            min={0}
            max={capacity}
            disabled={!selectedSlot || saving}
          />
          
          <NumberInput
            label="Kapacitás:"
            value={capacity}
            onChange={(value) => setCapacity(value as number | 0)}
            min={quantity}
            max={10}
            disabled={!selectedSlot || saving}
          />

          <NumberInput
            label="Eladási ár:"
            value={price}
            onChange={(value) => setPrice(value as number | 0)}
            min={0}
            max={10000}
            disabled={!selectedSlot || saving}
          />
        </Group>

        <Group justify="flex-end">
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedSlot} 
            loading={saving}
          >
            Mentés
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default SlotEditor;