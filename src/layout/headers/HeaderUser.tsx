import {
    Badge,
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    Typography,
    Drawer,
    Box,
    TextField,
    Button,
    List,
    ListItem,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ChatIcon from '@mui/icons-material/Chat';
import { useState, useEffect, useRef, useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { Authetication, NotificationToUser } from '../../apis';
import type { NotificationToUserResponse } from '../../response/NotificationToUserResponse';
import type { HubConnection } from '@microsoft/signalr';
import { SignalRContext } from '../../context/SignalRContext';

dayjs.extend(relativeTime);

type Message = {
    sender: 'user' | 'admin';
    text: string;

};

export default function HeaderUser() {
    const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
    const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
    const [openNotificationDialog, setOpenNotificationDialog] = useState<boolean>(false)
    const [notificationApi, setNotificationApi] = useState<NotificationToUserResponse[]>([])
    const navigate = useNavigate();


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
        setOpenNotificationDialog(false)
    }, [openNotificationDialog]);

    const openNotification = () => {
        fetchNotifications();
        setOpenNotificationDialog(true);
    };


    const [unReadCount, setUnReadCount] = useState<number>(0);
    const [load, setLoad] = useState<boolean>(false)
    const count = notificationApi.filter(item => !item.isRead).length;
    const badgeNumber = () => {
        setUnReadCount(count);
    }
    const openBadge = () => {
        badgeNumber();
        setLoad(true);
    };
    useEffect(() => {
        badgeNumber()
        setLoad(false);
    }, [load]);
    const onClickReadNotification = (id: string) => {
        setNotificationApi(prev =>
            prev.map(n => n.notiId === id ? { ...n, isRead: true } : n)
        );
        NotificationToUser.readNotification(id)
            .catch(err => console.log("Lỗi API:", err));
        setAnchorNotif(null);
        navigate(`/user/borrowingstatus`, { replace: true });
    };

    // Chat state
    const [openChat, setOpenChat] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [unread, setUnread] = useState(2);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const toggleChat = () => {
        setOpenChat(!openChat);
        setUnread(0);
    };

    const sendMessage = () => {
        if (message.trim()) {
            const userMsg: Message = { sender: 'user', text: message };
            setMessages((prev) => [...prev, userMsg]);
            setMessage('');

            setTimeout(() => {
                const reply: Message = {
                    sender: 'admin',
                    text: 'Admin đã nhận được tin nhắn của bạn.',
                };
                setMessages((prev) => [...prev, reply]);
            }, 1000);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const onHandleBtnMyBookList = () => {
        navigate(`/user/mybooklist`)
    }

    const onHandleBtnBorrowingStatus = () => {
        navigate(`/user/borrowingstatus`)
    }

    const onHandleBtnHomeRoundedIcon = () => {
        navigate(`/user/books`)
    }

    const onHanldeBtnLogout = () => {
        const response = Authetication.logout()
        console.log(response)
        navigate(`/login`)
    }

    return (
        <div className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Typography variant="h6" className="text-xl font-bold text-gray-800">
                        📚 LibraryApp
                    </Typography>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <Tooltip title="Trang chủ">
                            <IconButton onClick={onHandleBtnHomeRoundedIcon}>
                                <HomeRoundedIcon className="text-gray-600 hover:text-blue-600 transition" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Sách của tôi">
                            <IconButton onClick={onHandleBtnMyBookList}>
                                <LibraryBooksRoundedIcon className="text-gray-600 hover:text-blue-600 transition" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Trạng thái phiếu mượn">
                            <IconButton onClick={onHandleBtnBorrowingStatus}>
                                <AssignmentRoundedIcon className="text-gray-600 hover:text-blue-600 transition" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Thông báo">
                            <IconButton onClick={(e) => {
                                openBadge()
                                setAnchorNotif(e.currentTarget);
                                openNotification();
                            }}>
                                <Badge badgeContent={count} color="error">
                                    <NotificationsRoundedIcon className="text-gray-600 hover:text-blue-600 transition" />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Tin nhắn">
                            <IconButton onClick={toggleChat}>
                                <Badge badgeContent={unread} color="error">
                                    <ChatIcon className="text-gray-600 hover:text-blue-600 transition" />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Tài khoản">
                            <IconButton onClick={(e) => setAnchorUser(e.currentTarget)}>
                                <AccountCircleRoundedIcon className="text-gray-600 hover:text-blue-600 transition" />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <Menu
                        anchorEl={anchorNotif}
                        open={Boolean(anchorNotif)}
                        onClose={() => setAnchorNotif(null)}
                        PaperProps={{ className: 'rounded-xl shadow-xl bg-white text-gray-800', style: { width: 340 } }}
                    >
                        <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">🔔 Thông báo mới</p>
                        </div>
                        {notificationApi.length > 0 ? (
                            <ul className="max-h-64 overflow-y-auto">
                                {notificationApi.sort((a, b) => dayjs(b.sendTime).valueOf() - dayjs(a.sendTime).valueOf()).map((notif) => (
                                    <li
                                        key={notif.notiId}
                                        className="px-4 py-2 hover:bg-gray-50 transition cursor-pointer"
                                        onClick={() => onClickReadNotification(notif.notiId)}
                                    >
                                        <div className="flex items-start gap-2">
                                            {notif.isRead ? (
                                                <DoneRoundedIcon fontSize="small" className="text-green-500 mt-0.5" />
                                            ) : (
                                                <FiberManualRecordRoundedIcon fontSize="small" className="text-blue-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className={`text-sm ${notif.isRead ? 'text-gray-800' : 'text-gray-900 font-semibold'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-0.5">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    📅 {dayjs(notif.sendTime).format('DD/MM/YYYY HH:mm')} • {dayjs(notif.sendTime).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                        ) : (
                            <div className="px-4 py-4 text-sm text-gray-500 italic">
                                Không có thông báo nào.
                            </div>
                        )}
                        <div className="px-4 py-2 border-t border-gray-100 text-right">
                            <button className="text-blue-500 hover:underline text-sm">Xem tất cả</button>
                        </div>
                    </Menu>

                    {/* Menu người dùng */}
                    <Menu
                        anchorEl={anchorUser}
                        open={Boolean(anchorUser)}
                        onClose={() => setAnchorUser(null)}
                        PaperProps={{ className: 'rounded-lg shadow-lg bg-white text-gray-800' }}
                    >
                        <MenuItem onClick={() => setAnchorUser(null)}>Thông tin cá nhân</MenuItem>
                        <MenuItem onClick={() => setAnchorUser(null)}>Đổi mật khẩu</MenuItem>
                        <MenuItem onClick={onHanldeBtnLogout}>Đăng xuất</MenuItem>
                    </Menu>


                    {openChat && (
                        <Box className="fixed bottom-4 right-4 w-[320px] h-[400px] bg-white border rounded-xl shadow-lg flex flex-col z-50">
                            {/* Header */}
                            <Box className="p-3 border-b flex justify-between items-center bg-gray-100 rounded-t-xl">
                                <Typography className="text-sm font-semibold">💬 Chat với Admin</Typography>
                                <Button size="small" onClick={toggleChat}>Đóng</Button>
                            </Box>

                            {/* Nội dung tin nhắn */}
                            <Box className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50">
                                {messages.length === 0 ? (
                                    <Typography className="text-sm text-gray-500 italic text-center mt-8">
                                        Chưa có tin nhắn nào.
                                    </Typography>
                                ) : (
                                    messages.map((msg, index) => (
                                        <Box
                                            key={index}
                                            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm break-words
            ${msg.sender === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 text-gray-800'}`}
                                        >
                                            {msg.text}
                                        </Box>
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </Box>


                            <Box className="border-t p-3 flex gap-2 bg-white">
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Nhập tin nhắn..."
                                    fullWidth
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') sendMessage();
                                    }}
                                />
                                <Button variant="contained" onClick={sendMessage}>Gửi</Button>
                            </Box>
                        </Box>
                    )}

                </div>
            </div>
        </div>
    );
}
