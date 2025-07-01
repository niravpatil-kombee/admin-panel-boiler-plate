import { useEffect, useState } from 'react';
import { Box, Chip, Paper } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getRolesAPI, deleteRoleAPI } from '../../services/role.api';
import ConfirmDialog from '../../components/ConfirmDialog';
import PageHeader from '../../components/PageHeader';
import type { Role } from '../../types/role';

export default function RoleListPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRolesAPI();
            console.log(data.roles);
            setRoles(data.roles);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleEdit = (id: string) => navigate(`/roles/edit/${id}`);
    const handleDelete = (id: string) => {
        setRoleToDelete(id);
        setConfirmOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (roleToDelete) {
            await deleteRoleAPI(roleToDelete);
            fetchRoles();
            setConfirmOpen(false);
            setRoleToDelete(null);
        }
    };

    const columns: GridColDef<Role>[] = [
        { field: 'name', headerName: 'Role Name', flex: 1 },
        {
            field: 'permissions',
            headerName: 'Permissions',
            flex: 2,
            renderCell: (params) =>
                params.value.map((p: any) => (
                    <Chip key={p._id} label={p.name} size="small" sx={{ mr: 0.5 }} />
                )),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEdit(id as string)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDelete(id as string)}
                />,
            ],
        },
    ];

    return (
        <Box>
            <PageHeader title="Role Management" buttonText="Add Role" buttonLink="/roles/new" />
            <Paper sx={{ height: 500, width: '100%', mt: 2 }}>
                <DataGrid
                    rows={roles}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Paper>
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Role"
                message="Are you sure you want to delete this role? This action cannot be undone."
            />
        </Box>
    );
}
