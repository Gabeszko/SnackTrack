import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MachineType } from '../types';
import { Grid, Paper, Badge, Text, Group, Center } from '@mantine/core';
import SlotEditor, { Slot } from './SlotEditorComponent';

const SelectedMachineView = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<MachineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Lekérdezett ID:', id); // Ellenőrzésre
    setLoading(true);
    
    // Itt van a javítás - teljes URL használata, mint a MachineList komponensben
    axios.get(`http://localhost:5000/api/machines/${id}`)
      .then(res => {
        console.log('Betöltött adat:', res.data);
        setMachine(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Nem sikerült betölteni az automatát:', err);
        setError('Nem sikerült betölteni az automatát');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div>Hiba: {error}</div>;
  if (!machine) return <div>Nem található automata ezzel az azonosítóval.</div>;

  const { slots, rows, cols, _id: machineId } = machine;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const getSlotByCode = (code: string): Slot | undefined =>
    slots.find((s) => s.slotCode === code);

  return (
    <div>
      <h2>{machine.name} - {machine.location}</h2>
      <Grid gutter="md">
        {Array.from({ length: rows }).flatMap((_, rowIdx) =>
          Array.from({ length: cols }).map((_, colIdx) => {
            const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
            const slot = getSlotByCode(slotCode);

            return (
              <Grid.Col span={12 / cols} key={slotCode}>
                {slot ? (
                  <Paper shadow="xs" p="md" withBorder radius="md">
                    <Group mb="xs">
                      <Badge size="lg" variant="light" color="blue">
                        {slotCode}
                      </Badge>
                    </Group>
                    <SlotEditor
                      slot={{ ...slot, slotCode }}
                      machineId={machineId}
                      onSave={() => {
                        // újratöltés mentés után
                        axios.get(`http://localhost:5000/api/machines/${id}`).then(res => {
                          setMachine(res.data);
                        });
                      }}
                    />
                  </Paper>
                ) : (
                  <Paper shadow="xs" p="md" withBorder radius="md" bg="red.0">
                    <Center h={100}>
                      <Group>
                        <Badge size="lg" variant="filled" color="red">
                          {slotCode}
                        </Badge>
                        <Text c="red" fw={500}>
                          hiányzik
                        </Text>
                      </Group>
                    </Center>
                  </Paper>
                )}
              </Grid.Col>
            );
          })
        )}
      </Grid>
    </div>
  );
};

export default SelectedMachineView;