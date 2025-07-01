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
          {products.map((product) => (
            <Box
              key={product._id}
              width={{ xs: '100%', sm: '47%', md: '31%', lg: '23%' }}
              minWidth={250}
              maxWidth={300}
              flexGrow={1}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {product.images?.[0]?.url && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.images?.[0]?.url
                      ? product.images[0].url.startsWith('http')
                        ? product.images[0].url
                        : `http://localhost:5001${product.images[0].url}`
                      : '/placeholder.png'}
                    alt={product.name}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ₹{product.price?.base}{" "}
                    {product.price?.discount ? `(₹${product.price.discount})` : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.inventory?.quantity ?? 0}
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
          ))}
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
