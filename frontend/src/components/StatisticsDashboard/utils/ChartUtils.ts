// This file contains utility functions for chart data processing
import { CHART_COLORS } from "../../types";

export const createLineChartData = (
  formattedDates: string[],
  tempProfitPerDay: { [date: string]: number }
) => {
  const sortedDates = Object.keys(tempProfitPerDay).sort();

  return {
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
};

export const createLineChartOptions = () => {
  return {
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
          label: function (context: any) {
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
          callback: function (value: any) {
            return value.toLocaleString("hu-HU") + " Ft";
          },
        },
      },
    },
  };
};

export const createPieChartOptions = () => {
  return {
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
};

export const createPieChartData = (
  labels: string[],
  values: number[],
  activeTab: string | null
) => {
  return {
    labels: labels,
    datasets: [
      {
        label:
          activeTab === "machines" ? "Termékek megoszlása" : "Gépek megoszlása",
        data: values,
        backgroundColor: CHART_COLORS,
        borderColor: Array(labels.length).fill("#ffffff"),
        borderWidth: 2,
      },
    ],
  };
};
