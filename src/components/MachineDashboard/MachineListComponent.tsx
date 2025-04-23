import axios from 'axios';
import SelectedMachineView from './SelectedMachineViewDashboard/SelectedMachineViewComponent';
import { useEffect, useState } from 'react';
import { Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

//import SlotEditor/*, { Slot, Product }*/ from './SlotEditorComponent';
//import { MachineType } from '../types'

//Egyelőre ezt a machine type-ot használja
export interface Slot {
    slotCode: string;
    product: { //Populate-olni kéne aztmondjátok? De amúgy populate-olva van
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
  

const MachineList = () => {
    const [machines, setMachines] = useState<MachineType[]>([]);
    const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
    const selectedMachine = machines.find((m) => m._id === selectedMachineId);


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
      setSelectedMachineId(null);
      fetchMachines();
    };  
    
//Valami nem kerek
//a Slotok mindegyik automatának ugyan azt mutatják for some reason

    return (
    <div> 
        <Group mt="md" gap="md" grow>
        {machines.map((machine) => (
        <Card key={machine._id} shadow="sm" radius="md" withBorder padding="lg">
        <Stack gap="xs">
            <Title order={3} c="blue">{machine.name}</Title>
            <Text size="sm" c="dimmed">{machine.location}</Text>
            <Text size="sm" c="black">Size: {machine.rows}x{machine.cols}</Text>
            {"<button onClick={() => setSelectedMachineId(machine._id!)}>📦 Slotnézet</button>"}
            <Link to={`/machines/${machine._id}`}>
            <button>Megtekintés / szerkesztés</button>
            </Link>

            <button onClick={() => deleteMachine(machine._id!)}>❌ Törlés</button>
 
        </Stack>
        </Card>
        ))}
      </Group>

      {selectedMachine && (
        <div style={{ marginTop: '2rem' }}>
          <h3>{selectedMachine.name} slotnézete</h3>
          <SelectedMachineView
            /*
            machineId={selectedMachine._id!}
            slots={selectedMachine.slots}
            rows={selectedMachine.rows}
            cols={selectedMachine.cols}
            onSave={fetchMachines}
            */
          />
        </div>
      )}
    </div>
    );
};

export default MachineList;