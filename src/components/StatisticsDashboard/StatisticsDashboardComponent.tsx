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
import { Sale, CHART_COLORS } from "../types";
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
  Button,
  Tabs,
  Grid,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChartBar,
  IconChartPie,
  IconDownload,
  IconCoffee,
  IconDeviceAnalytics,
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

export default function StatisticsDashboardComponent() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | "all">(
    "all"
  );
  const [selectedMachineId, setSelectedMachineId] = useState<string | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState<string | null>("machines");

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
          machineId: sale.machineId?._id || "",
          machineName: sale.machineId?.name || "Ismeretlen gép",
          date: sale.date,
          products: sale.products.map((p) => ({
            productId: p.productId?._id || "",
            productName: p.productId?.name || "Ismeretlen termék",
            quantity: Number(p.quantity),
            productProfit: Number(p.productProfit),
          })),
          allProfit: Number(sale.allProfit),
        }));

        setSales(salesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a sales betöltésekor:", err);
        setError(`Adatok betöltése sikertelen: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // Filter sales based on the active tab and selections
  const filteredSales = sales.filter((sale) => {
    if (activeTab === "machines") {
      return (
        selectedMachineId === "all" || sale.machineId === selectedMachineId
      );
    } else {
      // Products tab
      return (
        selectedProductId === "all" ||
        sale.products.some((product) => product.productId === selectedProductId)
      );
    }
  });

  // Machine options for dropdown - ensure uniqueness
  const machineOptions = [
    { value: "all", label: "Összes gép" },
    ...Object.values(
      sales.reduce((acc, sale) => {
        if (sale.machineId && !acc[sale.machineId]) {
          acc[sale.machineId] = {
            value: sale.machineId,
            label:
              sale.machineName || `Gép ${sale.machineId.substring(0, 6)}...`,
          };
        }
        return acc;
      }, {} as Record<string, { value: string; label: string }>)
    ),
  ];

  // Product options for dropdown - ensure uniqueness
  const productOptions = [
    { value: "all", label: "Összes termék" },
    ...Object.values(
      sales
        .flatMap((sale) => sale.products)
        .reduce((acc, product) => {
          if (product.productId && !acc[product.productId]) {
            acc[product.productId] = {
              value: product.productId,
              label:
                product.productName ||
                `Termék ${product.productId.substring(0, 6)}...`,
            };
          }
          return acc;
        }, {} as Record<string, { value: string; label: string }>)
    ),
  ];

  // Profit aggregation by day
  const tempProfitPerDay: { [date: string]: number } = {};
  filteredSales.forEach((sale) => {
    const dateOnly = sale.date.split("T")[0];
    tempProfitPerDay[dateOnly] =
      (tempProfitPerDay[dateOnly] || 0) + sale.allProfit;
  });
  const sortedDates = Object.keys(tempProfitPerDay).sort();

  // Format dates for chart display
  const formattedDates = sortedDates.map((date) => {
    const [year, month, day] = date.split("-");
    return `${year}.${month}.${day}`;
  });

  // Stats calculations
  const totalSales = filteredSales.reduce(
    (sum, sale) =>
      sum + sale.products.reduce((pSum, product) => pSum + product.quantity, 0),
    0
  );

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.allProfit,
    0
  );

  const salesDays = Object.keys(tempProfitPerDay).length;

  const averageDailyRevenue = salesDays > 0 ? totalRevenue / salesDays : 0;

  // Line chart data for daily profit
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

  // Prepare pie chart data
  const getProductDistributionData = () => {
    // For products tab
    if (activeTab === "products") {
      // Get sales with the selected product
      const salesWithSelectedProduct = sales.filter((sale) =>
        sale.products.some(
          (p) =>
            selectedProductId === "all" || p.productId === selectedProductId
        )
      );

      // Aggregate by machine
      const machineDistribution: {
        [machineId: string]: { name: string; count: number };
      } = {};

      salesWithSelectedProduct.forEach((sale) => {
        const relevantProducts = sale.products.filter(
          (p) =>
            selectedProductId === "all" || p.productId === selectedProductId
        );

        const quantity = relevantProducts.reduce(
          (sum, p) => sum + p.quantity,
          0
        );

        if (quantity > 0) {
          if (!machineDistribution[sale.machineId]) {
            machineDistribution[sale.machineId] = {
              name: sale.machineName,
              count: 0,
            };
          }
          machineDistribution[sale.machineId].count += quantity;
        }
      });

      const totalCount = Object.values(machineDistribution).reduce(
        (sum, m) => sum + m.count,
        0
      );

      // Format data for chart
      const labels: string[] = [];
      const values: number[] = [];
      let otherCount = 0;

      Object.entries(machineDistribution)
        .sort((a, b) => b[1].count - a[1].count)
        .forEach(([machineId, data]) => {
          const percentage = (data.count / totalCount) * 100;
          if (percentage >= 3) {
            labels.push(`${data.name} (${percentage.toFixed(1)}%)`);
            values.push(data.count);
          } else {
            otherCount += data.count;
          }
        });

      if (otherCount > 0) {
        const otherPercentage = (otherCount / totalCount) * 100;
        labels.push(`Egyéb (${otherPercentage.toFixed(1)}%)`);
        values.push(otherCount);
      }

      return { labels, values };
    }
    // For machines tab
    else {
      const productDistribution: {
        [productId: string]: { name: string; count: number };
      } = {};

      filteredSales.forEach((sale) => {
        sale.products.forEach((product) => {
          if (!productDistribution[product.productId]) {
            productDistribution[product.productId] = {
              name: product.productName,
              count: 0,
            };
          }
          productDistribution[product.productId].count += product.quantity;
        });
      });

      const totalCount = Object.values(productDistribution).reduce(
        (sum, p) => sum + p.count,
        0
      );

      // Format data for chart
      const labels: string[] = [];
      const values: number[] = [];
      let otherCount = 0;

      Object.entries(productDistribution)
        .sort((a, b) => b[1].count - a[1].count)
        .forEach(([productId, data]) => {
          const percentage = (data.count / totalCount) * 100;
          if (percentage >= 3) {
            labels.push(`${data.name} (${percentage.toFixed(1)}%)`);
            values.push(data.count);
          } else {
            otherCount += data.count;
          }
        });

      if (otherCount > 0) {
        const otherPercentage = (otherCount / totalCount) * 100;
        labels.push(`Egyéb (${otherPercentage.toFixed(1)}%)`);
        values.push(otherCount);
      }

      return { labels, values };
    }
  };

  const { labels: pieChartLabels, values: pieChartValues } =
    getProductDistributionData();

  const pieChartData = {
    labels: pieChartLabels,
    datasets: [
      {
        label:
          activeTab === "machines" ? "Termékek megoszlása" : "Gépek megoszlása",
        data: pieChartValues,
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

  // Export current view to CSV
  function exportToCSV() {
    let header = "";
    let rows: string[] = [];
    let filename = "";

    if (activeTab === "machines") {
      header = "Dátum,Gép,Termék,Mennyiség,Profit (Ft)\n";

      rows = filteredSales.flatMap((sale) =>
        sale.products.map(
          (product) =>
            `${sale.date.split("T")[0]},${sale.machineName},${
              product.productName
            },${product.quantity},${product.productProfit}`
        )
      );

      filename =
        selectedMachineId === "all"
          ? "osszes_gep_statisztika.csv"
          : `gep_${
              machineOptions.find((m) => m.value === selectedMachineId)?.label
            }_statisztika.csv`;
    } else {
      // Products tab export
      header = "Dátum,Gép,Termék,Mennyiség,Profit (Ft)\n";

      const relevantSales = sales.filter((sale) =>
        sale.products.some(
          (p) =>
            selectedProductId === "all" || p.productId === selectedProductId
        )
      );

      rows = relevantSales.flatMap((sale) => {
        const relevantProducts = sale.products.filter(
          (p) =>
            selectedProductId === "all" || p.productId === selectedProductId
        );

        return relevantProducts.map(
          (product) =>
            `${sale.date.split("T")[0]},${sale.machineName},${
              product.productName
            },${product.quantity},${product.productProfit}`
        );
      });

      filename =
        selectedProductId === "all"
          ? "osszes_termek_statisztika.csv"
          : `termek_${
              productOptions.find((p) => p.value === selectedProductId)?.label
            }_statisztika.csv`;
    }

    // Replace any commas in fields to prevent CSV errors
    const sanitizedRows = rows.map((row) =>
      row
        .split(",")
        .map((field) => (field.includes(",") ? `"${field}"` : field))
        .join(",")
    );

    const csvContent = header + sanitizedRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <Title order={2} className="text-gray-800">
          Értékesítési Statisztikák
        </Title>

        <Button
          onClick={exportToCSV}
          variant="outline"
          color="blue"
          leftIcon={<IconDownload size={16} />}
        >
          Exportálás CSV-be
        </Button>
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
          {/* Tab interface */}
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            color="blue"
            radius="md"
          >
            <Tabs.List>
              <Tabs.Tab value="machines" icon={<IconCoffee size={16} />}>
                Automata statisztikák
              </Tabs.Tab>
              <Tabs.Tab
                value="products"
                icon={<IconDeviceAnalytics size={16} />}
              >
                Termék statisztikák
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="machines" pt="lg">
              <Group position="apart" mb="md">
                <Text>
                  Válasszon egy automatát a részletes statisztikákhoz:
                </Text>
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
              <Group position="apart" mb="md">
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

          {/* Summary cards */}
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
                <Text size="md" color="dimmed" className="mb-1">
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

          {/* Charts */}
          <Grid>
            <Grid.Col span={6}>
              <Paper
                shadow="sm"
                radius="md"
                withBorder
                p="md"
                className="bg-white"
              >
                <Group justify="space-around" mb="md">
                  <div>
                    <Title order={4} className="flex items-center">
                      <IconChartBar size={20} className="mr-2 text-blue-500" />
                      Napi Bevétel Alakulása
                    </Title>
                    <Text size="sm" color="dimmed">
                      {formattedDates.length > 0
                        ? `Időszak: ${formattedDates[0]} - ${
                            formattedDates[formattedDates.length - 1]
                          }`
                        : "Nincs elérhető adat"}
                    </Text>
                  </div>
                  <Badge size="lg" radius="sm" variant="outline" color="blue">
                    {activeTab === "machines"
                      ? selectedMachineId === "all"
                        ? "Összes gép"
                        : machineOptions.find(
                            (m) => m.value === selectedMachineId
                          )?.label
                      : selectedProductId === "all"
                      ? "Összes termék"
                      : productOptions.find(
                          (p) => p.value === selectedProductId
                        )?.label}
                  </Badge>
                </Group>
                <Divider mb="md" />
                <div className="h-96">
                  {formattedDates.length > 0 ? (
                    <Line data={lineChartData} options={lineChartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Text color="dimmed">Nincs megjeleníthető adat</Text>
                    </div>
                  )}
                </div>
              </Paper>
            </Grid.Col>

            <Grid.Col span={6}>
              <Paper
                shadow="sm"
                radius="md"
                withBorder
                p="md"
                className="bg-white"
              >
                <Group justify="space-around" mb="md">
                  <div>
                    <Title order={4} className="flex items-center">
                      <IconChartPie size={20} className="mr-2 text-blue-500" />
                      {activeTab === "machines"
                        ? "Termékek Megoszlása"
                        : "Gépek Megoszlása"}
                    </Title>
                    <Text size="sm" color="dimmed">
                      Összesen {totalSales} eladott termék
                    </Text>
                  </div>
                  <Badge size="lg" radius="sm" variant="outline" color="blue">
                    {activeTab === "machines"
                      ? selectedMachineId === "all"
                        ? "Összes gép"
                        : machineOptions.find(
                            (m) => m.value === selectedMachineId
                          )?.label
                      : selectedProductId === "all"
                      ? "Összes termék"
                      : productOptions.find(
                          (p) => p.value === selectedProductId
                        )?.label}
                  </Badge>
                </Group>
                <Divider mb="md" />
                <div className="h-96">
                  {pieChartValues.length > 0 ? (
                    <Pie data={pieChartData} options={pieChartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Text color="dimmed">Nincs megjeleníthető adat</Text>
                    </div>
                  )}
                </div>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Empty data warning */}
          {filteredSales.length === 0 && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Nincs adat"
              color="yellow"
              radius="md"
              className="mt-6"
            >
              {activeTab === "machines"
                ? "A kiválasztott automatához nem található értékesítési adat."
                : "A kiválasztott termékhez nem található értékesítési adat."}
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
