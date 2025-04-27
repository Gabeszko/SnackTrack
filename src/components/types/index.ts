export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  allocatedCapacity: { type: number; default: 0 };
}

export interface Slot {
  slotCode: string;
  product: Product | string | null;
  quantity: number;
  capacity: number;
  price: number;
  //space: Normal | Wide
}

export interface MachineType {
  _id: string;
  name: string;
  location: string;
  rows: number;
  cols: number;
  slots: Slot[];
  status: "Active" | "Maintenance" | "Offline";
  fullness: number;
}

export interface Sale {
  _id: string;
  machineId?: string;
  date: string;
  products: Array<{
    productId: string;
    quantity: number;
    productProfit: number;
  }>;
  allProfit: number;
}

export const COLORS = {
  primary: "#3b82f6", // blue
  primaryLight: "#93c5fd", // light blue
  primaryDark: "#1d4ed8", // dark blue
  secondary: "#6366f1", // indigo
  success: "#22c55e", // green
  successLight: "#bbf7d0", // light green
  warning: "#f59e0b", // yellow
  warningLight: "#fef3c7", // light yellow
  danger: "#ef4444", // red
  dangerLight: "#fee2e2", // light red
  info: "#0ea5e9", // light blue
  infoLight: "#e0f2fe", // very light blue
  light: "#f8fafc", // very light grey
  lightBorder: "#e2e8f0", // border gray
  darkBorder: "#94a3b8", // darker border
  background: "#ffffff", // white
  dark: "#1e293b", // dark grey
  text: "#334155", // text color
  textLight: "#64748b", // light text
};

export const CHART_COLORS = [
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

export const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
