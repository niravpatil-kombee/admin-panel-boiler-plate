import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, Paper, TextField, Typography, MenuItem } from '@mui/material';
import { getAttributeByIdAPI, createAttributeAPI, updateAttributeAPI } from '../../services/attributes.api';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const attributeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  inputType: z.enum(["text", "dropdown", "multi-select", "file"]),
  options: z.array(z.string()).optional(),
  isRequired: z.boolean().optional(),
  isVariantLevel: z.boolean().optional(),
});

export default function AttributeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<z.infer<typeof attributeSchema>>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: '',
      slug: '',
      inputType: 'text',
      options: [],
      isRequired: false,
      isVariantLevel: false,
    },
  });

  const inputType = watch('inputType');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const nameValue = watch('name');

  useEffect(() => {
    if (isEdit && id) {
      getAttributeByIdAPI(id).then(({ attribute }) => {
        reset({
          name: attribute.name || '',
          slug: attribute.slug || '',
          inputType: attribute.inputType || 'text',
          options: attribute.options ?? [],
          isRequired: !!attribute.isRequired,
          isVariantLevel: !!attribute.isVariantLevel,
        });
      });
    }
  }, [id, isEdit, reset]);

  // Auto-generate slug from name unless manually edited
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

  const onSubmit = async (data: z.infer<typeof attributeSchema>) => {
    // Convert data to FormData for API
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('inputType', data.inputType);
    formData.append('isRequired', String(data.isRequired ?? false));
    formData.append('isVariantLevel', String(data.isVariantLevel ?? false));
    if (data.inputType === 'dropdown' || data.inputType === 'multi-select') {
      (data.options ?? []).forEach(opt => formData.append('options', opt));
    }
    // Debug: log FormData content
    for (const pair of formData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }
    if (isEdit && id) await updateAttributeAPI(id, formData);
    else await createAttributeAPI(formData);
    navigate('/attributes');
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Attribute' : 'Create New Attribute'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Attribute Name" fullWidth error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 3 }}
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
            name="inputType"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Input Type" fullWidth sx={{ mb: 3 }}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="dropdown">Dropdown</MenuItem>
                <MenuItem value="multi-select">Multi-Select</MenuItem>
                <MenuItem value="file">File</MenuItem>
              </TextField>
            )}
          />
          {(inputType === 'dropdown' || inputType === 'multi-select') && (
            <Controller
              name="options"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Options (comma-separated)"
                  fullWidth
                  sx={{ mb: 3 }}
                  onChange={(e) => field.onChange(e.target.value.split(',').map((o) => o.trim()))}
                />
              )}
            />
          )}
          <Controller
            name="isRequired"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 3 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                  {' '}Required
                </label>
              </Box>
            )}
          />
          <Controller
            name="isVariantLevel"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 3 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                  {' '}Variant Level
                </label>
              </Box>
            )}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/attributes')} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Attribute'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
