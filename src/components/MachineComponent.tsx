import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Group, Stack, Text, Title } from '@mantine/core';
//import Product from './ProductComponent';

/*
// Interface definitions
export interface Slot {
  slotNumber: number;
  product: string; // or Product, if populated
  quantity: number;
}*/

export interface Slot {
  slotNumber: number;
  product: {
    _id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    __v: number;
  }; 
  quantity: number;
}

export interface MachineType {
  _id?: string;
  name: string;
  location: string;
  slots: Slot[];
}

// Component renamed to avoid conflict with interface
function MachineComponent() {
  const [machines, setMachines] = useState<MachineType[]>([]);

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

  return (
    <Group mt="md" gap="md" grow>
      {machines.map((machine) => (
        <Card key={machine._id} shadow="sm" radius="md" withBorder padding="lg">
          <Stack gap="xs">
            <Title order={3} c="blue">{machine.name}</Title>
            <Text size="sm" c="dimmed">{machine.location}</Text>
            <Stack gap={4}>
              {machine.slots.map((slot, i) => (
                <Text key={i} size="sm">
                  <strong>Rekesz {slot.slotNumber}:</strong> {slot.product.name} ({slot.quantity} db)
                </Text>
              ))}
            </Stack>
          </Stack>
        </Card>
      ))}
    </Group>
  );
}
  
export default MachineComponent;