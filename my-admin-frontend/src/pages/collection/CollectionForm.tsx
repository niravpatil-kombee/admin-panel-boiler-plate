import { useForm, Controller } from 'react-hook-form';
import { Box, Button, CircularProgress, MenuItem, TextField, Typography, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Collection, Product } from '../../types/product';
import { createCollectionAPI, getCollectionByIdAPI, updateCollectionAPI } from '../../services/collection.api';
import { getProductsAPI } from '../../services/product.api';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  products: z.array(z.string()).optional(),
});

export default function CollectionFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<Collection>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      products: [],
    },
    resolver: zodResolver(collectionSchema),
  });
  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    getProductsAPI().then((data) => setProducts(data.products || []));
    if (isEdit && id) {
      setLoading(true);
      getCollectionByIdAPI(id)
        .then((collection) => reset({
          ...collection,
          products: collection.products || [],
        }))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: Collection) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      products: data.products || [],
    };
    if (isEdit && id) await updateCollectionAPI(id, payload);
    else await createCollectionAPI(payload);
    navigate('/collections');
  };

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;

  return (
    <Box maxWidth="sm" mx="auto" p={4} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>{isEdit ? 'Edit Collection' : 'Create Collection'}</Typography>

      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Collection Name" fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Slug */}
      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Slug" fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" multiline rows={3} fullWidth sx={{ mb: 2 }} />
        )}
      />

      {/* Products Multi-Select */}
      <Controller
        name="products"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="products-label">Products</InputLabel>
            <Select
              {...field}
              labelId="products-label"
              multiple
              input={<OutlinedInput label="Products" />}
              renderValue={(selected) =>
                products.filter((p) => p._id && selected.includes(p._id)).map((p) => p.name).join(', ')
              }
            >
              {products.filter((product) => product._id).map((product) => (
                <MenuItem key={product._id} value={product._id!}>
                  <Checkbox checked={field.value?.includes(product._id!)} />
                  <ListItemText primary={product.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Collection'}
        </Button>
      </Box>
    </Box>
  );
}
