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
  const [selectedMachineId, setSelectedMachineId] = useState<string | "all">(
    "all"
  );

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

  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Napi profit (Ft)",
        data: sortedDates.map((date) => tempProfitPerDay[date]),
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
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

  const pieChartLabels: string[] = [];
  const pieChartDataValues: number[] = [];
  let otherProductsCount = 0;

  for (const [productId, count] of Object.entries(productCounts)) {
    const percentage = (count / totalProductsSold) * 100;
    if (percentage < 5) {
      otherProductsCount += count;
    } else {
      pieChartLabels.push(productId);
      //pieChartLabels.push(product.productId.name);
      pieChartDataValues.push(count);
    }
  }

  if (otherProductsCount > 0) {
    pieChartLabels.push("Egyéb");
    pieChartDataValues.push(otherProductsCount);
  }

  const pieChartData = {
    labels: pieChartLabels,
    datasets: [
      {
        label: "Eladások megoszlása",
        data: pieChartDataValues,
        backgroundColor: [
          "#77aaff",
          "#99ccff",
          "#bbeeff",
          "#5588ff",
          "#3366ff",
          "#aaddff",
          "#88bbff",
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  // MachineID-k listája a dropdownhoz
  const machineIds = Array.from(
    new Set(sales.map((sale) => sale.machineId))
  ).filter((id) => id);

  return (
    <div className="w-full space-y-8">
      {loading ? (
        <p>Adatok töltése...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div>
            <label className="mr-2">Válassz gépet:</label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">Összes gép</option>
              {machineIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full h-96">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>

          <div className="w-full h-96">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </>
      )}
    </div>
  );
}
