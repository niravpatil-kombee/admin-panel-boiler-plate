import { useForm, Controller } from 'react-hook-form';
import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Category } from '../../types/product';
import { createCategoryAPI, getCategoryByIdAPI, updateCategoryAPI, getCategoriesAPI } from '../../services/category.api';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parent: z.string().optional(),
});

export default function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<Category>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parent: '',
    },
    resolver: zodResolver(categorySchema),
  });
  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    // Fetch all categories for parent select
    getCategoriesAPI().then((data) => setCategories(data.categories));
    if (isEdit && id) {
      setLoading(true);
      getCategoryByIdAPI(id)
        .then((category) => reset({
          ...category,
          parent: category.parent || '',
        }))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: Category) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parent: data.parent || undefined,
    };
    if (isEdit && id) await updateCategoryAPI(id, payload);
    else await createCategoryAPI(payload);
    navigate('/categories');
  };

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;

  return (
    <Box maxWidth="sm" mx="auto" p={4} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom>{isEdit ? 'Edit Category' : 'Create Category'}</Typography>

      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Category Name" fullWidth sx={{ mb: 2 }} />
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

      {/* Parent Category Select */}
      <Controller
        name="parent"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Parent Category" select fullWidth sx={{ mb: 2 }}>
            <MenuItem value="">None</MenuItem>
            {categories.filter((cat) => !isEdit || cat._id !== id).map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
            ))}
          </TextField>
        )}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </Box>
    </Box>
  );
}
