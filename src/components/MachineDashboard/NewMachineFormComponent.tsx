import {
  useEffect,
  useState,
  FormEvent,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { MachineType } from "../types";
import axios from "axios";
import {
  Group,
  NumberInput,
  TextInput,
  Button,
  Card,
  Title,
  Select,
} from "@mantine/core";

const NewMachineForm: FunctionComponent<{
  setMachines: Dispatch<SetStateAction<MachineType[]>>;
  editingMachine: MachineType | null;
  clearEditingMachine: () => void;
}> = ({ setMachines, editingMachine, clearEditingMachine }) => {
  const [machineForm, setMachineForm] = useState({
    name: "",
    location: "",
    rows: 6,
    cols: 9,
    slots: [] as any,
    status: "Offline",
  });

  // 🔥 Nagyon fontos: ha editingMachine változik, akkor frissítsük a form állapotot
  useEffect(() => {
    if (editingMachine) {
      setMachineForm({
        name: editingMachine.name,
        location: editingMachine.location,
        rows: editingMachine.rows,
        cols: editingMachine.cols,
        slots: editingMachine.slots || [],
        status: editingMachine.status || "Offline",
      });
    } else {
      setMachineForm({
        name: "",
        location: "",
        rows: 6,
        cols: 9,
        slots: [],
        status: "Offline",
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
        if (editingMachine && editingMachine._id) {
          await axios.put(
            `http://localhost:5000/api/machines/${editingMachine._id}`,
            machineForm
          );

          // Frissítjük az összes gépet új lekéréssel
          const res = await axios.get<MachineType[]>(
            "http://localhost:5000/api/machines"
          );
          setMachines(res.data);

          clearEditingMachine();
        }
      } else {
        // POST
        const res = await axios.post(
          "http://localhost:5000/api/machines",
          machineForm
        );
        setMachines((prev) => [...prev, res.data]);
      }
      setMachineForm({
        name: "",
        location: "",
        rows: 6,
        cols: 9,
        slots: [],
        status: "Offline",
      });
    } catch (error) {
      console.error("Error saving machine:", error);
    }
  };

  const handleDeleteMachine = async () => {
    if (!editingMachine) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/machines/${editingMachine._id}`
      );
      setMachines((prev) => prev.filter((m) => m._id !== editingMachine._id));
      clearEditingMachine();
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  return (
    <Card shadow="sm" radius="md" withBorder padding="lg">
      <Title order={4} mb={"md"} c="black">
        {editingMachine ? "Automata szerkesztése" : "Új automata hozzáadása"}
      </Title>
      <form onSubmit={handleMachineSubmit}>
        <Group grow gap="md">
          <TextInput
            label="Név"
            placeholder="Név"
            value={machineForm.name}
            onChange={(e) => handleMachineChange("name", e.target.value)}
            required
          />
          <TextInput
            label="Helyszín"
            placeholder="Helyszín"
            value={machineForm.location}
            onChange={(e) => handleMachineChange("location", e.target.value)}
          />
        </Group>
        <Group>
          <NumberInput
            label="Sorok"
            placeholder="Sorok száma"
            value={machineForm.rows}
            onChange={(value) => handleMachineChange("rows", value)}
            min={1}
            max={20}
            required
          />
          <NumberInput
            label="Oszlopok"
            placeholder="Oszlopok száma"
            value={machineForm.cols}
            onChange={(value) => handleMachineChange("cols", value)}
            min={1}
            max={20}
            required
          />
        </Group>
        <Select
          label="Állapot"
          placeholder="Válassz állapotot"
          value={machineForm.status}
          onChange={(value) =>
            handleMachineChange("status", value || "Offline")
          }
          data={[
            { value: "Active", label: "Aktív" },
            { value: "Maintenance", label: "Karbantartás" },
            { value: "Offline", label: "Offline" },
          ]}
          required
        />
        <Group mt="md" justify="center">
          {editingMachine && (
            <Button
              className="px-5"
              variant="filled"
              color="red"
              onClick={handleDeleteMachine}
            >
              Automata törlése
            </Button>
          )}
          {editingMachine && (
            <Button variant="light" color="gray" onClick={clearEditingMachine}>
              Szerkesztés megszakítása
            </Button>
          )}
          <Button type="submit">
            {editingMachine ? "Mentés" : "Hozzáadás"}
          </Button>
        </Group>
      </form>
    </Card>
  );
};

export default NewMachineForm;
