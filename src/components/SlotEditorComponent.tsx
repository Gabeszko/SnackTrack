import { useEffect, useState } from 'react';
import axios from 'axios';

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
}

interface SlotEditorProps {
  slot: Slot;
  machineId: string;
  onSave: () => void;
}

const SlotEditor = ({ slot, machineId, onSave }: SlotEditorProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(slot.product && typeof slot.product === 'object' ? slot.product._id : '');
  const [qty, setQty] = useState(slot.quantity);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get<Product[]>('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleSave = async () => {
    await axios.patch(`http://localhost:5000/api/machines/${machineId}/slots/${slot.slotCode}`, {
      product: selectedProduct || null,
      quantity: qty
    });
    onSave(); // pl. gépek újratöltése
  };

  //      <strong>{slot.slotCode}</strong> –{" "}

  return (
    <div style={{ marginBottom: '1rem' }}>
      <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
        <option value="">(üres)</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        style={{ width: '60px', marginLeft: '10px' }}
      />
      <button onClick={handleSave} style={{ marginLeft: '10px' }}>
        💾
      </button>
    </div>
  );
};

export default SlotEditor;
