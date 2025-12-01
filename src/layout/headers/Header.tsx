import { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    Avatar,
    Typography,
    Box,
    Menu,
    MenuItem,
    Button,
    TextField,
    Chip,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
    onHandleSideBar: () => void;
}

interface ChatMessage {
    id: number;
    senderName: string;
    userId: number;
    message: string;
    timestamp: string;
    from: 'user' | 'admin';
    seen?: boolean;
    avatarUrl?: string;
}

interface Notification {
    id: number;
    message: string;
    isRead: boolean;
    timestamp: string;
    type: 'borrow' | 'message' | 'return' | 'system';
}

const Header = ({ onHandleSideBar }: Props) => {
    const navigate = useNavigate();
    const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
    const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
    const [openChat, setOpenChat] = useState(false);
    const [chatHistory, setChatHistory] = useState<Record<number, ChatMessage[]>>({});
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [adminReply, setAdminReply] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            message: "Người dùng A vừa mượn sách",
            isRead: false,
            timestamp: new Date().toISOString(),
            type: 'borrow'
        },
        {
            id: 2,
            message: "Tin nhắn mới từ user B",
            isRead: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            type: 'message'
        },
    ]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const unreadChatCount = Object.values(chatHistory).flat().filter(msg => msg.from === 'user' && !msg.seen).length;

    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorNotif(event.currentTarget);
    };

    const handleNotifClose = () => setAnchorNotif(null);

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const handleUserClick = (e: React.MouseEvent<HTMLElement>) => setAnchorUser(e.currentTarget);
    const handleUserClose = () => setAnchorUser(null);

    const handleLogout = () => {
        Cookies.remove("jwtToken");
        navigate("/login");
    };

    const handleAdminReply = () => {
        if (!selectedUserId || !adminReply.trim()) return;

        const newMsg: ChatMessage = {
            id: Date.now(),
            senderName: "Admin",
            userId: selectedUserId,
            message: adminReply,
            timestamp: new Date().toISOString(),
            from: "admin",
        };

        setChatHistory((prev) => ({
            ...prev,
            [selectedUserId]: [...(prev[selectedUserId] || []), newMsg],
        }));

        setAdminReply('');
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'borrow': return '📚';
            case 'message': return '💬';
            case 'return': return '✅';
            case 'system': return '⚙️';
            default: return '📢';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // Giả lập dữ liệu người dùng khi mở hộp chat
    useEffect(() => {
        if (openChat) {
            setChatHistory({
                101: [
                    {
                        id: 1,
                        senderName: "Nguyễn Văn A",
                        userId: 101,
                        message: "Admin ơi em không đăng nhập được 😢",
                        timestamp: new Date().toISOString(),
                        from: "user",
                        seen: false,
                        avatarUrl: "https://i.pravatar.cc/150?img=5"
                    },
                ],
                102: [
                    {
                        id: 2,
                        senderName: "Trần Thị B",
                        userId: 102,
                        message: "Em mượn sách AI rồi khi nào được duyệt ạ?",
                        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                        from: "user",
                        seen: false,
                        avatarUrl: "https://i.pravatar.cc/150?img=12"
                    },
                ],
            });

            setSelectedUserId(101);
        }
    }, [openChat]);

    // Khi chọn user thì đánh dấu đã xem
    useEffect(() => {
        if (selectedUserId !== null) {
            setChatHistory((prev) => {
                const updated = { ...prev };
                if (updated[selectedUserId]) {
                    updated[selectedUserId] = updated[selectedUserId].map((msg) =>
                        msg.from === "user" ? { ...msg, seen: true } : msg
                    );
                }
                return updated;
            });
        }
    }, [selectedUserId]);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={2}
                sx={{
                    bgcolor: 'white',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
                    {/* Left Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={onHandleSideBar}
                            sx={{
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AdminPanelSettingsIcon
                                sx={{ fontSize: 32, color: 'primary.main' }}
                            />
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.25rem',
                                        lineHeight: 1.2
                                    }}
                                >
                                    Quản trị viên
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                                >
                                    Hệ thống thư viện điện tử
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* Notifications */}
                        <IconButton
                            onClick={handleNotifClick}
                            sx={{
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <Badge
                                badgeContent={unreadCount}
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontSize: '0.65rem',
                                        minWidth: 18,
                                        height: 18
                                    }
                                }}
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        {/* Chat */}
                        <IconButton
                            onClick={() => setOpenChat(true)}
                            sx={{
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <Badge
                                badgeContent={unreadChatCount}
                                color="primary"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        fontSize: '0.65rem',
                                        minWidth: 18,
                                        height: 18
                                    }
                                }}
                            >
                                <ChatBubbleIcon />
                            </Badge>
                        </IconButton>

                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                        {/* User Profile */}
                        <Box
                            onClick={handleUserClick}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: 'primary.main',
                                    fontWeight: 600
                                }}
                            >
                                TN
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                                >
                                    Thanh Như
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Quản trị viên
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Notifications Menu */}
            <Menu
                anchorEl={anchorNotif}
                open={Boolean(anchorNotif)}
                onClose={handleNotifClose}
                PaperProps={{
                    sx: {
                        width: 380,
                        maxHeight: 500,
                        mt: 1,
                        boxShadow: 3
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        Thông báo
                    </Typography>
                    {unreadCount > 0 && (
                        <Chip
                            label={`${unreadCount} chưa đọc`}
                            size="small"
                            color="error"
                            sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                        />
                    )}
                </Box>

                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={() => handleMarkAsRead(notif.id)}
                            sx={{
                                py: 1.5,
                                px: 2,
                                borderBottom: 1,
                                borderColor: 'divider',
                                bgcolor: notif.isRead ? 'transparent' : 'action.hover',
                                '&:hover': {
                                    bgcolor: 'action.selected'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                                <Box
                                    sx={{
                                        fontSize: '1.5rem',
                                        lineHeight: 1,
                                        mt: 0.5
                                    }}
                                >
                                    {getNotificationIcon(notif.type)}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: notif.isRead ? 400 : 600,
                                            mb: 0.5
                                        }}
                                    >
                                        {notif.message}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {formatTimestamp(notif.timestamp)}
                                    </Typography>
                                </Box>
                                {!notif.isRead && (
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            mt: 1
                                        }}
                                    />
                                )}
                            </Box>
                        </MenuItem>
                    ))
                ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Không có thông báo nào
                        </Typography>
                    </Box>
                )}

                <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                    <Button size="small" sx={{ textTransform: 'none' }}>
                        Xem tất cả thông báo
                    </Button>
                </Box>
            </Menu>

            {/* User Menu */}
            <Menu
                anchorEl={anchorUser}
                open={Boolean(anchorUser)}
                onClose={handleUserClose}
                PaperProps={{
                    sx: { width: 220, mt: 1 }
                }}
            >
                <MenuItem onClick={handleUserClose}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Thông tin cá nhân</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleUserClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cài đặt</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>Đăng xuất</ListItemText>
                </MenuItem>
            </Menu>

            {/* Chat Dialog */}
            <Dialog
                open={openChat}
                onClose={() => setOpenChat(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 2,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ChatBubbleIcon />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Tin nhắn từ người dùng
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setOpenChat(false)}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, height: 600 }}>
                    <Box sx={{ display: 'flex', height: '100%' }}>
                        {/* Sidebar user list */}
                        <Box
                            sx={{
                                width: '35%',
                                borderRight: 1,
                                borderColor: 'divider',
                                bgcolor: 'grey.50',
                                overflowY: 'auto'
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    bgcolor: 'white'
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Danh sách cuộc trò chuyện
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5 }}>
                                {Object.entries(chatHistory).map(([userId, messages]) => {
                                    const lastMsg = messages[messages.length - 1];
                                    const hasUnread = messages.some(msg => msg.from === 'user' && !msg.seen);

                                    return (
                                        <Box
                                            key={userId}
                                            onClick={() => setSelectedUserId(Number(userId))}
                                            sx={{
                                                p: 1.5,
                                                mb: 1,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                bgcolor: Number(userId) === selectedUserId
                                                    ? 'primary.light'
                                                    : 'white',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: Number(userId) === selectedUserId
                                                        ? 'primary.light'
                                                        : 'grey.100'
                                                }
                                            }}
                                        >
                                            <Box sx={{ position: 'relative' }}>
                                                <Avatar
                                                    src={lastMsg.avatarUrl}
                                                    sx={{ width: 44, height: 44 }}
                                                />
                                                {hasUnread && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            bgcolor: 'error.main',
                                                            border: '2px solid white'
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 0.3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {lastMsg.senderName}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        display: 'block'
                                                    }}
                                                >
                                                    {lastMsg.message}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>

                        {/* Chat content */}
                        <Box
                            sx={{
                                width: '65%',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: 'white'
                            }}
                        >
                            {selectedUserId ? (
                                <>
                                    {/* Chat header */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        <Avatar
                                            src={chatHistory[selectedUserId]?.[0]?.avatarUrl}
                                            sx={{ width: 36, height: 36 }}
                                        />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {chatHistory[selectedUserId]?.[0]?.senderName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Đang hoạt động
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Messages */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            overflowY: 'auto',
                                            p: 2.5,
                                            bgcolor: 'grey.50',
                                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8))'
                                        }}
                                    >
                                        {chatHistory[selectedUserId]?.map((msg, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: msg.from === 'admin' ? 'flex-end' : 'flex-start',
                                                    mb: 1.5
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        maxWidth: '70%',
                                                        px: 2,
                                                        py: 1.2,
                                                        borderRadius: 2,
                                                        bgcolor: msg.from === 'admin'
                                                            ? 'primary.main'
                                                            : 'white',
                                                        color: msg.from === 'admin'
                                                            ? 'white'
                                                            : 'text.primary',
                                                        boxShadow: 1
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {msg.message}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: 'block',
                                                            mt: 0.5,
                                                            opacity: 0.8,
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Input */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderTop: 1,
                                            borderColor: 'divider',
                                            bgcolor: 'white',
                                            display: 'flex',
                                            gap: 1.5
                                        }}
                                    >
                                        <TextField
                                            value={adminReply}
                                            onChange={(e) => setAdminReply(e.target.value)}
                                            fullWidth
                                            size="small"
                                            placeholder="Nhập tin nhắn..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAdminReply();
                                                }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleAdminReply}
                                            disabled={!adminReply.trim()}
                                            endIcon={<SendIcon />}
                                            sx={{
                                                borderRadius: 3,
                                                px: 3,
                                                textTransform: 'none'
                                            }}
                                        >
                                            Gửi
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    <MarkChatReadIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                                    <Typography variant="body1" color="text.secondary">
                                        Chọn một cuộc trò chuyện để bắt đầu
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Header;