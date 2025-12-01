import {
    AppBar,
    Toolbar,
    Container,
    Badge,
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    Typography,
    Box,
    Button,
    TextField,
    Avatar,
    Divider,
    ListItemIcon,
    ListItemText,
    Chip,
    Dialog,
    DialogContent,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useNavigate } from 'react-router-dom';
import { Authetication, NotificationToUser } from '../../apis';
import type { NotificationToUserResponse } from '../../response/NotificationToUserResponse';

dayjs.extend(relativeTime);
dayjs.locale('vi');

type Message = {
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
};

export default function HeaderUser() {
    const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
    const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
    const [notificationApi, setNotificationApi] = useState<NotificationToUserResponse[]>([]);
    const navigate = useNavigate();

    // Chat state
    const [openChat, setOpenChat] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadChat, setUnreadChat] = useState(2);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await NotificationToUser.getAllNotifications();
            setNotificationApi(response.data);
        } catch (error) {
            console.log("Lỗi khi lấy thông báo: " + error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadNotifCount = notificationApi.filter(item => !item.isRead).length;

    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorNotif(event.currentTarget);
        fetchNotifications();
    };

    const onClickReadNotification = (id: string) => {
        setNotificationApi(prev =>
            prev.map(n => n.notiId === id ? { ...n, isRead: true } : n)
        );
        NotificationToUser.readNotification(id)
            .catch(err => console.log("Lỗi API:", err));
        setAnchorNotif(null);
        navigate(`/user/borrowingstatus`, { replace: true });
    };

    // Chat functions
    const toggleChat = () => {
        setOpenChat(!openChat);
        if (!openChat) {
            setUnreadChat(0);
        }
    };

    const sendMessage = () => {
        if (message.trim()) {
            const userMsg: Message = {
                sender: 'user',
                text: message,
                timestamp: new Date().toISOString()
            };
            setMessages((prev) => [...prev, userMsg]);
            setMessage('');

            // Simulate admin response
            setTimeout(() => {
                const reply: Message = {
                    sender: 'admin',
                    text: 'Admin đã nhận được tin nhắn của bạn. Chúng tôi sẽ phản hồi sớm nhất có thể.',
                    timestamp: new Date().toISOString()
                };
                setMessages((prev) => [...prev, reply]);
            }, 1000);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Navigation handlers
    const onHandleBtnMyBookList = () => navigate('/user/mybooklist');
    const onHandleBtnBorrowingStatus = () => navigate('/user/borrowingstatus');
    const onHandleBtnHomeRoundedIcon = () => navigate('/user/books');
    const onHandleBtnLogout = () => {
        Authetication.logout();
        navigate('/login');
    };

    const getNotificationIcon = (title: string) => {
        if (title.includes('mượn') || title.includes('borrow')) return '📚';
        if (title.includes('trả') || title.includes('return')) return '✅';
        if (title.includes('từ chối') || title.includes('reject')) return '❌';
        if (title.includes('chấp nhận') || title.includes('approve')) return '✔️';
        return '📢';
    };

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
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: { xs: 64, sm: 70 },
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* Logo & Brand */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.8 },
                                transition: 'opacity 0.2s'
                            }}
                            onClick={onHandleBtnHomeRoundedIcon}
                        >
                            <MenuBookIcon
                                sx={{
                                    fontSize: 32,
                                    color: 'primary.main'
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                        lineHeight: 1.2
                                    }}
                                >
                                    Thư viện điện tử
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.75rem',
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    Tri thức không giới hạn
                                </Typography>
                            </Box>
                        </Box>

                        {/* Navigation Icons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                            <Tooltip title="Trang chủ" arrow>
                                <IconButton
                                    onClick={onHandleBtnHomeRoundedIcon}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <HomeRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Sách của tôi" arrow>
                                <IconButton
                                    onClick={onHandleBtnMyBookList}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <LibraryBooksRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Trạng thái phiếu mượn" arrow>
                                <IconButton
                                    onClick={onHandleBtnBorrowingStatus}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <AssignmentRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            <Divider orientation="vertical" flexItem sx={{ mx: { xs: 0.5, sm: 1 } }} />

                            <Tooltip title="Thông báo" arrow>
                                <IconButton
                                    onClick={handleNotifClick}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <Badge
                                        badgeContent={unreadNotifCount}
                                        color="error"
                                        max={99}
                                    >
                                        <NotificationsRoundedIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Tin nhắn" arrow>
                                <IconButton
                                    onClick={toggleChat}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <Badge
                                        badgeContent={unreadChat}
                                        color="primary"
                                        max={99}
                                    >
                                        <ChatIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Divider orientation="vertical" flexItem sx={{ mx: { xs: 0.5, sm: 1 } }} />

                            <Tooltip title="Tài khoản" arrow>
                                <IconButton
                                    onClick={(e) => setAnchorUser(e.currentTarget)}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <AccountCircleRoundedIcon sx={{ fontSize: 28 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Notifications Menu */}
            <Menu
                anchorEl={anchorNotif}
                open={Boolean(anchorNotif)}
                onClose={() => setAnchorNotif(null)}
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
                    {unreadNotifCount > 0 && (
                        <Chip
                            label={`${unreadNotifCount} chưa đọc`}
                            size="small"
                            color="error"
                            sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                        />
                    )}
                </Box>

                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {notificationApi.length > 0 ? (
                        notificationApi
                            .sort((a, b) => dayjs(b.sendTime).valueOf() - dayjs(a.sendTime).valueOf())
                            .map((notif) => (
                                <MenuItem
                                    key={notif.notiId}
                                    onClick={() => onClickReadNotification(notif.notiId)}
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
                                        <Box sx={{ fontSize: '1.3rem', lineHeight: 1, mt: 0.5 }}>
                                            {getNotificationIcon(notif.title)}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: notif.isRead ? 400 : 600,
                                                    mb: 0.3
                                                }}
                                            >
                                                {notif.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'text.secondary',
                                                    display: 'block',
                                                    mb: 0.5
                                                }}
                                            >
                                                {notif.message}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: 'text.disabled', fontSize: '0.7rem' }}
                                            >
                                                {dayjs(notif.sendTime).format('DD/MM/YYYY HH:mm')} •{' '}
                                                {dayjs(notif.sendTime).fromNow()}
                                            </Typography>
                                        </Box>
                                        {notif.isRead ? (
                                            <DoneRoundedIcon
                                                fontSize="small"
                                                sx={{ color: 'success.main', mt: 0.5 }}
                                            />
                                        ) : (
                                            <FiberManualRecordRoundedIcon
                                                fontSize="small"
                                                sx={{ color: 'primary.main', mt: 0.5 }}
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
                </Box>

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
                onClose={() => setAnchorUser(null)}
                PaperProps={{
                    sx: { width: 220, mt: 1 }
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Tài khoản của tôi
                    </Typography>
                </Box>

                <MenuItem onClick={() => setAnchorUser(null)}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Thông tin cá nhân</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setAnchorUser(null)}>
                    <ListItemIcon>
                        <LockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Đổi mật khẩu</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={onHandleBtnLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>Đăng xuất</ListItemText>
                </MenuItem>
            </Menu>

            {/* Chat Dialog */}
            <Dialog
                open={openChat}
                onClose={toggleChat}
                PaperProps={{
                    sx: {
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        m: 0,
                        width: 360,
                        maxWidth: '90vw',
                        height: 500,
                        maxHeight: '80vh',
                        borderRadius: 3,
                        boxShadow: 6
                    }
                }}
            >
                {/* Chat Header */}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChatIcon />
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                            Chat với Admin
                        </Typography>
                    </Box>
                    <IconButton onClick={toggleChat} size="small" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Messages */}
                <DialogContent
                    sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        flex: 1,
                        overflowY: 'auto',
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8))'
                    }}
                >
                    {messages.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: 1
                            }}
                        >
                            <ChatIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                            <Typography variant="body2" color="text.secondary" align="center">
                                Chưa có tin nhắn nào.<br />
                                Hãy bắt đầu cuộc trò chuyện!
                            </Typography>
                        </Box>
                    ) : (
                        messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 1.5
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '75%',
                                        px: 2,
                                        py: 1.2,
                                        borderRadius: 2,
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        boxShadow: 1
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mt: 0.5,
                                            opacity: 0.8,
                                            textAlign: 'right',
                                            fontSize: '0.65rem'
                                        }}
                                    >
                                        {dayjs(msg.timestamp).format('HH:mm')}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                    <div ref={chatEndRef} />
                </DialogContent>

                {/* Input */}
                <Box
                    sx={{
                        p: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'white',
                        display: 'flex',
                        gap: 1
                    }}
                >
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Nhập tin nhắn..."
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
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
                        onClick={sendMessage}
                        disabled={!message.trim()}
                        sx={{
                            minWidth: 'auto',
                            px: 2,
                            borderRadius: 3
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </Button>
                </Box>
            </Dialog>
        </>
    );
}