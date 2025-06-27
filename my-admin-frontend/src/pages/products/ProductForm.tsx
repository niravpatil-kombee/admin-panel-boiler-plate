import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { getProductByIdAPI, createProductAPI, updateProductAPI } from '../../services/product.api';
import type { Product } from '../../types/product';

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Product>({
    defaultValues: { name: '', price: 0, stock: 0, description: '', category: '', image: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isEdit && id) {
          const product = await getProductByIdAPI(id);
          reset(product);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit, reset]);

  const onSubmit = async (data: Product) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value instanceof FileList && value.length > 0) {
        formData.append('image', value[0]);
      } else if (key !== 'image') {
        formData.append(key, value as any);
      }
    });
    if (isEdit && id) {
      await updateProductAPI(id, formData);
    } else {
      await createProductAPI(formData);
    }
    navigate('/products');
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Product' : 'Create New Product'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Product name is required' }}
            render={({ field }) => (
              <TextField {...field} label="Product Name" fullWidth error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 3 }} />
            )}
          />
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be positive' } }}
            render={({ field }) => (
              <TextField {...field} type="number" label="Price" fullWidth error={!!errors.price} helperText={errors.price?.message} sx={{ mb: 3 }} />
            )}
          />
          <Controller
            name="stock"
            control={control}
            rules={{ required: 'Stock is required', min: { value: 0, message: 'Stock must be positive' } }}
            render={({ field }) => (
              <TextField {...field} type="number" label="Stock" fullWidth error={!!errors.stock} helperText={errors.stock?.message} sx={{ mb: 3 }} />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Category" fullWidth sx={{ mb: 3 }} />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Description" fullWidth multiline rows={3} sx={{ mb: 3 }} />
            )}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                onChange={e => field.onChange(e.target.files)}
                style={{ marginBottom: 24 }}
              />
            )}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/products')} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
} 