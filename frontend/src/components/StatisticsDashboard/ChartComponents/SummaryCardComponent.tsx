import { Card, Grid, Text, Title } from "@mantine/core";

type StatisticsSummaryCardsProps = {
  totalRevenue: number;
  totalSales: number;
  salesDays: number;
  averageDailyRevenue: number;
};

export const SummaryCards = ({
  totalRevenue,
  totalSales,
  salesDays,
  averageDailyRevenue,
}: StatisticsSummaryCardsProps) => {
  return (
    <Grid mb={20}>
      <Grid.Col span={3}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-blue-50"
        >
          <Text size="md" color="dimmed" className="mb-1">
            Összes bevétel
          </Text>
          <Title order={3} className="text-blue-600">
            {totalRevenue.toLocaleString("hu-HU")} Ft
          </Title>
        </Card>
      </Grid.Col>

      <Grid.Col span={3}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-green-50"
        >
          <Text size="md" c="dimmed" className="mb-1">
            Értékesítések száma
          </Text>
          <Title order={3} className="text-green-600">
            {totalSales} db
          </Title>
        </Card>
      </Grid.Col>

      <Grid.Col span={3}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-purple-50"
        >
          <Text size="md" color="dimmed" className="mb-1">
            Értékesítési napok
          </Text>
          <Title order={3} className="text-purple-600">
            {salesDays} nap
          </Title>
        </Card>
      </Grid.Col>

      <Grid.Col span={3}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-orange-50"
        >
          <Text size="md" color="dimmed" className="mb-1">
            Átlagos napi bevétel
          </Text>
          <Title order={3} className="text-orange-600">
            {averageDailyRevenue.toLocaleString("hu-HU")} Ft
          </Title>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
