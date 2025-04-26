import axios from "axios";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import { Card, Stack, Text, Title, Button, Box } from "@mantine/core";
import { Link } from "react-router-dom";
import { MachineType } from "../types";

const MachineList: FunctionComponent<{
  machines: MachineType[];
  setMachines: Dispatch<SetStateAction<MachineType[]>>;
  onEditMachine: (machine: MachineType) => void; // <-- Új prop!
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


  /*
  const deleteMachine = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/machines/${id}`);
    fetchMachines();
  };
*/

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
            className="min-w-[260px]"
          >
            <Stack gap="xs">
              <Title order={3} c="blue">
                {machine.name}
              </Title>
              <Text size="sm" c="dimmed">
                {machine.location}
              </Text>
              <Text size="sm" c="black">
                Size: {machine.rows}x{machine.cols}
              </Text>

              <Link to={`/machines/${machine._id}`}>
                <Button w="100%" h="30">
                  Megtekintés
                </Button>
              </Link>

              <Button w="100%" h="30" onClick={() => onEditMachine(machine)}>
                ✏️ Szerkesztés
              </Button>
            </Stack>
          </Card>
        ))}
      </div>
    </Box>
  );
};

export default MachineList;
