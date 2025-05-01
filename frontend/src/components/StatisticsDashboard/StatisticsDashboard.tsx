// src/components/statistics/StatisticsDashboardComponent.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FormattedSale } from "../types";
import { Button, Grid, Title } from "@mantine/core";
import { LineChartComponent } from "./ChartComponents/LineChartComponent";
import { PieChartComponent } from "./ChartComponents/PieChartComponent";
import { SummaryCards } from "./ChartComponents/SummaryCardComponent";
import { FilterPanel } from "./ChartComponents/FilterPanelComponent";
import { NoDataAlert } from "./AlertComponents/NoDataAlert";
import { LoadingState } from "./AlertComponents/LoadingState";
import { ErrorAlert } from "./AlertComponents/ErrorAlert";
import { IconDownload } from "@tabler/icons-react";
import {
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import {
  aggregateProfitByDay,
  aggregateProductDistribution,
  calculateStatistics,
  exportDataToCSV,
  generateDropdownOptions,
  processSalesData,
} from "./services/DataServices";
import {
  createLineChartData,
  createLineChartOptions,
  createPieChartData,
  createPieChartOptions,
} from "./utils/ChartUtils";

// Register Chart.js components
ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function StatisticsDashboard() {
  const [sales, setSales] = useState<FormattedSale[]>([]);
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
    const apiUrl = "http://localhost:5000/sales";
    setLoading(true);
    setError(null);

    axios
      .get(apiUrl)
      .then((res) => {
        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Nem megfelelő adatformátum az API-tól");
        }

        const salesData = processSalesData(res.data);

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
  const filteredSales = sales.filter((salesData) => {
    if (activeTab === "machines") {
      return (
        selectedMachineId === "all" || salesData.machineId === selectedMachineId
      );
    } else {
      // Products tab
      return (
        selectedProductId === "all" ||
        salesData.products.some(
          (product) => product.productId === selectedProductId
        )
      );
    }
  });

  // Generate dropdown options
  const { machineOptions, productOptions } = generateDropdownOptions(sales);

  // Calculate statistics
  const { totalSales, totalRevenue, salesDays, averageDailyRevenue } =
    calculateStatistics(filteredSales);

  // Prepare data for line chart
  const { tempProfitPerDay, formattedDates } =
    aggregateProfitByDay(filteredSales);
  const lineChartData = createLineChartData(formattedDates, tempProfitPerDay);
  const lineChartOptions = createLineChartOptions();

  // Prepare data for pie chart
  const { labels: pieChartLabels, values: pieChartValues } =
    aggregateProductDistribution(
      filteredSales,
      activeTab,
      sales,
      selectedProductId
    );
  const pieChartData = createPieChartData(
    pieChartLabels,
    pieChartValues,
    activeTab
  );
  const pieChartOptions = createPieChartOptions();

  // Get badge text for charts
  const getBadgeText = () => {
    if (activeTab === "machines") {
      return selectedMachineId === "all"
        ? "Összes gép"
        : machineOptions.find((m) => m.value === selectedMachineId)?.label ||
            "";
    } else {
      return selectedProductId === "all"
        ? "Összes termék"
        : productOptions.find((p) => p.value === selectedProductId)?.label ||
            "";
    }
  };

  const handleExportCSV = () => {
    exportDataToCSV(
      filteredSales,
      activeTab,
      sales,
      selectedMachineId,
      selectedProductId,
      machineOptions,
      productOptions
    );
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <Title order={2} className="text-gray-800">
          Értékesítési Statisztikák
        </Title>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          color="blue"
          leftSection={<IconDownload size={16} />}
        >
          Exportálás CSV-be
        </Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          <FilterPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedMachineId={selectedMachineId}
            setSelectedMachineId={setSelectedMachineId}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            machineOptions={machineOptions}
            productOptions={productOptions}
          />

          <SummaryCards
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            salesDays={salesDays}
            averageDailyRevenue={averageDailyRevenue}
          />

          <Grid>
            <Grid.Col span={6}>
              <LineChartComponent
                title="Napi Bevétel Alakulása"
                subtitle={
                  formattedDates.length > 0
                    ? `Időszak: ${formattedDates[0]} - ${
                        formattedDates[formattedDates.length - 1]
                      }`
                    : "Nincs elérhető adat"
                }
                data={lineChartData}
                options={lineChartOptions}
                badgeText={getBadgeText()}
                hasDates={formattedDates.length > 0}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <PieChartComponent
                data={pieChartData}
                options={pieChartOptions}
                title={
                  activeTab === "machines"
                    ? "Termékek Megoszlása"
                    : "Gépek Megoszlása"
                }
                subtitle={`Összesen ${totalSales} eladott termék`}
                badgeText={getBadgeText()}
                hasValues={pieChartValues.length > 0}
              />
            </Grid.Col>
          </Grid>

          {filteredSales.length === 0 && (
            <NoDataAlert activeTab="machines" show={true} />
          )}
        </>
      )}
    </div>
  );
}
