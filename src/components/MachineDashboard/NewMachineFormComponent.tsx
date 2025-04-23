import { /*useEffect,*/ useState, FormEvent } from 'react';
import axios from 'axios';
//import SlotEditor/*, { Slot, Product }*/ from './SlotEditorComponent';
import { Group, NumberInput, /* Stack, Text, Card, Title, */ TextInput, Button, Card } from '@mantine/core';
import { MachineType } from '../types'

const NewMachineForm = () => {
//    const [machines, setMachines] = useState<MachineType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [machineForm, setMachineForm] = useState({
      name: '',
      location: '',
      rows: 6,
      cols: 9,
      slots: []
    });

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
        } catch (error) {
          console.error('Error saving machine:', error);
        }
      };
      

    return (
    <Card shadow="sm" radius="md" withBorder padding="lg">
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
            onChange={(value) => handleMachineChange('cols', value)}
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
      </Card>
    );
};

export default NewMachineForm;