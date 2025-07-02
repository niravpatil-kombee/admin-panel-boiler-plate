import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, deleteProductAPI } from '../../services/product.api';
import type { Product } from '../../types/product';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';

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
      await deleteProductAPI(productToDelete);
      fetchProducts();
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <Box>
      <PageHeader title="Product Management" buttonText="Add Product" buttonLink="/products/new" />

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
            const basePrice = mainVariant?.price?.base ?? product.price?.base ?? 0;
            const discount = mainVariant?.price?.discount ?? product.price?.discount ?? 0;
            const finalPrice = mainVariant?.price?.finalPrice ?? product.price?.finalPrice ?? basePrice;
            const imageUrl =
              product.images?.[0]?.url ??
              mainVariant?.images?.[0] ??
              '/placeholder.png';
            const stock = mainVariant?.inventory?.quantity ?? product.inventory?.quantity ?? 0;

            return (
              <Box
                key={product._id}
                width={{ xs: '100%', sm: '47%', md: '31%', lg: '23%' }}
                minWidth={250}
                maxWidth={300}
                flexGrow={1}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      imageUrl.startsWith('http')
                        ? imageUrl
                        : `http://localhost:5001${imageUrl}`
                    }
                    alt={product.title}

                   
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.title}</Typography>

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
