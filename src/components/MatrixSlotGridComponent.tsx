import { Grid, Paper, Badge, Text, Group, Center } from '@mantine/core';
import SlotEditor, { Slot } from './SlotEditorComponent';

interface MatrixSlotGridProps {
  machineId: string;
  slots: Slot[];
  rows: number;
  cols: number;
  onSave: () => void;
}

const MatrixSlotGrid = ({ machineId, slots, rows, cols, onSave }: MatrixSlotGridProps) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const getSlotByCode = (code: string): Slot | undefined =>
    slots.find((s) => s.slotCode === code);

  return (
    <Grid gutter="md">
      {Array.from({ length: rows }).flatMap((_, rowIdx) =>
        Array.from({ length: cols }).map((_, colIdx) => {
          const slotCode = `${letters[rowIdx]}${colIdx + 1}`;
          const slot = getSlotByCode(slotCode);

          return (
            <Grid.Col span={12 / cols} key={slotCode}>
              {slot ? (
                <Paper 
                  shadow="xs" 
                  p="md" 
                  withBorder 
                  radius="md"
                >
                  <Group mb="xs">
                    <Badge size="lg" variant="light" color="blue">
                      {slotCode}
                    </Badge>
                  </Group>
                  <SlotEditor
                    slot={{ ...slot, slotCode }}
                    machineId={machineId}
                    onSave={onSave}
                  />
                </Paper>
              ) : (
                <Paper 
                  shadow="xs" 
                  p="md" 
                  withBorder 
                  radius="md"
                  bg="red.0"
                >
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
  );
};

export default MatrixSlotGrid;