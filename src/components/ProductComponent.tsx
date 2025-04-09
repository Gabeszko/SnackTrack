import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

export interface Product {
    _id?: string;
    name: string;
    category: string;
    price: number;
    stock: number;
  }

function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
  });

useEffect(() => {
    fetchProducts();
}, []);


const fetchProducts = async () => {
    const res = await axios.get<Product[]>('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'stock' ? Number(value) : value });
  };


  // ADD
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (product: Product) => {
    setForm(product);
    setEditingId(product._id ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // SUBMIT
    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/products', form);
    }
    // EDIT
    setForm({ name: '', category: '', price: 0, stock: 0 });
    fetchProducts();
  };

  // DELETING 
  const deleteProduct = async (id: string | undefined) => {
    if (!id) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Automata termékek</h1>
  
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Termék név" value={form.name} onChange={handleChange} />
        <input name="category" placeholder="Kategória" value={form.category} onChange={handleChange} />
        <input name="price" placeholder="Ár" value={form.price} type="number" onChange={handleChange} /> Ft
        <input name="stock" placeholder="Készlet" value={form.stock} type="number" onChange={handleChange} /> Db
        <button type="submit">Hozzáadás</button>
      </form>
  
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} – {p.category} – {p.price} Ft – Készlet: {p.stock} db
            <button onClick={() => deleteProduct(p._id)}>❌</button>
            <button onClick={() => startEdit(p)}>✏️</button>
          </li>
        ))}
      </ul>
  
    </div>
    );
  }
  
  export default Product;
  