import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { navConfig } from "../routes/paths";
import useAuth from "../hooks/useAuth";
import type { User } from "../types/auth";
import React from "react";

const drawerWidth = 300;

const hasPermission = (user: User | null, requiredPermission?: string) => {
  if (!requiredPermission) return true;
  if (!user || !user.role || !user.role.permissions) return false;
  return user.role.permissions.some((p) => p.name === requiredPermission);
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {navConfig.map(
          (item) =>
            hasPermission(user, item.permission) && (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={pathname.startsWith(item.path)}
                >
                  <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
