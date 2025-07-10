import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Inventory, Warehouse } from '../../types/product';
import { createInventoryAPI, getInventoryByIdAPI, updateInventoryAPI } from '../../services/inventory.api';
import { getWarehousesAPI } from '../../services/warehouse.api';

const defaultValues: Inventory = {
  sku: '',
  quantity: 0,
  allowBackorder: false,
  lowStockThreshold: 0,
  warehouse: '',
};

export default function InventoryForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const form = useForm<Inventory>({ defaultValues });
  const { handleSubmit, reset, formState: { isSubmitting, errors }, register } = form;
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    getWarehousesAPI().then(data => setWarehouses(data.warehouses));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      getInventoryByIdAPI(id).then(data => reset(data.inventory));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: Inventory) => {
    try {
      if (isEdit && id) {
        await updateInventoryAPI(id, data);
      } else {
        await createInventoryAPI(data);
      }
      navigate('/inventory');
    } catch (err) {
      alert('Failed to save inventory.');
    }
  };

  return (
    <Box maxWidth={500} mx="auto" p={4} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" mb={2}>{isEdit ? 'Edit' : 'Create'} Inventory</Typography>
      <TextField label="SKU" fullWidth margin="normal" {...register('sku', { required: true })} error={!!errors.sku} helperText={errors.sku && 'SKU is required'} />
      <TextField label="Quantity" type="number" fullWidth margin="normal" {...register('quantity', { valueAsNumber: true, required: true })} error={!!errors.quantity} helperText={errors.quantity && 'Quantity is required'} />
      <TextField label="Low Stock Threshold" type="number" fullWidth margin="normal" {...register('lowStockThreshold', { valueAsNumber: true })} />
      <TextField
        label="Warehouse"
        select
        fullWidth
        margin="normal"
        {...register('warehouse', { required: true })}
        error={!!errors.warehouse}
        helperText={errors.warehouse && 'Warehouse is required'}
        value={form.watch('warehouse') ?? ''}
      >
        <MenuItem value="" disabled>Select a warehouse</MenuItem>
        {warehouses.map((wh) => (
          <MenuItem key={wh._id ?? ''} value={wh._id ?? ''}>{wh.name}</MenuItem>
        ))}
      </TextField>
      <Box mt={2} mb={2}>
        <label>
          <input type="checkbox" {...register('allowBackorder')} /> Allow Backorder
        </label>
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting} sx={{ mt: 2 }}>
        {isEdit ? 'Update' : 'Create'} Inventory
      </Button>
    </Box>
  );
} 