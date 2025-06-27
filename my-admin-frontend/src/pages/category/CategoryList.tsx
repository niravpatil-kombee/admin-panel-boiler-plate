import { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getCategoriesAPI, deleteCategoryAPI } from '../../services/category.api';
import type { Category } from '../../types/product';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoriesAPI();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id: string) => navigate(`/categories/edit/${id}`);
  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategoryAPI(categoryToDelete);
      fetchCategories();
      setConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const columns: GridColDef<Category>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(id as string)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(id as string)} />,
      ],
    },
  ];

  return (
    <Box>
      <PageHeader title="Category Management" buttonText="Add Category" buttonLink="/categories/new" />
      <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={categories}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </Box>
  );
}
