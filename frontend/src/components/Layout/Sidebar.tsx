import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    alpha,
    Tooltip
} from '@mui/material';
import {
    CalendarToday,
    CheckCircle,
    ShoppingCart,
    AttachMoney,
    Psychology,
    Home,
    LocationOn,
    Videocam,
    LibraryBooks,
    Analytics,
    Brush,
    Security,
    Public,
    SmartToy,
    Audiotrack,
    Code,
    MenuBook,
    ChevronRight
} from '@mui/icons-material';

interface SidebarProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
}

const sections = [
    {
        title: 'Management',
        items: [
            { label: 'Calendar', icon: <CalendarToday />, index: 0 },
            { label: 'Todos', icon: <CheckCircle />, index: 1 },
            { label: 'Shopping', icon: <ShoppingCart />, index: 2 },
            { label: 'Expenses', icon: <AttachMoney />, index: 3 },
            { label: 'Journal', icon: <MenuBook />, index: 6 },
        ]
    },
    {
        title: 'Intelligence',
        items: [
            { label: 'LLM Manager', icon: <Psychology />, index: 7 },
            { label: 'AI Chat', icon: <SmartToy />, index: 8 },
            { label: 'Robotics', icon: <SmartToy />, index: 15 },
        ]
    },
    {
        title: 'Media Hub',
        items: [
            { label: 'Home Control', icon: <Home />, index: 4 },
            { label: 'Library', icon: <Videocam />, index: 5 },
            { label: 'Audio Prod', icon: <Audiotrack />, index: 16 },
        ]
    },
    {
        title: 'Exploration',
        items: [
            { label: 'Vienna', icon: <LocationOn />, index: 9 },
            { label: 'Virtual Worlds', icon: <Public />, index: 14 },
        ]
    },
    {
        title: 'Engineering',
        items: [
            { label: 'Knowledge', icon: <LibraryBooks />, index: 10 },
            { label: 'Analytics', icon: <Analytics />, index: 11 },
            { label: 'Studio', icon: <Brush />, index: 12 },
            { label: 'Security', icon: <Security />, index: 13 },
            { label: 'Technical', icon: <Code />, index: 17 },
        ]
    }
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <Box sx={{
            width: 280,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bgcolor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowY: 'auto',
            zIndex: 1200,
            display: { xs: 'none', md: 'block' },
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '10px' }
        }}>
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="primary" sx={{
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <Box component="span" sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                    }}>V</Box>
                    VIENNA LIVE
                </Typography>
            </Box>

            <Box sx={{ px: 2, pb: 4 }}>
                {sections.map((section) => (
                    <Box key={section.title} sx={{ mt: 3 }}>
                        <Typography variant="caption" sx={{
                            px: 2,
                            color: 'text.secondary',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1.5
                        }}>
                            {section.title}
                        </Typography>
                        <List sx={{ mt: 1 }}>
                            {section.items.map((item) => (
                                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton
                                        onClick={() => setActiveTab(item.index)}
                                        selected={activeTab === item.index}
                                        sx={{
                                            borderRadius: '12px',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&.Mui-selected': {
                                                bgcolor: alpha('#6366f1', 0.1),
                                                color: 'primary.main',
                                                '& .MuiListItemIcon-root': { color: 'primary.main' },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    right: 8,
                                                    width: 4,
                                                    height: 20,
                                                    borderRadius: 2,
                                                    bgcolor: 'primary.main'
                                                }
                                            },
                                            '&:hover': {
                                                bgcolor: alpha('#6366f1', 0.05),
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            minWidth: 40,
                                            color: activeTab === item.index ? 'primary.main' : 'text.secondary',
                                            transition: 'color 0.2s'
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.875rem',
                                                fontWeight: activeTab === item.index ? 700 : 500
                                            }}
                                        />
                                        {activeTab === item.index && <ChevronRight sx={{ fontSize: 16, opacity: 0.5 }} />}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
