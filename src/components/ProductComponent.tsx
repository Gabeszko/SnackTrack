import { useEffect, useState, /*ChangeEvent, */FormEvent } from 'react';
import axios from 'axios';
import { 
  Title, 
  TextInput, 
  NumberInput, 
  Button, 
  Group, 
  Stack, 
//  Box,
  Table, 
  ActionIcon, 
  Container,
  Paper,
  Text
} from '@mantine/core';
import { IconTrash, IconEdit, IconDeviceFloppy, IconPlus } from '@tabler/icons-react';

export interface Product {
    _id?: string;
    name: string;
    category: string;
    price: number;
    stock: number;
  }

function ProductComponent() {
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
  try {
    const res = await axios.get<Product[]>('http://localhost:5000/api/products');
    setProducts(res.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  };

/*
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'stock' ? Number(value) : value });
  };

  const handleChange = (field: keyof Product, value: any) => {
    setForm({ ...form, [field]: value });
  };
*/

  const handleChange = (field: keyof Product, value: string | number | null) => {
    // Ha null érkezik (ami NumberInput esetén lehetséges), akkor 0-ra állítjuk
    const finalValue = value === null ? 0 : value;
    setForm({ ...form, [field]: finalValue });
  };

  // ADD
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (product: Product) => {
    setForm(product);
    setEditingId(product._id ?? null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try { // SUBMIT
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/products', form);
      }
      // EDIT
      setForm({ name: '', category: '', price: 0, stock: 0 });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // DELETING 
  const deleteProduct = async (id: string | undefined) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Container size="lg" mt="md">
      <Title order={2} mb="lg" c="blue">Automata termékek</Title>
      
      <Paper shadow="xs" p="md" mb="lg" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group grow gap="md">
              <TextInput
                label="Termék név"
                placeholder="Termék név"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <TextInput
                label="Kategória"
                placeholder="Kategória"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </Group>
            
            <Group grow gap="md">
              <NumberInput
                label="Ár (Ft)"
                placeholder="Ár"
                value={form.price}
                onChange={(value) => handleChange('price', value)}
                min={0}
                required
                rightSection={<Text size="sm">Ft</Text>}
              />
              <NumberInput
                label="Készlet (Db)"
                placeholder="Készlet"
                value={form.stock}
                onChange={(value) => handleChange('stock', value)}
                min={0}
                required
                rightSection={<Text size="sm">Db</Text>}
              />
            </Group>
            
            <Group justify="flex-end">
              <Button 
                type="submit" 
                leftSection={editingId ? <IconDeviceFloppy size={16} /> : <IconPlus size={16} />}
              >
                {editingId ? 'Mentés' : 'Hozzáadás'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
      
      <Paper shadow="xs" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Termék név</Table.Th>
              <Table.Th>Kategória</Table.Th>
              <Table.Th>Ár</Table.Th>
              <Table.Th>Készlet</Table.Th>
              <Table.Th>Műveletek</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product) => (
              <Table.Tr key={product._id}>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>{product.category}</Table.Td>
                <Table.Td>{product.price} Ft</Table.Td>
                <Table.Td>{product.stock} db</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon 
                      variant="outline" 
                      color="blue" 
                      onClick={() => startEdit(product)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="outline" 
                      color="red" 
                      onClick={() => deleteProduct(product._id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}  

export default ProductComponent;
  