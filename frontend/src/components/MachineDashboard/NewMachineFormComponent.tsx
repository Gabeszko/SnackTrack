import {
  useEffect,
  useState,
  FormEvent,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { MachineType, Slot, COLORS } from "../types";
import axios from "axios";
import {
  Group,
  NumberInput,
  TextInput,
  Button,
  Title,
  Select,
  Divider,
  Container,
  Paper,
  Stack,
  Grid,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconTrash,
  IconX,
  IconPlus,
} from "@tabler/icons-react";

const NewMachineForm: FunctionComponent<{
  setMachines: Dispatch<SetStateAction<MachineType[]>>;
  editingMachine: MachineType | null;
  clearEditingMachine: () => void;
  onSuccess: () => void;
  onError: () => void;
  onDeleteSuccess: () => void;
  onDeleteError: () => void;
}> = ({
  setMachines,
  editingMachine,
  clearEditingMachine,
  onSuccess,
  onError,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const [machineForm, setMachineForm] = useState({
    name: "",
    location: "",
    rows: 6,
    cols: 9,
    slots: [] as Slot[],
    stat: "Offline",
  });

  useEffect(() => {
    if (editingMachine) {
      setMachineForm({
        name: editingMachine.name,
        location: editingMachine.location,
        rows: editingMachine.rows,
        cols: editingMachine.cols,
        slots: editingMachine.slots || [],
        stat: editingMachine.stat || "Offline",
      });
    } else {
      setMachineForm({
        name: "",
        location: "",
        rows: 6,
        cols: 9,
        slots: [],
        stat: "Offline",
      });
    }
  }, [editingMachine]);

  const handleMachineChange = (
    field: keyof typeof machineForm,
    value: string | number | null
  ) => {
    const finalValue = value === null ? 0 : value;
    setMachineForm({ ...machineForm, [field]: finalValue });
  };

  const handleMachineSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingMachine && editingMachine._id) {
        // PUT
        await axios.put(
          `http://localhost:5000/machine/${editingMachine._id}`,
          machineForm
        );

        // Frissítjük az összes gépet új lekéréssel
        const res = await axios.get<MachineType[]>(
          "http://localhost:5000/machine/all"
        );
        setMachines(res.data);
        clearEditingMachine();
        onSuccess();
      } else {
        // POST
        const res = await axios.post(
          "http://localhost:5000/machine",
          machineForm
        );
        setMachines((prev) => [...prev, res.data]);
        onSuccess();
      }
      setMachineForm({
        name: "",
        location: "",
        rows: 6,
        cols: 9,
        slots: [],
        stat: "Offline",
      });
    } catch (error) {
      onError();
      console.error("Error saving machine:", error);
    }
  };

  const handleDeleteMachine = async () => {
    if (!editingMachine) return;
    try {
      await axios.delete(`http://localhost:5000/machine/${editingMachine._id}`);
      setMachines((prev) => prev.filter((m) => m._id !== editingMachine._id));
      clearEditingMachine();
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting machine:", error);
      onDeleteError();
    }
  };

  return (
    <Container size="xl" mb="xl">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Group justify="space-between" mb={20}>
          <Title order={3} c={COLORS.primary}>
            {editingMachine
              ? "Automata szerkesztése"
              : "Új automata hozzáadása"}
          </Title>
        </Group>

        <form onSubmit={handleMachineSubmit}>
          <Grid>
            <Grid.Col span={6}>
              <Stack gap="md">
                <TextInput
                  label="Automata neve"
                  placeholder="Add meg az automata nevét"
                  value={machineForm.name}
                  onChange={(e) => handleMachineChange("name", e.target.value)}
                  required
                  size="md"
                  styles={{
                    label: {
                      fontWeight: 600,
                      marginBottom: 5,
                      color: COLORS.dark,
                    },
                    input: { borderColor: COLORS.darkBorder },
                  }}
                />
                <TextInput
                  label="Helyszín"
                  description="Adja meg az automata helyszínét (pl. 47.4979, 19.0402)"
                  placeholder="Szélesség, hosszúság"
                  value={machineForm.location}
                  onChange={(e) =>
                    handleMachineChange("location", e.target.value)
                  }
                  size="md"
                  styles={{
                    label: {
                      fontWeight: 600,
                      marginBottom: 5,
                      color: COLORS.dark,
                    },
                    description: { marginBottom: 5 },
                    input: { borderColor: COLORS.darkBorder },
                  }}
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <Stack gap="md">
                <Group grow>
                  <NumberInput
                    label="Sorok száma"
                    placeholder="Sorok"
                    value={machineForm.rows}
                    onChange={(value) => handleMachineChange("rows", value)}
                    min={1}
                    max={20}
                    required
                    size="md"
                    styles={{
                      label: {
                        fontWeight: 600,
                        marginBottom: 5,
                        color: COLORS.dark,
                      },
                      input: { borderColor: COLORS.darkBorder },
                    }}
                  />
                  <NumberInput
                    label="Oszlopok száma"
                    placeholder="Oszlopok"
                    value={machineForm.cols}
                    onChange={(value) => handleMachineChange("cols", value)}
                    min={1}
                    max={20}
                    required
                    size="md"
                    styles={{
                      label: {
                        fontWeight: 600,
                        marginBottom: 5,
                        color: COLORS.dark,
                      },
                      input: { borderColor: COLORS.darkBorder },
                    }}
                  />
                </Group>
                <Group>
                  <Select
                    label="Állapot"
                    placeholder="Válassz állapotot"
                    value={machineForm.stat}
                    onChange={(value) =>
                      handleMachineChange("stat", value || "Offline")
                    }
                    data={[
                      { value: "Active", label: "Aktív" },
                      { value: "Maintenance", label: "Karbantartás" },
                      { value: "Offline", label: "Offline" },
                    ]}
                    required
                    size="md"
                    styles={{
                      label: {
                        fontWeight: 600,
                        marginBottom: 5,
                        color: COLORS.dark,
                      },
                      input: { borderColor: COLORS.darkBorder },
                    }}
                  />
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>

          <Divider my="lg" />

          <Group justify="flex-end" mt="xl" gap="md">
            {editingMachine && (
              <>
                <Button
                  variant="filled"
                  color="red"
                  size="md"
                  leftSection={<IconTrash size={20} />}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Biztosan törlöd a(z) "${editingMachine.name}" automatát?`
                      )
                    ) {
                      handleDeleteMachine();
                    }
                  }}
                >
                  Automata törlése
                </Button>
                <Button
                  variant="light"
                  color="gray"
                  size="md"
                  onClick={clearEditingMachine}
                  leftSection={<IconX size={16} />}
                >
                  Megszakítás
                </Button>
              </>
            )}
            <Button
              type="submit"
              leftSection={
                editingMachine ? (
                  <IconDeviceFloppy size={20} />
                ) : (
                  <IconPlus size={20} />
                )
              }
              variant="filled"
              color={COLORS.primary}
              size="md"
            >
              {editingMachine ? "Mentés" : "Hozzáadás"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default NewMachineForm;
