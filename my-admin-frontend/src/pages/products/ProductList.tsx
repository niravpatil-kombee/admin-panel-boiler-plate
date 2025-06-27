import { useEffect, useState } from 'react';
import { Box, Paper} from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, deleteProductAPI } from '../../services/product.api';
import type { Product } from '../../types/product';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsAPI();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => navigate(`/products/edit/${id}`);
  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProductAPI(productToDelete);
      fetchProducts();
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const columns: GridColDef<Product>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'image',
      headerName: 'Image',
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img src={`/uploads/products/${params.value}`} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        ) : null,
    },
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
      <PageHeader title="Product Management" buttonText="Add Product" buttonLink="/products/new" />
      <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={products}
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </Box>
  );
}
