import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import type { Warehouse } from '../../types/product';
import { createWarehouseAPI, getWarehouseByIdAPI, updateWarehouseAPI } from '../../services/warehouse.api';

const defaultValues: Warehouse = {
  name: '',
  code: '',
  address: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  contactEmail: '',
  contactPhone: '',
  isActive: true,
  geoLocation: { lat: 0, lng: 0 },
};

export default function WarehouseForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const form = useForm<Warehouse>({ defaultValues });
  const {  handleSubmit, reset, formState: { isSubmitting, errors } } = form;

  useEffect(() => {
    if (isEdit && id) {
      getWarehouseByIdAPI(id).then(data => reset(data.warehouse));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: Warehouse) => {
    try {
      if (isEdit && id) {
        await updateWarehouseAPI(id, data);
      } else {
        await createWarehouseAPI(data);
      }
      navigate('/warehouses');
    } catch (err) {
      alert('Failed to save warehouse.');
      // Optionally log error
    }
  };

  return (
    <Box maxWidth={500} mx="auto" p={4} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" mb={2}>{isEdit ? 'Edit' : 'Create'} Warehouse</Typography>
      <Box display="flex" gap={2}>
        <TextField label="Name" fullWidth margin="normal" {...form.register('name', { required: true })} error={!!errors.name} helperText={errors.name && 'Name is required'} />
        <TextField label="Code" fullWidth margin="normal" {...form.register('code', { required: true })} error={!!errors.code} helperText={errors.code && 'Code is required'} />
      </Box>
      <Box display="flex" gap={2}>
        <TextField label="Country" fullWidth margin="normal" {...form.register('country')} />
        <TextField label="State" fullWidth margin="normal" {...form.register('state')} />
      </Box>
      <Box display="flex" gap={2}>
        <TextField label="City" fullWidth margin="normal" {...form.register('city')} />
        <TextField label="Postal Code" fullWidth margin="normal" {...form.register('postalCode')} />
      </Box>
      <Box display="flex" gap={2}>
        <TextField label="Contact Email" fullWidth margin="normal" {...form.register('contactEmail')} />
        <TextField label="Contact Phone" fullWidth margin="normal" {...form.register('contactPhone')} />
      </Box>
      <TextField label="Address" fullWidth margin="normal" {...form.register('address')} />
      <Box display="flex" gap={2}>
        <TextField label="Latitude" type="number" fullWidth margin="normal" {...form.register('geoLocation.lat', { valueAsNumber: true })} />
        <TextField label="Longitude" type="number" fullWidth margin="normal" {...form.register('geoLocation.lng', { valueAsNumber: true })} />
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
        {isEdit ? 'Update' : 'Create'} Warehouse
      </Button>
    </Box>
  );
} 