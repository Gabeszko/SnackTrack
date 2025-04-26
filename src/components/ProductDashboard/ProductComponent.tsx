import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import {
  Title,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Table,
  ActionIcon,
  Container,
  Paper,
  Text,
  Select,
  Card,
  Badge,
  Notification,
  Loader,
  Transition,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import {
  IconTrash,
  IconEdit,
  IconDeviceFloppy,
  IconPlus,
  IconSearch,
  IconFilter,
  IconX,
  IconArrowUp,
  IconArrowDown,
  IconChecks,
  IconAlertCircle,
} from "@tabler/icons-react";

export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

function ProductComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const [productForm, setProductForm] = useState<Product>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, filterCategory, sortConfig]);

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filtering by search term
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtering by category
    if (filterCategory) {
      result = result.filter((product) => product.category === filterCategory);
    }

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  };

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof Product) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <IconArrowUp size={14} />
    ) : (
      <IconArrowDown size={14} />
    );
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Product[]>(
        "http://localhost:5000/api/products"
      );
      setProducts(res.data);
      //      showNotification("Termékek sikeresen betöltve", "success");
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Hiba a termékek betöltésekor", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (
    field: keyof Product,
    value: string | number | null
  ) => {
    const finalValue = value === null ? 0 : value;
    setProductForm({ ...productForm, [field]: finalValue });
  };

  const startProductEdit = (product: Product) => {
    setProductForm(product);
    setEditingId(product._id ?? null);
  };

  const clearEditingProduct = () => {
    setEditingId(null);
    setProductForm({ name: "", category: "", price: 0, stock: 0 });
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: null });
    }, 3000);
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          productForm
        );
        showNotification("Termék sikeresen frissítve", "success");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/products", productForm);
        showNotification("Új termék sikeresen hozzáadva", "success");
      }
      setProductForm({ name: "", category: "", price: 0, stock: 0 });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Hiba a termék mentésekor", "error");
    }
  };

  const deleteProduct = async (id: string | undefined) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      showNotification("Termék sikeresen törölve", "success");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Hiba a termék törlésekor", "error");
    }
  };

  const categoryOptions = [
    { value: "Ital", label: "Ital" },
    { value: "Étel", label: "Étel" },
    { value: "Egyéb", label: "Egyéb" },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Ital":
        return "blue";
      case "Étel":
        return "green";
      case "Egyéb":
        return "gray";
      default:
        return "gray";
    }
  };

  const renderStockStatus = (stock: number) => {
    if (stock <= 0) {
      return <Badge color="red">Nincs készleten</Badge>;
    } else if (stock < 10) {
      return <Badge color="orange">Alacsony készlet: {stock} db</Badge>;
    } else {
      return <Badge color="green">Készleten: {stock} db</Badge>;
    }
  };

  return (
    <Container size="lg" py="lg">
      {notification.type && (
        <Transition
          mounted={!!notification.message}
          transition="slide-down"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Notification
              style={{
                ...styles,
                position: "fixed",
                top: 20,
                right: 20,
                zIndex: 1000,
              }}
              color={notification.type === "success" ? "green" : "red"}
              title={
                notification.type === "success"
                  ? "Sikeres művelet"
                  : "Hiba történt"
              }
              icon={
                notification.type === "success" ? (
                  <IconChecks size={18} />
                ) : (
                  <IconAlertCircle size={18} />
                )
              }
              withCloseButton
              onClose={() => setNotification({ message: "", type: null })}
            >
              {notification.message}
            </Notification>
          )}
        </Transition>
      )}

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
        <Card.Section withBorder inheritPadding py="xs">
          <Title order={3}>Termékkezelő</Title>
        </Card.Section>

        <form onSubmit={handleProductSubmit}>
          <Stack gap="md" mt="md">
            <Title order={4} c={editingId ? "blue" : "dark"}>
              {editingId ? "Termék szerkesztése" : "Új termék hozzáadása"}
            </Title>

            <Group grow gap="md">
              <TextInput
                label="Termék neve"
                placeholder="Add meg a termék nevét"
                value={productForm.name}
                onChange={(e) => handleProductChange("name", e.target.value)}
                required
                leftSection={
                  <Text size="sm" c="dimmed">
                    #
                  </Text>
                }
              />
              <Select
                label="Kategória"
                placeholder="Válassz kategóriát"
                data={categoryOptions}
                value={productForm.category}
                onChange={(value) =>
                  handleProductChange("category", value || "")
                }
                required
                clearable={false}
              />
            </Group>

            <Group grow gap="md">
              <NumberInput
                label="Vétel ár"
                placeholder="Add meg a vétel árat"
                value={productForm.price}
                onChange={(value) => handleProductChange("price", value)}
                min={0}
                rightSection={<Text size="sm">Ft</Text>}
                required
              />
              <NumberInput
                label="Készlet mennyiség"
                placeholder="Add meg a készlet mennyiséget"
                value={productForm.stock}
                onChange={(value) => handleProductChange("stock", value)}
                min={0}
                rightSection={<Text size="sm">Db</Text>}
                required
              />
            </Group>

            <Group justify="space-between" mt="md">
              {editingId && (
                <Button
                  variant="light"
                  color="gray"
                  onClick={clearEditingProduct}
                  leftSection={<IconX size={16} />}
                >
                  Megszakítás
                </Button>
              )}
              <Button
                type="submit"
                leftSection={
                  editingId ? (
                    <IconDeviceFloppy size={16} />
                  ) : (
                    <IconPlus size={16} />
                  )
                }
                fullWidth={!editingId}
                color={editingId ? "blue" : "green"}
              >
                {editingId ? "Termék mentése" : "Termék hozzáadása"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group justify="space-between">
            <Title order={3}>Termékek listája</Title>
            <Button
              variant="light"
              onClick={fetchProducts}
              disabled={loading}
              leftSection={loading ? <Loader size="xs" /> : null}
            >
              Frissítés
            </Button>
          </Group>
        </Card.Section>

        <Group mb="md">
          <TextInput
            placeholder="Keresés termék név alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchTerm ? (
                <ActionIcon size="sm" onClick={() => setSearchTerm("")}>
                  <IconX size={16} />
                </ActionIcon>
              ) : null
            }
            style={{ flexGrow: 1 }}
          />
          <Select
            placeholder="Kategória szűrés"
            value={filterCategory}
            onChange={(value) => setFilterCategory(value || "")}
            data={[
              { value: "", label: "Összes kategória" },
              ...categoryOptions,
            ]}
            leftSection={<IconFilter size={16} />}
            clearable
            style={{ width: 200 }}
          />
        </Group>

        <Paper withBorder>
          <ScrollArea h={400}>
            <Table striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    <Group gap="xs">
                      Termék név
                      {getSortIcon("name")}
                    </Group>
                  </Table.Th>
                  <Table.Th
                    onClick={() => handleSort("category")}
                    style={{ cursor: "pointer" }}
                  >
                    <Group gap="xs">
                      Kategória
                      {getSortIcon("category")}
                    </Group>
                  </Table.Th>
                  <Table.Th
                    onClick={() => handleSort("price")}
                    style={{ cursor: "pointer" }}
                  >
                    <Group gap="xs">
                      Vétel ár
                      {getSortIcon("price")}
                    </Group>
                  </Table.Th>
                  <Table.Th
                    onClick={() => handleSort("stock")}
                    style={{ cursor: "pointer" }}
                  >
                    <Group gap="xs">
                      Készlet
                      {getSortIcon("stock")}
                    </Group>
                  </Table.Th>
                  <Table.Th>Műveletek</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Group justify="center" p="md">
                        <Loader />
                        <Text>Termékek betöltése...</Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredProducts.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text ta="center" py="md" c="dimmed">
                        Nincs megjeleníthető termék
                        {searchTerm || filterCategory
                          ? " a keresési feltételekkel"
                          : ""}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredProducts.map((product) => (
                    <Table.Tr key={product._id}>
                      <Table.Td>
                        <Text fw={500}>{product.name}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getCategoryColor(product.category)}>
                          {product.category}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>
                          {product.price.toLocaleString("hu-HU")} Ft
                        </Text>
                      </Table.Td>
                      <Table.Td>{renderStockStatus(product.stock)}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="Szerkesztés">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => startProductEdit(product)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Törlés">
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Biztosan törlöd a(z) "${product.name}" terméket?`
                                  )
                                ) {
                                  deleteProduct(product._id);
                                }
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>

        <Text c="dimmed" size="sm" ta="right" mt="xs">
          Összesen: {filteredProducts.length} termék{" "}
          {searchTerm || filterCategory
            ? `(szűrve az összes ${products.length} termékből)`
            : ""}
        </Text>
      </Card>
    </Container>
  );
}

export default ProductComponent;
