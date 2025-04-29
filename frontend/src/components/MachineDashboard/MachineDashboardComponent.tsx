import { useState } from "react";
import { Box, Group, Tabs, Title } from "@mantine/core";
import { MachineType, COLORS } from "../types";
import NewMachineForm from "./NewMachineFormComponent";
import MachineList from "./MachineListComponent";
import VendingMachineMap from "./VendingMachineMapComponent";
import { IconMap, IconSettings } from "@tabler/icons-react";
import NotificationComponent from "../Notification/NotificationComponent";
import { useNotification } from "../Notification/useNotification";

function MachineDashboard() {
  const [machines, setMachines] = useState<MachineType[]>([]);
  const [editingMachine, setEditingMachine] = useState<MachineType | null>(
    null
  );
  const { notification, showNotification, clearNotification } =
    useNotification();

  // Átalakítás: MachineType -> VendingMachineMap gépformátum
  const mapMachines = machines.map((machine) => {
    if (!machine.location) {
      // Ha nincs location egyáltalán
      return {
        id: machine._id,
        name: machine.name,
        location: [0, 0] as [number, number],
        stat: machine.stat,
      };
    }

    const parts = machine.location.split(",").map(Number);
    if (parts.length !== 2 || parts.some((n) => isNaN(n))) {
      // Ha nem két szám vagy rossz formátum
      return {
        id: machine._id,
        name: machine.name,
        location: [0, 0] as [number, number],
        stat: machine.stat,
      };
    }

    // Ha minden oké
    return {
      id: machine._id,
      name: machine.name,
      location: [parts[0], parts[1]] as [number, number],
      stat: machine.stat,
    };
  });

  // Handler for successful machine creation
  const handleMachineCreated = () => {
    showNotification(`Automata sikeresen létrehozva`, "success");
  };

  // Handler for successful machine update
  const handleMachineUpdated = () => {
    showNotification(`Automata sikeresen frissítve`, "success");
  };

  // Handler for successful machine deletion
  const handleMachineDeleted = () => {
    showNotification(`Automata sikeresen törölve`, "success");
  };

  // Handler for errors
  const handleError = (operation: string) => {
    console.error(`Error during ${operation}:`);
    showNotification(`Hiba történt a művelet során: ${operation}`, "error");
  };

  return (
    <Box
      style={{
        padding: "2rem",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* Notification component */}
      <NotificationComponent
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
      />

      <Box
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          backgroundColor: COLORS.background,
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >
        <Group mb="xl">
          <div
            style={{
              width: 6,
              height: 36,
              backgroundColor: COLORS.primary,
              borderRadius: 3,
              marginRight: 16,
            }}
          />
          <Title
            order={1}
            style={{
              fontSize: 28,
              color: COLORS.dark,
              fontWeight: 700,
            }}
          >
            Automaták vezérlőpultja
          </Title>
        </Group>

        <Tabs
          defaultValue="management"
          variant="pills"
          color="blue"
          radius="lg"
          styles={{
            list: {
              border: `1px solid ${COLORS.lightBorder}`,
              padding: 4,
              borderRadius: 100,
              gap: 8,
              backgroundColor: COLORS.light,
              marginBottom: 32,
            },
            tab: {
              fontWeight: 600,
              padding: "10px 20px",
              "&[dataActive]": {
                backgroundColor: COLORS.primary,
                color: "white",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
              },
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="management"
              leftSection={<IconSettings size={18} />}
            >
              Automaták kezelése
            </Tabs.Tab>
            <Tabs.Tab value="map" leftSection={<IconMap size={18} />}>
              Térképes nézet
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="management" pt="md">
            <NewMachineForm
              setMachines={setMachines}
              editingMachine={editingMachine}
              clearEditingMachine={() => setEditingMachine(null)}
              onSuccess={
                editingMachine ? handleMachineUpdated : handleMachineCreated
              }
              onError={() =>
                handleError(editingMachine ? "frissítés" : "létrehozás")
              }
              onDeleteSuccess={handleMachineDeleted}
              onDeleteError={() => handleError("törlés")}
            />

            <MachineList
              machines={machines}
              setMachines={setMachines}
              onEditMachine={(machine) => setEditingMachine(machine)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="map" pt="md">
            <Box
              style={{
                border: `1px solid ${COLORS.lightBorder}`,
                borderRadius: 16,
                overflow: "hidden",
                height: "70vh",
              }}
            >
              <VendingMachineMap
                machines={mapMachines}
                center={[47.4979, 19.0402]} // Hungary center
                zoom={7}
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default MachineDashboard;
