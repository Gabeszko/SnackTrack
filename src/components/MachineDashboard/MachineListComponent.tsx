import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Card,
  Stack,
  Text,
  Title,
  Button,
  AppShell,
  Box,
  SimpleGrid,
  Flex
} from '@mantine/core';
import { Link } from 'react-router-dom';

import { MachineType } from '../types';

/*
  export interface MachineType {
    _id?: string;
    name: string;
    location: string;
    rows: number;
    cols: number;
    slots: Slot[];
  }
  */

const MachineList = () => {
    const [machines, setMachines] = useState<MachineType[]>([]);
//    const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
//    const selectedMachine = machines.find((m) => m._id === selectedMachineId);


    useEffect(() => {
      fetchMachines();
    }, []);
  
    const fetchMachines = async () => {
      try {
        const res = await axios.get<MachineType[]>('http://localhost:5000/api/machines');
        setMachines(res.data);
      } catch (error) {
        console.error('Error fetching machines:', error);
      }
    };
  
    const deleteMachine = async (id: string) => {
      await axios.delete(`http://localhost:5000/api/machines/${id}`);
      fetchMachines();
    };  
    
    return (
    <AppShell>
      <AppShell.Main>
        <Flex style={{ minHeight: 'calc(100vh - 80px)' }}> 
          <Box flex={1} py="xl" px="xl" bg="white">
            <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xl">         
              {machines.map((machine) => (
              <Card key={machine._id} shadow="sm" radius="md" withBorder padding="lg">
                <Stack gap="xs">
                  <Title order={3} c="blue">{machine.name}</Title>
                  <Text size="sm" c="dimmed">{machine.location}</Text>
                  <Text size="sm" c="black">Size: {machine.rows}x{machine.cols}</Text>

                  <Link to={`/machines/${machine._id}`}>
                  <Button w="100%" h="30">Megtekintés</Button>
                  </Link>

                  <Button w="100%" h="30" onClick={() => deleteMachine(machine._id!)}>❌ Törlés</Button>
                </Stack>
              </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </AppShell.Main>
    </AppShell>
    );
};

export default MachineList;