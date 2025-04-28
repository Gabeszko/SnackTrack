import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Notification, Transition } from "@mantine/core";
import { IconChecks, IconAlertCircle } from "@tabler/icons-react";
import NewProductForm from "./NewProductFormComponent";
import ProductList from "./ProductListComponent";

export interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  allocatedCapacity: number;
}

function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Termékek lekérése
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Product[]>(
        "http://localhost:5000/product/all"
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Hiba a termékek betöltésekor", "error");
    } finally {
      setLoading(false);
    }
  };

  //Visszajelzés a termékekről
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: null });
    }, 3000);
  };

  // Termék létrehozása
  const handleProductSubmit = async (productData: Product) => {
    try {
      if (editingProduct?._id) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          productData
        );
        showNotification("Termék sikeresen frissítve", "success");
      } else {
        await axios.post("http://localhost:5000/product", productData);
        showNotification("Új termék sikeresen hozzáadva", "success");
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Hiba a termék mentésekor", "error");
    }
  };

  // Termék szerkeztése
  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
  };

  // Termék törlése
  const handleProductDelete = async (id: string | undefined) => {
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

      <NewProductForm
        editingProduct={editingProduct}
        onSubmit={handleProductSubmit}
        onCancel={() => setEditingProduct(null)}
      />

      <ProductList
        products={products}
        loading={loading}
        onRefresh={fetchProducts}
        onEdit={handleProductEdit}
        onDelete={handleProductDelete}
      />
    </Container>
  );
}

export default ProductDashboard;
