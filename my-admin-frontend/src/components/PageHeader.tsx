import { Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
    title: string;
    buttonText: string;
    buttonLink: string;
}

export default function PageHeader({ title, buttonText, buttonLink }: PageHeaderProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
                {title}
            </Typography>
            <Button
                component={RouterLink}
                to={buttonLink}
                variant="contained"
                startIcon={<AddIcon />}
            >
                {buttonText}
            </Button>
        </Box>
    );
}
