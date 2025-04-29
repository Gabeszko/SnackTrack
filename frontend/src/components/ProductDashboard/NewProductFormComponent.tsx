import { useState, useEffect, FormEvent } from "react";
import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Card,
  Title,
  Text,
  Select,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus, IconX } from "@tabler/icons-react";
import { Product } from "./ProductDashboardComponent";

interface NewProductFormProps {
  editingProduct: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

function NewProductForm({
  editingProduct,
  onSubmit,
  onCancel,
}: NewProductFormProps) {
  const [productForm, setProductForm] = useState<Product>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    allocatedCapacity: 0,
  });

  useEffect(() => {
    if (editingProduct) {
      setProductForm(editingProduct);
    } else {
      setProductForm({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        allocatedCapacity: 0,
      });
    }
  }, [editingProduct]);

  const handleProductChange = (
    field: keyof Product,
    value: string | number | null
  ) => {
    const finalValue = value === null ? 0 : value;
    setProductForm({ ...productForm, [field]: finalValue });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(productForm);
    setProductForm({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      allocatedCapacity: 0,
    });
  };

  const categoryOptions = [
    { value: "Ital", label: "Ital" },
    { value: "Étel", label: "Étel" },
    { value: "Egyéb", label: "Egyéb" },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Termékkezelő</Title>
      </Card.Section>

      <form onSubmit={handleSubmit}>
        <Stack gap="md" mt="md">
          <Title order={4} c={editingProduct ? "blue" : "dark"}>
            {editingProduct ? "Termék szerkesztése" : "Új termék hozzáadása"}
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
              onChange={(value) => handleProductChange("category", value || "")}
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

          <Group justify="flex-end" mt="md">
            {editingProduct && (
              <Button
                variant="light"
                color="gray"
                onClick={onCancel}
                leftSection={<IconX size={16} />}
              >
                Megszakítás
              </Button>
            )}
            <Button
              type="submit"
              leftSection={
                editingProduct ? (
                  <IconDeviceFloppy size={16} />
                ) : (
                  <IconPlus size={16} />
                )
              }
              color="blue"
            >
              {editingProduct ? "Termék mentése" : "Termék hozzáadása"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}

export default NewProductForm;
