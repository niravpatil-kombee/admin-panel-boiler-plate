import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getProductsAPI, deleteProductAPI } from "../../services/product.api";
import type { Product } from "../../types/product";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageHeader from "../../components/PageHeader";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsAPI();
      setProducts(data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => navigate(`/products/edit/${id}`);
  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProductAPI(productToDelete);
        fetchProducts();
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        setConfirmOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const getImageUrl = (product: Product): string => {
    const variantImg = product.variants?.[0]?.images?.[0];
    if (typeof variantImg === "string") {
      return variantImg.startsWith("http")
        ? variantImg
        : `http://localhost:5001${variantImg}`;
    }
    return "/placeholder.png";
  };

  return (
    <Box>
      <PageHeader
        title="Product Management"
        buttonText="Add Product"
        buttonLink="/products/new"
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          mt={3}
          display="flex"
          flexWrap="wrap"
          gap={3}
          justifyContent="flex-start"
        >
          {products.map((product) => {
            const mainVariant = product.variants?.[0];
            let basePrice = 0, discount = 0, finalPrice = 0;
            if (typeof mainVariant?.price === 'object' && mainVariant?.price !== null) {
              basePrice = (mainVariant.price as any).base ?? 0;
              discount = (mainVariant.price as any).discount ?? 0;
              finalPrice = (mainVariant.price as any).finalPrice ?? basePrice;
            } else if (typeof mainVariant?.price === 'number') {
              basePrice = mainVariant.price;
              finalPrice = mainVariant.price;
            }
            const stock = mainVariant?.inventory?.quantity ?? 0;
            const imageUrl = getImageUrl(product);

            return (
              <Box
                key={product._id}
                width={{ xs: "100%", sm: "48%", md: "31%", lg: "23%" }}
                minWidth={250}
                maxWidth={300}
                flexGrow={1}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      Final Price: ₹{finalPrice}
                    </Typography>

                    {discount > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Base: ₹{basePrice}, Discount: ₹{discount}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      Stock: {stock}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <IconButton onClick={() => handleEdit(product._id!)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product._id!)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </Box>
  );
}
