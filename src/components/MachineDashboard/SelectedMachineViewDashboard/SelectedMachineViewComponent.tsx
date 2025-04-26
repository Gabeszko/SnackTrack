import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { MachineType, Slot } from "../../types";
import {
  Grid,
  Paper,
  Text,
  Center,
  Container,
  Title,
  Divider,
} from "@mantine/core";
import SlotEditor from "./SlotEditorComponent";
import RefillableProducts from "./RefillableProductsComponent";
import MachineGrid from "./MachineGridComponent";

const SelectedMachineView = () => {
  const { id } = useParams<{ id: string }>();
  const [machine, setMachine] = useState<MachineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]); // ⬅ Több slot kiválasztása

  const fetchMachineData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/machines/${id}`);
      console.log("Betöltött adat:", res.data);
      setMachine(res.data);
      setError(null);
    } catch (err) {
      console.error("Nem sikerült betölteni az automatát:", err);
      setError("Nem sikerült betölteni az automatát");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMachineData();
  }, [fetchMachineData]);

  // Slot kiválasztási kezelő
  const handleSlotClick = (slot: Slot | null): void => {
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

  // Mentés utáni frissítés
  const handleSaveSuccess = (): void => {
    fetchMachineData();
    setSelectedSlots([]); // Szerkesztés után ürítjük a kijelölést
  };

  if (loading)
    return (
      <Center h="80vh">
        <Text size="xl">Betöltés...</Text>
      </Center>
    );
  if (error)
    return (
      <Center h="80vh">
        <Text c="red" size="xl">
          Hiba: {error}
        </Text>
      </Center>
    );
  if (!machine)
    return (
      <Center h="80vh">
        <Text size="xl">Nem található automata ezzel az azonosítóval.</Text>
      </Center>
    );

  const { slots, rows, cols, name } = machine;

  return (
    <Container>
      <Paper p="md" mb="lg" withBorder>
        <Title order={2} ta="center" mb="md">
          {name} automata
        </Title>
        <Divider mb="md" />

        <Grid>
          {/* Bal oldali automata vizuális megjelenítés */}
          <Grid.Col span={7}>
            <MachineGrid
              rows={rows as number}
              cols={cols as number}
              slots={slots}
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
              onSlotClick={handleSlotClick}
            />
          </Grid.Col>
          {/* Jobb oldali információs panel */}
          <Grid.Col span={5}>
            <SlotEditor
              selectedSlots={selectedSlots}
              machineId={machine._id!}
              onSaveSuccess={handleSaveSuccess}
            />

            <RefillableProducts
              slots={slots}
              rows={rows as number}
              cols={cols as number}
              machineId={machine._id!}
              onRefill={fetchMachineData}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SelectedMachineView;
