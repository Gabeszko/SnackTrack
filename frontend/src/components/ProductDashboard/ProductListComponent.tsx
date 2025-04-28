import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Table,
  ActionIcon,
  Paper,
  Text,
  Select,
  Card,
  Badge,
  Loader,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import {
  IconTrash,
  IconEdit,
  IconSearch,
  IconFilter,
  IconX,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { Product } from "./ProductDashboard";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string | undefined) => void;
}

function ProductList({
  products,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}: ProductListProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

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
        if (a[sortConfig.key!]! < b[sortConfig.key!]!) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!]! > b[sortConfig.key!]!) {
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

  const renderStockStatus = (stock: number, allocatedCapacity: number) => {
    if (stock <= 0) {
      return <Badge color="red">Nincs készleten</Badge>;
    } else if (stock < allocatedCapacity) {
      return <Badge color="orange">Kevés: {stock} db</Badge>;
    } else {
      return <Badge color="green">{stock} db</Badge>;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group justify="space-between">
          <Title order={3}>Termékek listája</Title>
          <Button
            variant="light"
            onClick={onRefresh}
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
          data={[{ value: "", label: "Összes kategória" }, ...categoryOptions]}
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
                    Raktárkészlet
                    {getSortIcon("stock")}
                  </Group>
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort("allocatedCapacity")}
                  style={{ cursor: "pointer" }}
                >
                  <Group gap="xs">
                    Lefoglalt mennyiség
                    {getSortIcon("allocatedCapacity")}
                  </Group>
                </Table.Th>
                <Table.Th>Műveletek</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Group justify="center" p="md">
                      <Loader />
                      <Text>Termékek betöltése...</Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ) : filteredProducts.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
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
                    <Table.Td>
                      {renderStockStatus(
                        product.stock,
                        product.allocatedCapacity
                      )}
                    </Table.Td>
                    <Table.Td>
                      {product.allocatedCapacity !== undefined ? (
                        <Group gap="xs">
                          <Text size="sm">{product.allocatedCapacity} db</Text>
                        </Group>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Nincs adat
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Szerkesztés">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => onEdit(product)}
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
                                onDelete(product._id);
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
  );
}

// Add missing Title component import
import { Title } from "@mantine/core";

export default ProductList;
