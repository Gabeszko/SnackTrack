import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MachineType, Slot } from '../../types';
import { 
  Grid, 
  Paper, 
  Text, 
  Center, 
  Container, 
  Title, 
  Divider, 
} from '@mantine/core';
import SlotEditor from './SlotEditorComponent';
import RefillableProducts from './RefillableProductsComponent';
import MachineGrid from './MachineGridComponent';

const SelectedMachineView = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<MachineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const fetchMachineData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/machines/${id}`);
      console.log('Betöltött adat:', res.data);
      setMachine(res.data);
      setError(null);
    } catch (err) {
      console.error('Nem sikerült betölteni az automatát:', err);
      setError('Nem sikerült betölteni az automatát');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Lekérdezett ID:', id);
    fetchMachineData();
  }, [id]);

  // Slot kiválasztási kezelő
  const handleSlotClick = (slot: Slot | null, slotCode: string) => {
    if (slot) {
      setSelectedSlot({ ...slot, slotCode });
    } else {
      setSelectedSlot(null);
    }
  };

  // Mentés utáni frissítés kezelő
  const handleSaveSuccess = () => {
    fetchMachineData();
    // Átmenetileg kitöröljük a kiválasztott slotot
    setSelectedSlot(null);
  };

  if (loading) return <Center h="80vh"><Text size="xl">Betöltés...</Text></Center>;
  if (error) return <Center h="80vh"><Text c="red" size="xl">Hiba: {error}</Text></Center>;
  if (!machine) return <Center h="80vh"><Text size="xl">Nem található automata ezzel az azonosítóval.</Text></Center>;

  const { slots, rows, cols, name } = machine;

  return (
    <Container fluid>
      <Paper p="md" mb="lg" withBorder>
        <Title order={2} ta="center" mb="md">{name} automata</Title>
        <Divider mb="md" />

        <Grid>
          {/* Bal oldali automata vizuális megjelenítés */}
          <Grid.Col span={7}>
            <MachineGrid
              rows={rows as number}
              cols={cols as number}
              slots={slots}
              selectedSlot={selectedSlot}
              onSlotClick={handleSlotClick}
            />
          </Grid.Col>

          {/* Jobb oldali információs panel */}
          <Grid.Col span={5}>
            {/* Slot szerkesztő komponens */}
            <SlotEditor 
              selectedSlot={selectedSlot}   
              machineId={machine._id!}
              onSaveSuccess={handleSaveSuccess}
            />

            {/* Hiányzó termékek listázása + assign és feltöltés gomb */}
            <RefillableProducts 
              slots={slots} 
              rows={rows as number} 
              cols={cols as number} 
              machineId={machine._id!}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SelectedMachineView;