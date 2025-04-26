import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { Sale } from "../types";
import {
  Card,
  Title,
  Text,
  Group,
  Select,
  Loader,
  Alert,
  Divider,
  Paper,
  Badge,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChartBar,
  IconChartPie,
} from "@tabler/icons-react";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Modern színpaletta a grafikonokhoz
const CHART_COLORS = [
  "#228be6", // kék
  "#40c057", // zöld
  "#fa5252", // piros
  "#7950f2", // lila
  "#fd7e14", // narancs
  "#1c7ed6", // sötétkék
  "#12b886", // türkiz
  "#7048e8", // indigó
  "#f76707", // sötét narancs
  "#be4bdb", // rózsaszín
];

export default function StatisticsDashboardComponent() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | "all">(
    "all"
  );
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    const apiUrl = "/api/sales";
    setLoading(true);
    setError(null);

    axios
      .get(apiUrl)
      .then((res) => {
        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Nem megfelelő adatformátum az API-tól");
        }

        const salesData = res.data.map((sale) => ({
          _id: sale._id,
          machineId: sale.machineId,
          date: sale.date,
          products: sale.products.map((p) => ({
            productId: String(p.productId),
            quantity: Number(p.quantity),
            productProfit: Number(p.productProfit),
          })),
          allProfit: Number(sale.allProfit),
        }));

        setSales(salesData);

        // Számítsuk ki az összesített adatokat
        const revenue = salesData.reduce(
          (sum, sale) => sum + sale.allProfit,
          0
        );
        const salesCount = salesData.reduce(
          (sum, sale) =>
            sum +
            sale.products.reduce((pSum, product) => pSum + product.quantity, 0),
          0
        );

        setTotalRevenue(revenue);
        setTotalSales(salesCount);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a sales betöltésekor:", err);
        setError(`Adatok betöltése sikertelen: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // Gépenkénti szűrés
  const filteredSales =
    selectedMachineId === "all"
      ? sales
      : sales.filter((sale) => sale.machineId === selectedMachineId);

  // Profit aggregálás napok szerint
  const tempProfitPerDay: { [date: string]: number } = {};
  filteredSales.forEach((sale) => {
    const dateOnly = sale.date.split("T")[0];
    tempProfitPerDay[dateOnly] =
      (tempProfitPerDay[dateOnly] || 0) + sale.allProfit;
  });
  const sortedDates = Object.keys(tempProfitPerDay).sort();

  // Dátumok szebb formázása a grafikonhoz
  const formattedDates = sortedDates.map((date) => {
    const [year, month, day] = date.split("-");
    return `${year}.${month}.${day}`;
  });

  const lineChartData = {
    labels: formattedDates,
    datasets: [
      {
        label: "Napi profit (Ft)",
        data: sortedDates.map((date) => tempProfitPerDay[date]),
        fill: true,
        backgroundColor: "rgba(34, 139, 230, 0.1)",
        borderColor: CHART_COLORS[0],
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: CHART_COLORS[0],
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString(
              "hu-HU"
            )} Ft`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          callback: function (value) {
            return value.toLocaleString("hu-HU") + " Ft";
          },
        },
      },
    },
  };

  // Termékek százalékos eloszlása
  const productCounts: { [productId: string]: number } = {};

  filteredSales.forEach((sale) => {
    sale.products.forEach((product) => {
      productCounts[product.productId] =
        (productCounts[product.productId] || 0) + product.quantity;
    });
  });

  const totalProductsSold = Object.values(productCounts).reduce(
    (acc, val) => acc + val,
    0
  );

  // Az adatok jobb rendezése
  const productEntries = Object.entries(productCounts)
    .map(([id, count]) => ({
      id,
      count,
      percentage: (count / totalProductsSold) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const pieChartLabels: string[] = [];
  const pieChartDataValues: number[] = [];
  let otherProductsCount = 0;

  // A top termékek beillesztése, a kis százalékúakat összevonjuk
  productEntries.forEach((entry) => {
    if (entry.percentage >= 3) {
      pieChartLabels.push(
        `Termék ${entry.id} (${entry.percentage.toFixed(1)}%)`
      );
      pieChartDataValues.push(entry.count);
    } else {
      otherProductsCount += entry.count;
    }
  });

  if (otherProductsCount > 0) {
    const otherPercentage = (otherProductsCount / totalProductsSold) * 100;
    pieChartLabels.push(`Egyéb (${otherPercentage.toFixed(1)}%)`);
    pieChartDataValues.push(otherProductsCount);
  }

  const pieChartData = {
    labels: pieChartLabels,
    datasets: [
      {
        label: "Eladások megoszlása",
        data: pieChartDataValues,
        backgroundColor: CHART_COLORS,
        borderColor: Array(pieChartLabels.length).fill("#ffffff"),
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  // MachineID-k listája a dropdownhoz
  const machineIds = Array.from(
    new Set(sales.map((sale) => sale.machineId))
  ).filter((id) => id);

  // Select opciók formázása Mantine számára
  const machineOptions = [
    { value: "all", label: "Összes gép" },
    ...machineIds.map((id) => ({ value: id, label: `Gép ${id}` })),
  ];

  // A kiválasztott gép adatai
  const selectedMachineData = {
    totalProfit: filteredSales.reduce((sum, sale) => sum + sale.allProfit, 0),
    salesCount: filteredSales.reduce(
      (sum, sale) =>
        sum +
        sale.products.reduce((pSum, product) => pSum + product.quantity, 0),
      0
    ),
    salesDays: Object.keys(tempProfitPerDay).length,
    averageDailyProfit:
      Object.keys(tempProfitPerDay).length > 0
        ? filteredSales.reduce((sum, sale) => sum + sale.allProfit, 0) /
          Object.keys(tempProfitPerDay).length
        : 0,
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <Title order={2} className="text-gray-800">
          Értékesítési Statisztikák
        </Title>

        <Select
          label="Automata kiválasztása"
          placeholder="Válassz gépet"
          value={selectedMachineId}
          onChange={(value) => setSelectedMachineId(value || "all")}
          data={machineOptions}
          className="w-64"
          clearable={false}
          size="md"
          radius="md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="xl" color="blue" variant="bars" />
        </div>
      ) : error ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Betöltési hiba"
          color="red"
          radius="md"
        >
          {error}
        </Alert>
      ) : (
        <>
          {/* Összesítő kártyák */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                {selectedMachineData.totalProfit.toLocaleString("hu-HU")} Ft
              </Title>
            </Card>

            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="bg-green-50"
            >
              <Text size="md" color="dimmed" className="mb-1">
                Értékesítések száma
              </Text>
              <Title order={3} className="text-green-600">
                {selectedMachineData.salesCount} db
              </Title>
            </Card>

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
                {selectedMachineData.salesDays} nap
              </Title>
            </Card>

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
                {selectedMachineData.averageDailyProfit.toLocaleString("hu-HU")}{" "}
                Ft
              </Title>
            </Card>
          </div>

          {/* Grafikonok */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Paper
              shadow="sm"
              radius="md"
              withBorder
              p="md"
              className="bg-white"
            >
              <Group position="apart" mb="md">
                <div>
                  <Title order={4} className="flex items-center">
                    <IconChartBar size={20} className="mr-2 text-blue-500" />
                    Napi Bevétel Alakulása
                  </Title>
                  <Text size="sm" color="dimmed">
                    Időszak: {formattedDates[0]} -{" "}
                    {formattedDates[formattedDates.length - 1]}
                  </Text>
                </div>
                <Badge size="lg" radius="sm" variant="outline" color="blue">
                  {selectedMachineId === "all"
                    ? "Összes gép"
                    : `Gép ${selectedMachineId}`}
                </Badge>
              </Group>
              <Divider mb="md" />
              <div className="h-96">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </Paper>

            <Paper
              shadow="sm"
              radius="md"
              withBorder
              p="md"
              className="bg-white"
            >
              <Group position="apart" mb="md">
                <div>
                  <Title order={4} className="flex items-center">
                    <IconChartPie size={20} className="mr-2 text-blue-500" />
                    Termékek Eladási Megoszlása
                  </Title>
                  <Text size="sm" color="dimmed">
                    Összesen {totalProductsSold} eladott termék
                  </Text>
                </div>
                <Badge size="lg" radius="sm" variant="outline" color="blue">
                  {selectedMachineId === "all"
                    ? "Összes gép"
                    : `Gép ${selectedMachineId}`}
                </Badge>
              </Group>
              <Divider mb="md" />
              <div className="h-96">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </Paper>
          </div>

          {/* Ha nincs adat, mutassunk erre figyelmeztetést */}
          {filteredSales.length === 0 && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Nincs adat"
              color="yellow"
              radius="md"
              className="mt-6"
            >
              A kiválasztott automatához nem található értékesítési adat a
              megadott időszakban.
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
