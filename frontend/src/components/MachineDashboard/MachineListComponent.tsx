import { FunctionComponent, Dispatch, SetStateAction, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Stack,
  Text,
  Title,
  Box,
  Badge,
  Group,
  Progress,
  Container,
  ActionIcon,
  Tooltip,
  SimpleGrid,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { MachineType, COLORS } from "../types";
import {
  IconEye,
  IconEdit,
  IconLayoutGrid,
  IconMapPin,
} from "@tabler/icons-react";

const MachineList: FunctionComponent<{
  machines: MachineType[];
  setMachines: Dispatch<SetStateAction<MachineType[]>>;
  onEditMachine: (machine: MachineType) => void;
}> = ({ machines, setMachines, onEditMachine }) => {
  const fetchMachines = async () => {
    try {
      const res = await axios.get<MachineType[]>(
        "http://localhost:5000/machine/all"
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
        return COLORS.success;
      case "Maintenance":
        return COLORS.warning;
      case "Offline":
        return COLORS.danger;
      default:
        return COLORS.dark;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Active":
        return COLORS.successLight;
      case "Maintenance":
        return COLORS.warningLight;
      case "Offline":
        return COLORS.dangerLight;
      default:
        return COLORS.light;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "Online";
      case "Maintenance":
        return "Karbantartás";
      case "Offline":
        return "Offline";
      default:
        return status;
    }
  };

  const getFullnessColor = (fullness: number) => {
    if (fullness >= 70) return COLORS.success;
    if (fullness >= 40) return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <Container size="xl" px="xl" py="xl">
      <Group mb="xl" align="center">
        <IconLayoutGrid size={28} style={{ color: COLORS.primary }} />
        <Title order={2} c={COLORS.dark} fw={600}>
          Automaták listája
        </Title>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {machines.map((machine) => (
          <Card
            key={machine._id}
            shadow="sm"
            radius="lg"
            withBorder
            padding="lg"
            style={{
              height: "100%",
              borderColor: COLORS.lightBorder,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <Stack gap="md">
              <Group justify="center" align="flex-start">
                <Title
                  order={3}
                  c={COLORS.primary}
                  style={{ fontSize: 18, lineHeight: 1.3 }}
                >
                  {machine.name}
                </Title>
              </Group>
              <Group justify="center">
                <Badge
                  color={getStatusColor(machine.status)}
                  variant="dot"
                  size="lg"
                  radius="sm"
                  px="sm"
                  py="xs"
                  styles={{
                    root: {
                      backgroundColor: getStatusBgColor(machine.status),
                      color: getStatusColor(machine.status),
                      fontWeight: 600,
                    },
                  }}
                >
                  {getStatusText(machine.status)}
                </Badge>
              </Group>

              <Group gap="xs" mb={4}>
                <IconMapPin size={16} color={COLORS.textLight} />
                <Text size="sm" c={COLORS.text}>
                  {machine.location || "nincs helyszín"}
                </Text>
              </Group>

              <Text size="sm" c={COLORS.text} mb={4}>
                <span style={{ fontWeight: 600 }}>Méret:</span> {machine.rows}×
                {machine.cols}
              </Text>

              <Box mt={8}>
                <Group mb={8} justify="spacing-around">
                  <Text size="sm" fw={600} c={COLORS.dark}>
                    Töltöttség
                  </Text>
                  <Text
                    size="sm"
                    fw={600}
                    c={getFullnessColor(machine.fullness ?? 0)}
                  >
                    {machine.fullness ?? 0}%
                  </Text>
                </Group>
                <Progress
                  value={machine.fullness ?? 0}
                  color={getFullnessColor(machine.fullness ?? 0)}
                  radius="xl"
                  size="md"
                  striped={machine.fullness < 40}
                />
              </Box>

              <Group justify="center" mt="lg" gap="md">
                <Link
                  to={`/machines/${machine._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Tooltip label="Megtekintés" withArrow position="top">
                    <ActionIcon
                      size="lg"
                      variant="light"
                      color="blue"
                      radius="md"
                      style={{
                        backgroundColor: COLORS.infoLight,
                        color: COLORS.info,
                      }}
                    >
                      <IconEye size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Link>
                <Tooltip label="Szerkesztés" withArrow position="top">
                  <ActionIcon
                    size="lg"
                    variant="light"
                    color="blue"
                    radius="md"
                    onClick={() => onEditMachine(machine)}
                    style={{
                      backgroundColor: COLORS.primaryLight,
                      color: COLORS.primary,
                    }}
                  >
                    <IconEdit size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default MachineList;
