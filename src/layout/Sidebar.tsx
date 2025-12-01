import { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Divider,
    Typography,
    Avatar,
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import AutorenewIcon from "@mui/icons-material/Autorenew";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link, useLocation } from "react-router-dom";

interface Props {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: Props) {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (menuKey: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    const isActive = (path: string) => location.pathname === path;

    const MenuItem = ({
        text,
        icon,
        path,
        children,
        menuKey
    }: {
        text: string;
        icon: React.ReactNode;
        path?: string;
        children?: Array<{ text: string; path: string; icon?: React.ReactNode }>;
        menuKey?: string;
    }) => {
        const hasChildren = children && children.length > 0;
        const isExpanded = menuKey ? expandedMenus[menuKey] : false;
        const active = path ? isActive(path) : false;

        const ItemContent = (
            <ListItemButton
                onClick={() => {
                    if (hasChildren && menuKey) {
                        toggleMenu(menuKey);
                    }
                }}
                component={!hasChildren && path ? Link : 'div'}
                to={!hasChildren && path ? path : undefined}
                sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    mx: 1,
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? 'white' : 'grey.300',
                    '&:hover': {
                        bgcolor: active ? 'primary.dark' : 'rgba(255,255,255,0.08)',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 40,
                        color: active ? 'white' : 'grey.400',
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: active ? 600 : 500,
                    }}
                />
                {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
        );

        return (
            <ListItem disablePadding sx={{ display: 'block' }}>
                {ItemContent}
                {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 2 }}>
                            {children.map((child, index) => (
                                <ListItemButton
                                    key={index}
                                    component={Link}
                                    to={child.path}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                        py: 1,
                                        bgcolor: isActive(child.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: isActive(child.path) ? 'primary.light' : 'grey.400',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            color: 'primary.light',
                                        },
                                    }}
                                >
                                    {child.icon && (
                                        <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                            {child.icon}
                                        </ListItemIcon>
                                    )}
                                    <ListItemText
                                        primary={child.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.85rem',
                                            fontWeight: isActive(child.path) ? 600 : 400,
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                )}
            </ListItem>
        );
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: 260,
                bgcolor: '#1a1a2e',
                color: 'white',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                            Admin Panel
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'grey.400', fontSize: '0.75rem' }}>
                            Quản trị thư viện
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Admin Info */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        fontWeight: 600,
                    }}
                >
                    TN
                </Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        Thanh Như
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.400' }}>
                        Quản trị viên
                    </Typography>
                </Box>
            </Box>

            {/* Menu Items */}
            <Box
                sx={{
                    flex: 1,
                    py: 2,
                    overflowY: 'auto',
                    // Ẩn scrollbar nhưng vẫn cuộn được
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    msOverflowStyle: 'none',  // IE and Edge
                    scrollbarWidth: 'none',  // Firefox
                }}
            >
                <List sx={{ px: 0 }}>
                    {/* Dashboard */}
                    <MenuItem
                        text="Dashboard"
                        icon={<DashboardIcon />}
                        path="/"
                    />

                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Books */}
                    <MenuItem
                        text="Quản lý sách"
                        icon={<MenuBookIcon />}
                        menuKey="books"
                        children={[
                            { text: 'Loại sách', path: '/admin/bookcategory', icon: <CategoryIcon fontSize="small" /> },
                            { text: 'Số tập', path: '/admin/bookchapter', icon: <EditNoteIcon fontSize="small" /> },
                            { text: 'Quản lý cuốn sách', path: '/admin/borrow-manage', icon: <LocalLibraryIcon fontSize="small" /> },
                        ]}
                    />

                    {/* Books Online */}
                    <MenuItem
                        text="Sách online"
                        icon={<CloudUploadIcon />}
                        menuKey="booksonline"
                        children={[
                            { text: 'Tải sách', path: '/admin/bookonline' },
                        ]}
                    />

                    {/* Authors */}
                    <MenuItem
                        text="Tác giả"
                        icon={<PeopleIcon />}
                        path="/admin/author"
                    />

                    {/* Publishers */}
                    <MenuItem
                        text="Nhà xuất bản"
                        icon={<PeopleIcon />}
                        path="/admin/publisher"
                    />

                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Status Management */}
                    <MenuItem
                        text="Quản lý trạng thái"
                        icon={<AutorenewIcon />}
                        menuKey="status"
                        children={[
                            { text: 'Nhập sách', path: '/admin/bookimport' },
                            { text: 'Xuất sách', path: '/admin/bookexport' },
                            { text: 'Mượn - Trả', path: '/admin/borrow-manage' },
                            { text: 'Đặt trước', path: '/admin/bookreserve' },
                        ]}
                    />

                    {/* Warehouse */}
                    <MenuItem
                        text="Kho sách"
                        icon={<WarehouseIcon />}
                        menuKey="warehouse"
                        children={[
                            { text: 'Tầng', path: '/admin/warehouse/floor', icon: <LocationOnIcon fontSize="small" /> },
                            { text: 'Phòng', path: '/admin/warehouse/room', icon: <LocationOnIcon fontSize="small" /> },
                            { text: 'Tủ sách', path: '/admin/warehouse/bookshelf', icon: <LocationOnIcon fontSize="small" /> },
                            { text: 'Kệ sách', path: '/admin/warehouse/shelf', icon: <LocationOnIcon fontSize="small" /> },
                            { text: 'Ô sách', path: '/admin/warehouse/shelfsection', icon: <LocationOnIcon fontSize="small" /> },
                        ]}
                    />

                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Users */}
                    <MenuItem
                        text="Người dùng"
                        icon={<PeopleIcon />}
                        path="/admin/manageusers"
                    />

                    {/* History */}
                    <MenuItem
                        text="Lịch sử"
                        icon={<HistoryIcon />}
                        menuKey="history"
                        children={[
                            { text: 'Lịch sử nhập sách', path: '/admin/importtransaction' },
                            { text: 'Lịch sử xuất sách', path: '/admin/bookexporthistory' },
                        ]}
                    />

                    <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

                    {/* Settings */}
                    <MenuItem
                        text="Cài đặt"
                        icon={<SettingsIcon />}
                        path="/settings"
                    />
                </List>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    p: 2,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    bgcolor: 'rgba(0,0,0,0.2)',
                }}
            >
                <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', textAlign: 'center' }}>
                    © 2024 Thư viện điện tử
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.600', display: 'block', textAlign: 'center', fontSize: '0.7rem' }}>
                    Version 1.0.0
                </Typography>
            </Box>
        </Box>
    );
}