import { Line } from "react-chartjs-2";
import { Badge, Divider, Group, Paper, Text, Title } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

type LineChartProps = {
  title: string;
  subtitle: string;
  badgeText: string;
  data: any;
  options: any;
  hasDates: boolean;
};

export const LineChartComponent = ({
  title,
  subtitle,
  badgeText,
  data,
  options,
  hasDates,
}: LineChartProps) => {
  return (
    <Paper shadow="sm" radius="md" withBorder p="md" className="bg-white">
      <Group justify="space-around" mb="md">
        <div>
          <Title order={4} className="flex items-center">
            <IconChartBar size={20} className="mr-2 text-blue-500" />
            {title}
          </Title>
          <Text size="sm" color="dimmed">
            {subtitle}
          </Text>
        </div>
        <Badge size="lg" radius="sm" variant="outline" color="blue">
          {badgeText}
        </Badge>
      </Group>
      <Divider mb="md" />
      <div className="h-96">
        {hasDates ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Text color="dimmed">Nincs megjeleníthető adat</Text>
          </div>
        )}
      </div>
    </Paper>
  );
};
