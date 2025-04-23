export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
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
}
