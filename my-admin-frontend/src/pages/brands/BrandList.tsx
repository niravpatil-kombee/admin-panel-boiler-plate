import { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getBrandsAPI, deleteBrandAPI } from '../../services/brand.api';
import type { Brand } from '../../types/product';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';

export default function BrandListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrandsAPI();
      setBrands(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleEdit = (id: string) => navigate(`/brands/edit/${id}`);
  const handleDelete = (id: string) => { setBrandToDelete(id); setConfirmOpen(true); };
  const handleConfirmDelete = async () => {
    if (brandToDelete) {
      await deleteBrandAPI(brandToDelete);
      fetchBrands();
      setConfirmOpen(false);
      setBrandToDelete(null);
    }
  };

  const columns: GridColDef<Brand>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(id as string)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(id as string)} />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader title="Brand Management" buttonText="Add Brand" buttonLink="/brands/new" />
      <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={brands}
          columns={columns}
          getRowId={(row) => row._id!}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
        />
      </Paper>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </Box>
  );
}
