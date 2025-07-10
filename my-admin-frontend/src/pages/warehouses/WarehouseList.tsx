import { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Warehouse } from '../../types/product';
import { getWarehousesAPI, deleteWarehouseAPI } from '../../services/warehouse.api';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function WarehouseList() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const data = await getWarehousesAPI();
      setWarehouses(data.warehouses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWarehouses(); }, []);

  const handleEdit = (id: string) => navigate(`/warehouses/edit/${id}`);
  const handleDelete = (id: string) => { setWarehouseToDelete(id); setConfirmOpen(true); };
  const handleConfirmDelete = async () => {
    if (warehouseToDelete) {
      await deleteWarehouseAPI(warehouseToDelete);
      fetchWarehouses();
      setConfirmOpen(false);
      setWarehouseToDelete(null);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Warehouses</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/warehouses/new')}>
          Add Warehouse
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
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouses.map((wh) => (
                <TableRow key={wh._id}>
                  <TableCell>{wh.name}</TableCell>
                  <TableCell>{wh.code}</TableCell>
                  <TableCell>{wh.country}</TableCell>
                  <TableCell>{wh.city}</TableCell>
                  <TableCell>{wh.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(wh._id!)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(wh._id!)}>
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
        title="Delete Warehouse"
        message="Are you sure you want to delete this warehouse? This action cannot be undone."
      />
    </Box>
  );
} 