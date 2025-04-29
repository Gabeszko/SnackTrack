import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mantine/core";
import NewProductForm from "./NewProductFormComponent";
import ProductList from "./ProductListComponent";
import NotificationComponent from "../Notification/NotificationComponent";
import { useNotification } from "../Notification/useNotification";
import { COLORS, Product } from "../types";

function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { notification, showNotification, clearNotification } =
    useNotification();

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

  // Termék létrehozása
  const handleProductSubmit = async (productData: Product) => {
    try {
      if (editingProduct?._id) {
        await axios.put(
          `http://localhost:5000/product/${editingProduct._id}`,
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
      await axios.delete(`http://localhost:5000/product/${id}`);
      showNotification("Termék sikeresen törölve", "success");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Hiba a termék törlésekor", "error");
    }
  };

  return (
    <Box
      style={{
        padding: "2rem",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* Notification component */}
      <NotificationComponent
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
      />

      <Box
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          backgroundColor: COLORS.background,
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          padding: "2rem",
          marginBottom: "2rem",
        }}
      >
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
      </Box>
    </Box>
  );
}

export default ProductDashboard;
