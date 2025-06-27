import { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getCollectionsAPI, deleteCollectionAPI } from '../../services/collection.api';
import type { Collection } from '../../types/product';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';

export default function CollectionListPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await getCollectionsAPI();
      setCollections(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleEdit = (id: string) => navigate(`/collections/edit/${id}`);
  const handleDelete = (id: string) => {
    setCollectionToDelete(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (collectionToDelete) {
      await deleteCollectionAPI(collectionToDelete);
      fetchCollections();
      setConfirmOpen(false);
      setCollectionToDelete(null);
    }
  };

  const columns: GridColDef<Collection>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
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
      <PageHeader title="Collection Management" buttonText="Add Collection" buttonLink="/collections/new" />
      <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={collections}
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
        title="Delete Collection"
        message="Are you sure you want to delete this collection? This action cannot be undone."
      />
    </Box>
  );
}
