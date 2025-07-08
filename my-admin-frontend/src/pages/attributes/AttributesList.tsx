import { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getAttributesAPI, deleteAttributeAPI } from '../../services/attributes.api';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';
import type { Attribute } from '../../types/product';

export default function AttributeListPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const data = await getAttributesAPI();
      setAttributes(data.attributes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttributes(); }, []);

  const handleEdit = (id: string) => navigate(`/attributes/edit/${id}`);
  const handleDelete = (id: string) => { setAttributeToDelete(id); setConfirmOpen(true); };
  const handleConfirmDelete = async () => {
    if (attributeToDelete) {
      await deleteAttributeAPI(attributeToDelete);
      fetchAttributes();
      setConfirmOpen(false);
      setAttributeToDelete(null);
    }
  };

  const columns: GridColDef<Attribute>[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'slug', headerName: 'Slug', flex: 1 },
    { field: 'isVariantLevel', headerName: 'Variant Level', flex: 1, valueFormatter: ({ value }) => value ? 'Yes' : 'No' },
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
      <PageHeader title="Attribute Management" buttonText="Add Attribute" buttonLink="/attributes/new" />
      <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={attributes}
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
        title="Delete Attribute"
        message="Are you sure you want to delete this attribute? This action cannot be undone."
      />
    </Box>
  );
}
