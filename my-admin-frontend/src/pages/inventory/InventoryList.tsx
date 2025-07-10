import { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Inventory, Warehouse } from '../../types/product';
import { getInventoryListAPI, deleteInventoryAPI } from '../../services/inventory.api';
import { getWarehousesAPI } from '../../services/warehouse.api';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function InventoryList() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchInventories = async () => {
    setLoading(true);
    try {
      const data = await getInventoryListAPI();
      setInventories(Array.isArray(data.inventories) ? data.inventories : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    const data = await getWarehousesAPI();
    setWarehouses(Array.isArray(data.warehouses) ? data.warehouses : []);
  };

  useEffect(() => {
    fetchInventories();
    fetchWarehouses();
  }, []);

  const handleEdit = (id: string) => navigate(`/inventory/edit/${id}`);
  const handleDelete = (id: string) => { setInventoryToDelete(id); setConfirmOpen(true); };
  const handleConfirmDelete = async () => {
    if (inventoryToDelete) {
      await deleteInventoryAPI(inventoryToDelete);
      fetchInventories();
      setConfirmOpen(false);
      setInventoryToDelete(null);
    }
  };

  const warehouseMap = warehouses.reduce((acc, wh) => {
    if (wh._id) acc[wh._id] = wh.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Inventory</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/inventory/new')}>
          Add Inventory
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(inventories || []).map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell>{inv.sku}</TableCell>
                  <TableCell>{inv.quantity}</TableCell>
                  <TableCell>{
                    inv.warehouse && typeof inv.warehouse === 'object' && inv.warehouse !== null && (inv.warehouse as any).name
                      ? (inv.warehouse as any).name
                      : (warehouseMap[inv.warehouse as string] || inv.warehouse || '-')
                  }</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(inv._id!)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(inv._id!)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Inventory"
        message="Are you sure you want to delete this inventory? This action cannot be undone."
      />
    </Box>
  );
} 