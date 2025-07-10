import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { getBrandByIdAPI, createBrandAPI, updateBrandAPI } from '../../services/brand.api';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

export default function BrandFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting }, watch, setValue } = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: '', slug: '', description: '' },
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const nameValue = watch('name');
  const slugValue = watch('slug');

  useEffect(() => {
    if (isEdit && id) {
      getBrandByIdAPI(id).then(({ brand }) => {
        reset({
          name: brand.name ?? '',
          slug: brand.slug ?? '',
          description: brand.description ?? '',
        });
      });
    }
  }, [id, isEdit, reset]);

  useEffect(() => {
    if (!slugManuallyEdited) {
      const generatedSlug = nameValue
        ? nameValue
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : '';
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, slugManuallyEdited, setValue]);

  const onSubmit = async (data: z.infer<typeof brandSchema>) => {
    if (isEdit && id) await updateBrandAPI(id, data);
    else await createBrandAPI(data);
    navigate('/brands');
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Brand' : 'Create New Brand'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Brand Name" fullWidth error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 3 }}
                onChange={e => {
                  field.onChange(e);
                  setSlugManuallyEdited(false);
                }}
              />
            )}
          />
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Slug" fullWidth error={!!errors.slug} helperText={errors.slug?.message} sx={{ mb: 3 }}
                onChange={e => {
                  field.onChange(e);
                  setSlugManuallyEdited(true);
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Description" fullWidth multiline rows={3} sx={{ mb: 3 }} />
            )}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/brands')} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Brand'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
