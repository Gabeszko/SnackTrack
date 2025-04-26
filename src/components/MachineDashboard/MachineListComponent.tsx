import axios from "axios";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import {
  Card,
  Stack,
  Text,
  Title,
  Button,
  Box,
  Badge,
  Group,
  Progress,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { MachineType } from "../types";

const MachineList: FunctionComponent<{
  machines: MachineType[];
  setMachines: Dispatch<SetStateAction<MachineType[]>>;
  onEditMachine: (machine: MachineType) => void;
}> = ({ machines, setMachines, onEditMachine }) => {
  const fetchMachines = async () => {
    try {
      const res = await axios.get<MachineType[]>(
        "http://localhost:5000/api/machines"
      );
      setMachines(res.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "Maintenance":
        return "yellow";
      case "Offline":
        return "red";
      default:
        return "gray";
    }
  };

  const getFullnessColor = (fullness: number) => {
    if (fullness >= 70) return "green";
    if (fullness >= 40) return "orange";
    return "red";
  };

  return (
    <Box py="xl" px="xl" bg="white">
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        {machines.map((machine) => (
          <Card
            key={machine._id}
            shadow="sm"
            radius="md"
            withBorder
            padding="lg"
            className="min-w-[260px] max-w-[320px]"
          >
            <Stack gap="xs" align="center">
              <Title order={3} c="blue" ta="center">
                {machine.name}
              </Title>

              <Badge
                color={getStatusColor(machine.status)}
                variant="filled"
                size="sm"
              >
                {machine.status}
              </Badge>

              <Text size="sm" c="dimmed" ta="center">
                {machine.location}
              </Text>
              <Text size="sm" c="black" ta="center">
                Méret: {machine.rows}x{machine.cols}
              </Text>

              {/* Progress Bar for fullness */}
              <Box w="100%" mt="sm">
                <Text size="xs" c="dimmed" mb={4}>
                  Töltöttség: {machine.fullness ?? 0}%
                </Text>
                <Progress
                  value={machine.fullness ?? 0}
                  color={getFullnessColor(machine.fullness ?? 0)}
                  radius="xl"
                  size="md"
                />
              </Box>

              <Group grow mt="md">
                <Link to={`/machines/${machine._id}`}>
                  <Button variant="light" fullWidth>
                    Megtekintés
                  </Button>
                </Link>
                <Button
                  variant="light"
                  color="blue"
                  onClick={() => onEditMachine(machine)}
                >
                  ✏️ Szerkesztés
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </div>
    </Box>
  );
};

export default MachineList;
