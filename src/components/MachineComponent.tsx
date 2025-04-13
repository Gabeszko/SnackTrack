import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import SlotEditor/*, { Slot, Product }*/ from './SlotEditorComponent';
//import MatrixSlotGrid from './MatrixSlotGridComponent'; 
import { Card, Group, NumberInput, Stack, Text, TextInput, Title, Button } from '@mantine/core';
//import Product from './ProductComponent';

/*
export interface Slot {
  slotNumber: number;
  product: string; // or Product, if populated
  quantity: number;
}*/

// Interface definitions
export interface Slot {
  slotCode: string;
  product: { //Populate-olni kéne aztmondjátok?
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
  rows: number;
  cols: number;
  slots: Slot[];
}

function MachineComponent() {
  const [machines, setMachines] = useState<MachineType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [machineForm, setMachineForm] = useState({
    name: '',
    location: '',
    rows: 6,
    cols: 9,
    slots: []
  });

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

  const handleMachineChange = (field: keyof MachineType, value: string | number | null) => {
    // Ha null érkezik (ami NumberInput esetén lehetséges), akkor 0-ra állítjuk
    const finalValue = value === null ? 0 : value;
    setMachineForm({ ...machineForm, [field]: finalValue });
  };

  const handleMachineSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try { // SUBMIT
      if (editingId) {
        await axios.put(`http://localhost:5000/api/machines/${editingId}`, machineForm);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/machines', machineForm);
      }
      // EDIT
      setMachineForm({ name: '', location: '', rows: 0, cols: 0, slots: []});
      fetchMachines();
    } catch (error) {
      console.error('Error saving machine:', error);
    }
  };
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Új automata</h2>
      <form onSubmit={handleMachineSubmit}>
        <Group grow gap="md">
          <TextInput
            label="Name"
            placeholder="Név"
            value={machineForm.name}
            onChange={(e) => handleMachineChange('name', e.target.value )}
          />
          <TextInput
            label="Location"
            placeholder="Helyszín"
            value={machineForm.location}
            onChange={(e) => handleMachineChange('location', e.target.value)}
          />
        </Group>
        <Group>
          <NumberInput
            label="Rows"
            placeholder="Sorok száma"
            value={machineForm.rows}
            onChange={(value) => handleMachineChange('rows', value)}
            min={1}
            max={99}
            required
          />
          <NumberInput
            label="Cols"
            placeholder="Oszlopok száma"
            value={machineForm.cols}
            onChange={(value) => handleMachineChange( 'cols', value )}
            min={1}
            max={99}
            required
          />
        </Group>
        <Group justify="flex-end">
          <Button type="submit">
            {editingId ? 'Mentés' : 'Hozzáadás'}
          </Button>
        </Group>
      </form>

      <Group mt="md" gap="md" grow>
        {machines.map((machine) => (
        <Card key={machine._id} shadow="sm" radius="md" withBorder padding="lg">
        <Stack gap="xs">
          <Title order={3} c="blue">{machine.name}</Title>
          <Text size="sm" c="dimmed">{machine.location}</Text>
          <Stack gap={4}>
            {machine.slots.map((slot, i) => (
            <li key={i}>
              <span style={{ color: slot.product ? 'black' : 'red' }}>
                {slot.slotCode} — {" "}
                  {slot.product ? slot.product.name : "nincs termék"} — {" "}
                  {slot.product ? slot.quantity : ""}
                  <SlotEditor
                    key={slot.slotCode}
                    slot={slot}
                    machineId={machine._id!}
                    onSave={fetchMachines}
                  />
              </span>
            </li>
            ))}
          </Stack>
        </Stack>
        </Card>
          
        ))}
      </Group>

    </div>

  );
}
  
export default MachineComponent;