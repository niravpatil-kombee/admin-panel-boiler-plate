import { useEffect, useState } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import type { User } from '../../types/auth';
import { getUsersAPI, deleteUserAPI } from '../../services/auth.api';

export default function UserListPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const fetchedUsers = await getUsersAPI();
            setUsers(fetchedUsers.users);
        } catch (error) {
            enqueueSnackbar('Failed to fetch users', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (id: string) => {
        setUserToDelete(id);
        setConfirmOpen(true);
    };

    const handleEditClick = (id: string) => {
        navigate(`/users/edit/${id}`);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUserAPI(userToDelete);
                enqueueSnackbar('User deleted successfully', { variant: 'success' });
                fetchUsers();
            } catch (error) {
                enqueueSnackbar('Failed to delete user', { variant: 'error' });
            } finally {
                setConfirmOpen(false);
                setUserToDelete(null);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1.5 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: (params) => (
                <Chip label={params.row.role.name} color="primary" variant="outlined" />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<Tooltip title="Edit"><EditIcon /></Tooltip>}
                    label="Edit"
                    onClick={() => handleEditClick(id as string)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="Delete"><DeleteIcon /></Tooltip>}
                    label="Delete"
                    onClick={() => handleDeleteClick(id as string)}
                    color="inherit"
                />,
            ],
        },
    ];

    return (
        <Box>
            <PageHeader
                title="User Management"
                buttonText="Add User"
                buttonLink="/users/new"
            />
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                />
            </Box>
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
            />
        </Box>
    );
}
