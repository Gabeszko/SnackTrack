// src/components/statistics/StatisticsFilterPanel.tsx
import { Group, Select, Tabs, Text } from "@mantine/core";
import { IconBox, IconBuildingWarehouse } from "@tabler/icons-react";

type StatisticsFilterPanelProps = {
  activeTab: string | null;
  setActiveTab: (value: string | null) => void;
  selectedMachineId: string | "all";
  setSelectedMachineId: (value: string) => void;
  selectedProductId: string | "all";
  setSelectedProductId: (value: string) => void;
  machineOptions: { value: string; label: string }[];
  productOptions: { value: string; label: string }[];
};

export const FilterPanel = ({
  activeTab,
  setActiveTab,
  selectedMachineId,
  setSelectedMachineId,
  selectedProductId,
  setSelectedProductId,
  machineOptions,
  productOptions,
}: StatisticsFilterPanelProps) => {
  return (
    <Tabs value={activeTab} onChange={setActiveTab} color="blue" radius="md">
      <Tabs.List>
        <Tabs.Tab value="machines" leftSection={<IconBox size={16} />}>
          Automata statisztikák
        </Tabs.Tab>
        <Tabs.Tab
          value="products"
          leftSection={<IconBuildingWarehouse size={16} />}
        >
          Termék statisztikák
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="machines" pt="lg">
        <Group justify="space-around" mb="md">
          <Text>Válasszon egy automatát a részletes statisztikákhoz:</Text>
          <Select
            label="Automata kiválasztása"
            placeholder="Válassz automatát"
            value={selectedMachineId}
            onChange={(value) => setSelectedMachineId(value || "all")}
            data={machineOptions}
            className="w-64"
            clearable={false}
            size="md"
            radius="md"
            searchable
          />
        </Group>
      </Tabs.Panel>

      <Tabs.Panel value="products" pt="lg">
        <Group justify="space-around" mb="md">
          <Text>Válasszon egy terméket a részletes statisztikákhoz:</Text>
          <Select
            label="Termék kiválasztása"
            placeholder="Válassz terméket"
            value={selectedProductId}
            onChange={(value) => setSelectedProductId(value || "all")}
            data={productOptions}
            className="w-64"
            clearable={false}
            size="md"
            radius="md"
            searchable
          />
        </Group>
      </Tabs.Panel>
    </Tabs>
  );
};
