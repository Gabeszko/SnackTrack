import { Select } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Slot, Product } from "../../types";
import {
  Paper,
  Title,
  Divider,
  NumberInput,
  Group,
  Button,
  Stack,
  Text,
} from "@mantine/core";

type SlotEditorProps = {
  selectedSlots: Slot[]; // ⬅ Több slotot kapunk!
  machineId: string;
  onSaveSuccess?: () => void;
};

const SlotEditor = ({
  selectedSlots,
  machineId,
  onSaveSuccess,
}: SlotEditorProps) => {
  const [productId, setProductId] = useState<string>("");
  const [productOptions, setProductOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Termékek betöltése
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        const options = res.data.map((product: Product) => ({
          label: product.name,
          value: product._id,
        }));
        setProductOptions(options);
      })
      .catch((err) => {
        console.error("Termékek betöltése sikertelen:", err);
        setError("Termékek betöltése sikertelen");
      });
  }, []);

  // Slot változásakor frissítjük a form adatokat
  useEffect(() => {
    if (selectedSlots.length > 0) {
      const firstSlot = selectedSlots[0];

      setProductId(
        firstSlot.product
          ? typeof firstSlot.product === "object"
            ? firstSlot.product._id
            : firstSlot.product
          : ""
      );

      setQuantity(firstSlot.quantity || 0);
      setCapacity(firstSlot.capacity || 0);
      setPrice(firstSlot.price || 0);
    } else {
      setProductId("");
      setQuantity(0);
      setCapacity(0);
      setPrice(0);
      setError(null);
    }
  }, [selectedSlots]);

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) return;

    setSaving(true);
    setError(null);

    const slotData = {
      product: productId || null,
      quantity: quantity || 0,
      capacity: capacity || 0,
      price: price || 0,
    };

    try {
      // Egymás után PATCH-oljuk az összes kijelölt slotot
      for (const slot of selectedSlots) {
        await axios.patch(
          `http://localhost:5000/api/machines/${machineId}/slots/${slot.slotCode}`,
          slotData
        );
      }

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Mentés sikertelen:", err);
      setError("Hiba történt mentés közben.");
    } finally {
      setSaving(false);
    }
  };

  const hasSelected = selectedSlots.length > 0;

  return (
    <Paper p="md" withBorder radius="md" mb="lg">
      <Title order={4} mb="xs">
        {hasSelected
          ? `Kiválasztott slotok: ${selectedSlots
              .map((s) => s.slotCode)
              .join(", ")}`
          : "Nincs kiválasztva slot"}
      </Title>
      <Divider mb="md" />

      {error && (
        <Text c="red" mb="md">
          {error}
        </Text>
      )}

      <Stack gap="md">
        <Select
          label="Termék"
          placeholder="Válassz terméket"
          data={productOptions}
          value={productId}
          onChange={(val) => setProductId(val || "")}
          disabled={!hasSelected || saving}
          clearable
          searchable
          nothingFoundMessage="Nincs ilyen termék"
        />

        <Group grow>
          <NumberInput
            label="Mennyiség"
            value={quantity}
            onChange={(value) => setQuantity(value as number)}
            min={0}
            max={capacity}
            disabled={!hasSelected || saving}
          />
          <NumberInput
            label="Kapacitás"
            value={capacity}
            onChange={(value) => setCapacity(value as number)}
            min={quantity}
            max={100}
            disabled={!hasSelected || saving}
          />
          <NumberInput
            label="Eladási ár"
            value={price}
            onChange={(value) => setPrice(value as number)}
            min={0}
            max={10000}
            disabled={!hasSelected || saving}
          />
        </Group>

        <Group justify="flex-end">
          <Button
            onClick={handleSubmit}
            disabled={!hasSelected}
            loading={saving}
          >
            {selectedSlots.length > 1 ? "Összes mentése" : "Mentés"}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default SlotEditor;
