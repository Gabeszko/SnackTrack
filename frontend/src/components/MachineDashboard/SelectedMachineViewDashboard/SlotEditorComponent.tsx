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
  Badge,
  Flex,
  Alert,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

type SlotEditorProps = {
  selectedSlots: Slot[];
  machineId: string;
  onSaveSuccess: () => void;
  onSaveError: () => void;
};

const SlotEditor = ({
  selectedSlots,
  machineId,
  onSaveSuccess,
  onSaveError,
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
  const [success, setSuccess] = useState<string | null>(null);

  // Termékek betöltése
  useEffect(() => {
    axios
      .get("http://localhost:5000/product/all")
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
      setError(null);
      setSuccess(null);
    } else {
      setProductId("");
      setQuantity(0);
      setCapacity(0);
      setPrice(0);
      setError(null);
      setSuccess(null);
    }
  }, [selectedSlots]);

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

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
          `http://localhost:5000/machine/${machineId}/slots/${slot.slotCode}`,
          slotData
        );
      }

      setSuccess(`${selectedSlots.length} slot sikeresen frissítve!`);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Mentés sikertelen:", err);
      setError("Hiba történt mentés közben.");
      onSaveError();
    } finally {
      setSaving(false);
    }
  };

  const hasSelected = selectedSlots.length > 0;

  return (
    <Paper p="md" withBorder radius="md" mb="lg" shadow="sm">
      <Group justify="space-around" mb="xs">
        <Title order={4}>Slot beállítások</Title>
        {hasSelected && (
          <Badge color="blue" size="lg">
            {selectedSlots.length} kiválasztva
          </Badge>
        )}
      </Group>
      <Divider mb="md" />

      {!hasSelected ? (
        <Alert color="blue" title="Nincs kiválasztott slot">
          Kérlek válassz ki legalább egy cellát a bal oldali táblából a
          szerkesztéshez!
        </Alert>
      ) : (
        <>
          <Flex gap="sm" wrap="wrap" mb="md">
            {selectedSlots.map((slot) => (
              <Badge key={slot.slotCode} size="lg" variant="filled">
                {slot.slotCode}
              </Badge>
            ))}
          </Flex>

          {error && (
            <Alert
              color="red"
              title="Hiba"
              withCloseButton
              mb="md"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              color="green"
              title="Sikeres mentés"
              withCloseButton
              mb="md"
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          <Stack gap="md">
            <Group align="flex-start" grow>
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
                style={{ flexGrow: 1 }}
              />
              <NumberInput
                label="Eladási ár"
                value={price}
                onChange={(value) => setPrice(value as number)}
                min={0}
                max={9999}
                disabled={!hasSelected || saving}
                rightSection={
                  <Text size="xs" color="dimmed">
                    Ft
                  </Text>
                }
              />
            </Group>

            <Group grow>
              <NumberInput
                label="Kapacitás"
                value={capacity}
                onChange={(value) => setCapacity(value as number)}
                min={quantity}
                max={20}
                disabled={!hasSelected || saving}
                rightSection={
                  <Text size="xs" color="dimmed">
                    db
                  </Text>
                }
              />
              <NumberInput
                label="Mennyiség"
                value={quantity}
                onChange={(value) => setQuantity(value as number)}
                min={0}
                max={capacity}
                disabled={!hasSelected || saving}
                rightSection={
                  <Text size="xs" color="dimmed">
                    db
                  </Text>
                }
              />
            </Group>

            <Group justify="flex-end">
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSubmit}
                disabled={!hasSelected}
                loading={saving}
                color="blue"
              >
                {selectedSlots.length > 1 ? "Összes mentése" : "Mentés"}
              </Button>
            </Group>
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default SlotEditor;
