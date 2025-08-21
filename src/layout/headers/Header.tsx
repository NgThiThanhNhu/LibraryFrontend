import { useState, useEffect } from "react";
import {
    IconButton,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    Avatar,
    Typography,
    Divider,
    Box,
    Menu,
    MenuItem,
    Button,
    TextField,
} from "@mui/material";
import { FaBars } from "react-icons/fa";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

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

const Header = ({ onHandleSideBar }: Props) => {
    const navigate = useNavigate();
    const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
    const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
    const [openChat, setOpenChat] = useState(false);
    const [chatHistory, setChatHistory] = useState<Record<number, ChatMessage[]>>({});
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [adminReply, setAdminReply] = useState('');
    const [notifications, setNotifications] = useState([
        { id: 1, message: "📚 Người dùng A vừa mượn sách.", isRead: false },
        { id: 2, message: "📬 Tin nhắn mới từ user B.", isRead: false },
    ]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorNotif(event.currentTarget);
    };
    const handleNotifClose = () => setAnchorNotif(null);
    const handleUserClick = (e: React.MouseEvent<HTMLElement>) => setAnchorUser(e.currentTarget);
    const handleUserClose = () => setAnchorUser(null);
    const handleLogout = () => {
        localStorage.removeItem("token");
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
                updated[selectedUserId] = updated[selectedUserId].map((msg) =>
                    msg.from === "user" ? { ...msg, seen: true } : msg
                );
                return updated;
            });
        }
    }, [selectedUserId]);

    return (
        <header className="bg-white shadow p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button onClick={onHandleSideBar} className="text-gray-700 hover:text-black">
                    <FaBars size={24} />
                </button>
                <h1 className="ml-2 text-xl font-bold">Thư viện điện tử</h1>
            </div>

            <div className="flex items-center space-x-4">
                <IconButton onClick={handleNotifClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <Menu anchorEl={anchorNotif} open={Boolean(anchorNotif)} onClose={handleNotifClose}>
                    {notifications.map((n) => (
                        <MenuItem key={n.id}>{n.message}</MenuItem>
                    ))}
                </Menu>

                <IconButton onClick={() => setOpenChat(true)}>
                    <Badge variant="dot" color="primary">
                        <EmailIcon />
                    </Badge>
                </IconButton>

                <div className="relative">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={handleUserClick}>
                        <Avatar src="" alt="Admin" />
                        <span className="font-medium text-sm text-gray-700">Thanh Như</span>
                    </div>
                    <Menu anchorEl={anchorUser} open={Boolean(anchorUser)} onClose={handleUserClose}>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" className="mr-2" />
                            Đăng xuất
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {/* Chat Dialog */}
            <Dialog
                open={openChat}
                onClose={() => setOpenChat(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ className: 'rounded-xl overflow-hidden' }}
            >
                <DialogTitle className="bg-gray-100 border-b font-bold text-lg py-3 px-4">
                    💬 Tin nhắn từ người dùng
                </DialogTitle>

                <DialogContent dividers className="!p-0 !m-0">
                    <Box className="flex h-[500px]">
                        {/* Sidebar user */}
                        <Box className="w-[30%] border-r overflow-y-auto bg-gray-50 p-3 space-y-2">
                            {Object.entries(chatHistory).map(([userId, messages]) => {
                                const lastMsg = messages[messages.length - 1];
                                return (
                                    <Box
                                        key={userId}
                                        onClick={() => setSelectedUserId(Number(userId))}
                                        className={`cursor-pointer p-2 rounded-xl transition flex items-center gap-2
                                            ${Number(userId) === selectedUserId
                                                ? 'bg-blue-100'
                                                : 'hover:bg-gray-200'}`}
                                    >
                                        <Box className="relative">
                                            <Avatar src={lastMsg.avatarUrl || ""} sx={{ width: 32, height: 32 }} />
                                            {!lastMsg.seen && (
                                                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                            )}
                                        </Box>
                                        <Box className="min-w-0">
                                            <Typography className="font-semibold text-sm truncate">
                                                👤 {lastMsg.senderName}
                                            </Typography>
                                            <Typography className="text-xs text-gray-600 truncate">
                                                {lastMsg.message}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Chat content */}
                        <Box className="w-[70%] flex flex-col h-full bg-white">
                            <Box className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                                {selectedUserId ? (
                                    chatHistory[selectedUserId]?.map((msg, index) => (
                                        <Box
                                            key={index}
                                            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm break-words
                                                ${msg.from === 'admin'
                                                    ? 'ml-auto bg-blue-500 text-white'
                                                    : 'mr-auto bg-gray-200 text-gray-800'}`}
                                        >
                                            {msg.message}
                                            <Typography className="text-xs text-gray-300 mt-1 text-right">
                                                {new Date(msg.timestamp).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography className="text-center text-sm text-gray-500 mt-12">
                                        👈 Chọn người dùng để bắt đầu trò chuyện
                                    </Typography>
                                )}
                            </Box>

                            {selectedUserId && (
                                <Box className="border-t px-4 py-3 flex gap-2 bg-white">
                                    <TextField
                                        value={adminReply}
                                        onChange={(e) => setAdminReply(e.target.value)}
                                        fullWidth
                                        size="small"
                                        placeholder="Nhập tin nhắn..."
                                        onKeyDown={(e) => e.key === 'Enter' && handleAdminReply()}
                                    />
                                    <Button variant="contained" onClick={handleAdminReply}>
                                        Gửi
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </header>
    );
};

export default Header;
