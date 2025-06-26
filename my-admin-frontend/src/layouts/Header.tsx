import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// This width must match the width of the Sidebar for the layout to work correctly.
const drawerWidth = 240;

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        // You can navigate to a profile page here if you create one
        // navigate('/profile'); 
        console.log("Navigate to profile page");
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                // On screens larger than 'sm', calculate width to not overlap the sidebar
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                // On screens larger than 'sm', add a left margin equal to the sidebar's width
                ml: { sm: `${drawerWidth}px` },
                // Styling for a modern, clean look
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar>
                {/* This Typography component acts as a flexible spacer */}
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    {/* You could dynamically set the page title here */}
                </Typography>

                {/* This section is only rendered if a user is logged in */}
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1.5, display: { xs: 'none', sm: 'block' } }}>
                            {user.name}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}