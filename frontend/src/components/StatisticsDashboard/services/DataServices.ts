// This file contains the data processing logic
//import { Sale } from "../../types";

// Define clearer interface for our processed sale data
interface FormattedSale {
  saleId: string;
  machineId: string;
  machineName: string;
  date: string;
  allProfit: number;
  products: {
    productId: string;
    productName: string;
    productCategory: string;
    quantity: number;
    productProfit: number;
  }[];
}

// Process raw MongoDB sales data into a consistent format
export const processSalesData = (rawSales: any[]): FormattedSale[] => {
  return rawSales.map((sale) => ({
    saleId: sale._id.toString(),
    machineId:
      sale.machineId?._id?.toString() || sale.machineId?.toString() || "",
    machineName: sale.machineId?.name || "Ismeretlen gép",
    machineLocation: sale.machineId?.location,
    date: sale.date,
    allProfit: sale.allProfit,
    products: (sale.products || []).map((product) => ({
      productId:
        product.productId?._id?.toString() ||
        product.productId?.toString() ||
        "",
      productName:
        product.productId?.name || product.name || "Ismeretlen termék",
      productCategory:
        product.productId?.category ||
        product.category ||
        "Ismeretlen kategória",
      quantity: product.quantity || 0,
      productProfit: product.productProfit || 0,
    })),
  }));
};

// This function should be called directly after fetching data from MongoDB
export const getSalesData = async () => {
  try {
    // Directly return raw data - let the consumer handle processing with processSalesData
    const sales = await Sale.find()
      .populate({
        path: "machineId",
        select: "name location",
      })
      .populate({
        path: "products.productId",
        select: "name category",
      })
      .lean();

    return processSalesData(sales);
  } catch (error) {
    console.error("Hiba a sales adatok lekérésekor:", error);
    throw error;
  }
};

export const aggregateProductDistribution = (
  filteredSales: FormattedSale[],
  activeTab: string | null,
  allSales: FormattedSale[],
  selectedProductId: string | "all"
) => {
  // For products tab
  if (activeTab === "products") {
    // Get sales with the selected product
    const salesWithSelectedProduct = allSales.filter((sale) =>
      sale.products.some(
        (p) => selectedProductId === "all" || p.productId === selectedProductId
      )
    );

    // Aggregate by machine
    const machineDistribution: {
      [machineId: string]: { name: string; count: number };
    } = {};

    salesWithSelectedProduct.forEach((sale) => {
      const relevantProducts = sale.products.filter(
        (p) => selectedProductId === "all" || p.productId === selectedProductId
      );

      const quantity = relevantProducts.reduce((sum, p) => sum + p.quantity, 0);

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

export const aggregateProfitByDay = (filteredSales: FormattedSale[]) => {
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

  return { tempProfitPerDay, formattedDates, sortedDates };
};

export const generateDropdownOptions = (sales: FormattedSale[]) => {
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

  return { machineOptions, productOptions };
};

export const calculateStatistics = (filteredSales: FormattedSale[]) => {
  const totalSales = filteredSales.reduce(
    (sum, sale) =>
      sum + sale.products.reduce((pSum, product) => pSum + product.quantity, 0),
    0
  );

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.allProfit,
    0
  );

  const { tempProfitPerDay } = aggregateProfitByDay(filteredSales);
  const salesDays = Object.keys(tempProfitPerDay).length;
  const averageDailyRevenue = salesDays > 0 ? totalRevenue / salesDays : 0;

  return { totalSales, totalRevenue, salesDays, averageDailyRevenue };
};

export const exportDataToCSV = (
  filteredSales: FormattedSale[],
  activeTab: string | null,
  allSales: FormattedSale[],
  selectedMachineId: string | "all",
  selectedProductId: string | "all",
  machineOptions: { value: string; label: string }[],
  productOptions: { value: string; label: string }[]
) => {
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
            machineOptions.find((m) => m.value === selectedMachineId)?.label ||
            selectedMachineId
          }_statisztika.csv`;
  } else {
    // Products tab export
    header = "Dátum,Gép,Termék,Mennyiség,Profit (Ft)\n";

    const relevantSales = allSales.filter((sale) =>
      sale.products.some(
        (p) => selectedProductId === "all" || p.productId === selectedProductId
      )
    );

    rows = relevantSales.flatMap((sale) => {
      const relevantProducts = sale.products.filter(
        (p) => selectedProductId === "all" || p.productId === selectedProductId
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
            productOptions.find((p) => p.value === selectedProductId)?.label ||
            selectedProductId
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
};
