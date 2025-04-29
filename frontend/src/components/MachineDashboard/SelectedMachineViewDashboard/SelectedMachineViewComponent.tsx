import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { MachineType, Slot, COLORS } from "../../types";
import {
  Grid,
  Paper,
  Text,
  Center,
  Container,
  Title,
  Button,
  Group,
  Loader,
  Alert,
  Card,
  Stack,
} from "@mantine/core";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import SlotEditor from "./SlotEditorComponent";
import RefillableProducts from "./RefillableProductsComponent";
import MachineGrid from "./MachineGridComponent";
import NotificationComponent from "../../Notification/NotificationComponent";
import { useNotification } from "../../Notification/useNotification";

const SelectedMachineView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [machine, setMachine] = useState<MachineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const { notification, showNotification, clearNotification } =
    useNotification();

  const fetchMachineData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/machine/${id}`);
      setMachine(res.data);
      setError(null);
    } catch (err) {
      console.error("Nem sikerült betölteni az automatát:", err);
      setError("Nem sikerült betölteni az automatát");
      showNotification("Nem sikerült betölteni az automata adatait", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    fetchMachineData();
  }, [fetchMachineData]);

  // Slot kiválasztási kezelő
  const handleSlotClick = (slot: Slot | null): void => {
    if (!slot) return;

    const isSelected = selectedSlots.some((s) => s.slotCode === slot.slotCode);

    if (isSelected) {
      // Ha már ki van jelölve -> vegyük ki
      setSelectedSlots(
        selectedSlots.filter((s) => s.slotCode !== slot.slotCode)
      );
    } else {
      // Ha nincs kijelölve -> adjuk hozzá
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  /*
  // Mentés utáni frissítés
  const handleSaveSuccess = (): void => {
    fetchMachineData();
    setSelectedSlots([]); // Szerkesztés után ürítjük a kijelölést
    showNotification("Automatapozíciók sikeresen mentve", "success");
  };
*/
  // Slot szerkesztés sikeres
  const handleSlotEditSuccess = (): void => {
    fetchMachineData();
    setSelectedSlots([]);
    showNotification(`pozíció(k) sikeresen frissítve`, "success");
  };

  // Slot szerkesztés hiba
  const handleSlotEditError = (): void => {
    console.error("Hiba a pozíciók szerkesztése során");
    showNotification("Hiba történt a pozíciók szerkesztése során", "error");
  };

  // Utántöltés sikeres
  const handleRefillSuccess = (): void => {
    showNotification("Termékek sikeresen utántöltve", "success");
  };

  // Utántöltés hiba
  const handleRefillError = (): void => {
    console.error("Hiba a termékek utántöltése során");
    showNotification("Hiba történt a termékek utántöltése során", "error");
  };

  if (loading)
    return (
      <Center h="80vh">
        <Stack align="center" mt="md">
          <Loader size="xl" />
          <Text size="lg">Automata adatok betöltése...</Text>
        </Stack>
      </Center>
    );

  if (error)
    return (
      <Center h="80vh">
        <Alert
          icon={<IconAlertCircle size={24} />}
          title="Hiba történt!"
          color={COLORS.danger}
          variant="filled"
          radius="md"
          style={{ maxWidth: "500px" }}
        >
          <Text mb="md">{error}</Text>
          <Button onClick={() => navigate("/machines")}>
            Vissza az automatákhoz
          </Button>
        </Alert>
      </Center>
    );

  if (!machine)
    return (
      <Center h="80vh">
        <Alert
          icon={<IconAlertCircle size={24} />}
          title="Nem található automata"
          color={COLORS.warning}
          variant="filled"
          radius="md"
          style={{ maxWidth: "500px" }}
        >
          <Text mb="md">
            Az automata nem található a megadott azonosítóval.
          </Text>
          <Button onClick={() => navigate("/machines")}>
            Vissza az automatákhoz
          </Button>
        </Alert>
      </Center>
    );

  const { slots, rows, cols, name } = machine;

  return (
    <div className="bg-blue-400/20 px-15 pb-10">
      {/* Notification component */}
      <NotificationComponent
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
      />

      <div className="bg-white rounded-lg p-4">
        <Container size="xl" px="md">
          <Paper p="lg" mb="lg" withBorder shadow="sm" radius="md">
            <Group justify="flex-start" mb="md">
              <Button component="button" onClick={() => navigate("/machines")}>
                <IconArrowLeft size={14} />
                <Text> Automaták</Text>
              </Button>
            </Group>

            <Card p="lg" radius="md" withBorder mb="xl">
              <Group>
                <Title order={2}>{name}</Title>
              </Group>
            </Card>

            <Grid gutter="lg">
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
                <Stack mt="lg">
                  <SlotEditor
                    selectedSlots={selectedSlots}
                    machineId={machine._id!}
                    onSaveSuccess={handleSlotEditSuccess}
                    onSaveError={handleSlotEditError}
                  />

                  <RefillableProducts
                    slots={slots}
                    rows={rows as number}
                    cols={cols as number}
                    machineId={machine._id!}
                    onRefill={handleRefillSuccess}
                    onRefillError={handleRefillError}
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default SelectedMachineView;
