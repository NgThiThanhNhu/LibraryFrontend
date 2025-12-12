import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// 1. Dùng đường dẫn mô-đun và thêm '?url' (Vite)
//    Thao tác này giúp Bundler sao chép file này vào thư mục build và trả về URL
// import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {
    Box,
    Button,
    IconButton,
    Typography,
    LinearProgress,
    Paper,
    Stack,
    Tooltip,
    Alert,
    Snackbar,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Fullscreen,
    FullscreenExit,
    Close,
    CheckCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { BookFileApi, UserReadingSessionApi } from '../apis';
import type { UserReadingSessionUpdateRequest } from '../request/UserReadingSessionUpdateRequest';


// 2. Thiết lập Worker
// pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
}

interface LocationState {
    bookFileId: string
    bookTitle: string;
}


export const BookFileReadingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookId } = useParams<{ bookId: string }>();
    const state = location.state as LocationState;

    console.log('🔍 Component State:', {
        hasState: !!state,
        bookTitle: state?.bookTitle,
        bookId
    });

    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const [pdfBlob, setPdfBlob] = useState<string | null>();
    const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [startTime] = useState<Date>(new Date());
    const [lastSaveTime, setLastSaveTime] = useState<Date>(new Date());
    const [serverProgress, setServerProgress] = useState<number>(0);
    const [serverIsCompleted, setServerIsCompleted] = useState<boolean>(false);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info'
    });
    const [hasCheckedLastPosition, setHasCheckedLastPosition] = useState<boolean>(false);
    const [previousDurationSeconds, setPreviousDurationSeconds] = useState<number>(0);
    const localProgress = numPages > 0 ? (currentPage / numPages) * 100 : 0;

    useEffect(() => {
        const fetchPdfAsBlob = async () => {
            if (!state?.bookFileId) return;

            setIsLoadingPdf(true);
            console.log('📥 Fetching PDF as blob from:', state.bookFileId);

            try {
                const response = await BookFileApi.getPdfFile(state.bookFileId);
                console.log('✅ PDF blob loaded:', {
                    size: (response.size / 1024 / 1024).toFixed(2) + ' MB',
                    type: response.type
                });

                setPdfBlob(response.data.pdfUrl);
                setPdfError(null);

            } catch (error: any) {
                console.error('❌ Failed to fetch PDF:', error);
                setPdfError(`Không thể tải PDF: ${error.message}`);
                setSnackbar({
                    open: true,
                    message: `Lỗi tải PDF: ${error.message}`,
                    severity: 'error'
                });
            } finally {
                setIsLoadingPdf(false);
            }
        };

        fetchPdfAsBlob();

        // ✅ Cleanup khi unmount
        return () => {
            console.log('🧹 Cleaning up PDF blob');
            setPdfBlob(null);
        };
    }, [state?.bookFileId]);

    const getDurationSeconds = useCallback(() => {
        const now = new Date().getTime();
        const start = startTime.getTime();
        const durationInSeconds = Math.floor((now - start) / 1000);
        return previousDurationSeconds + durationInSeconds;
    }, [startTime, previousDurationSeconds]);
    const loadLastPosition = useCallback(async () => {
        if (!bookId) {
            setHasCheckedLastPosition(true);
            return;
        }

        try {
            const response = await UserReadingSessionApi.getLastPosition(bookId);

            if (response.isSuccess && response.data) {
                setSessionId(response.data.id);
                setCurrentPage(response.data.lastPageNumber);
                setServerProgress(response.data.readingProgress);
                setServerIsCompleted(response.data.isCompleted);
                setPreviousDurationSeconds(response.data.durationSeconds)

                console.log('✅ Resumed from page:', response.data.lastPageNumber);

                setSnackbar({
                    open: true,
                    message: `Tiếp tục từ trang ${response.data.lastPageNumber}`,
                    severity: 'info'
                });
            }
        } catch (error) {
            console.error('Error loading last position:', error);
            console.log('📖 Starting from page 1 (no previous position)');
        } finally {
            setHasCheckedLastPosition(true);
        }
    }, [bookId]);

    const createReadingSession = useCallback(async () => {
        if (!bookId || numPages === 0 || sessionId) return;

        try {
            console.log('📤 Creating session with:', {
                bookId,
                lastPageNumber: currentPage,
                totalPages: numPages
            });

            const response = await UserReadingSessionApi.createReadingSession({
                bookId: bookId,
                lastPageNumber: currentPage,
                totalPages: numPages,
            });

            if (response.isSuccess && response.data) {
                setSessionId(response.data.id);
                setServerProgress(response.data.readingProgress);
                setServerIsCompleted(response.data.isCompleted);

                console.log('✅ Session created:', response.data.id);

                setSnackbar({
                    open: true,
                    message: 'Bắt đầu theo dõi tiến độ',
                    severity: 'success'
                });
            }
        } catch (error: any) {
            console.error('Error creating session:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Không thể tạo session',
                severity: 'error'
            });
        }
    }, [bookId, numPages, currentPage, sessionId]);



    const updateReadingSession = useCallback(async (forceUpdate: boolean = false) => {
        if (!sessionId || numPages === 0) return;

        const now = new Date();
        const timeSinceLastSave = (now.getTime() - lastSaveTime.getTime()) / 1000;

        if (!forceUpdate && timeSinceLastSave < 30) return;

        try {
            const lastPageNumber = currentPage;
            const durationSeconds = getDurationSeconds();
            const updatePayload: UserReadingSessionUpdateRequest = {
                lastPageNumber: lastPageNumber,
                durationSeconds: durationSeconds,
            };

            const response = await UserReadingSessionApi.updateReadingSession(sessionId, updatePayload);

            if (response.isSuccess && response.data) {
                setServerProgress(response.data.readingProgress);
                setServerIsCompleted(response.data.isCompleted);
                setLastSaveTime(now);

                console.log('✅ Session updated:', {
                    progress: response.data.readingProgress,
                    completed: response.data.isCompleted,
                    duration: durationSeconds
                });

                if (response.data.isCompleted && !serverIsCompleted) {
                    setSnackbar({
                        open: true,
                        message: '🎉 Chúc mừng! Bạn đã đọc xong!',
                        severity: 'success'
                    });
                }
            }
        } catch (error: any) {
            console.error('Error updating session:', error);
        }
    }, [sessionId, numPages, currentPage, getDurationSeconds, lastSaveTime, serverIsCompleted]);

    const handleLoadError = useCallback((error: any) => {
        console.error('❌ PDF Load Error:');
        console.error('  📛 Name:', error.name);
        console.error('  💬 Message:', error.message);
        console.error('  📚 Full Error:', error);

        let errorMessage = 'Không thể tải PDF';

        if (error.message.includes('CORS') || error.message.includes('cors')) {
            errorMessage = '❌ Lỗi CORS: Server không cho phép truy cập file';
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
            errorMessage = '❌ File PDF không tồn tại (404)';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = '❌ Không thể kết nối đến server';
        } else if (error.message.includes('Invalid PDF')) {
            errorMessage = '❌ File không phải định dạng PDF hợp lệ';
        } else if (error.message.includes('password')) {
            errorMessage = '❌ PDF yêu cầu mật khẩu';
        } else {
            errorMessage = `❌ Lỗi: ${error.message}`;
        }

        setPdfError(errorMessage);
        setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error'
        });
    }, [state?.bookFileId]);

    const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
        console.log('✅ PDF loaded successfully:', numPages, 'pages');
        setNumPages(numPages);
        setPdfLoaded(true);
        setPdfError(null);

        await loadLastPosition();
    };

    useEffect(() => {
        if (pdfLoaded && numPages > 0 && !sessionId && hasCheckedLastPosition) {
            console.log('🆕 No existing session found, creating new one...');
            const timer = setTimeout(() => createReadingSession(), 500);
            return () => clearTimeout(timer);
        }
    }, [pdfLoaded, numPages, hasCheckedLastPosition, sessionId, createReadingSession]);

    useEffect(() => {
        if (!sessionId || numPages === 0) return;

        const interval = setInterval(() => {
            updateReadingSession(false);
        }, 60000);

        return () => clearInterval(interval);
    }, [sessionId, numPages, updateReadingSession]);

    useEffect(() => {
        if (sessionId && numPages > 0) {
            const timer = setTimeout(() => {
                updateReadingSession(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentPage, sessionId, numPages, updateReadingSession]);

    useEffect(() => {
        return () => {
            if (sessionId) {
                updateReadingSession(true);
            }
        };
    }, [sessionId, updateReadingSession]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (sessionId) {
                updateReadingSession(true);
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [sessionId, updateReadingSession]);

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(numPages, prev + 1));
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= numPages && !isNaN(page)) {
            setCurrentPage(page);
        }
    };

    const zoomIn = () => setScale(prev => Math.min(2.0, prev + 0.1));
    const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.1));

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft': goToPreviousPage(); break;
                case 'ArrowRight': goToNextPage(); break;
                case '+': case '=': zoomIn(); break;
                case '-': zoomOut(); break;
                case 'f': case 'F': toggleFullscreen(); break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, numPages]);

    const handleClose = async () => {
        if (sessionId) {
            await updateReadingSession(true);
            setSnackbar({
                open: true,
                message: 'Đã lưu tiến độ!',
                severity: 'success'
            });
            setTimeout(() => navigate(-1), 500);
        } else {
            navigate(-1);
        }
    };

    if (!state?.bookFileId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">❌ Không tìm thấy file PDF</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    URL không được truyền vào component
                </Typography>
                <Button onClick={() => navigate(-1)} variant="contained" sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        );
    }
    const pdfOptions = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }), []);
    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#525659'
        }}>
            <Paper elevation={3} sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: 0,
                bgcolor: '#1a1a1a',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ maxWidth: 400 }}>
                        {state?.bookTitle || 'Đang đọc sách'}
                    </Typography>
                    {serverIsCompleted && (
                        <Chip
                            icon={<CheckCircle />}
                            label="Hoàn thành"
                            color="success"
                            size="small"
                        />
                    )}
                </Box>

                <Stack direction="row" spacing={2} alignItems="center">
                    {sessionId && (
                        <Tooltip title="Đang theo dõi tiến độ">
                            <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#4caf50',
                                boxShadow: '0 0 10px #4caf50',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                    '50%': { opacity: 0.7, transform: 'scale(1.2)' }
                                }
                            }} />
                        </Tooltip>
                    )}

                    <Tooltip title="Thu nhỏ (-)">
                        <IconButton onClick={zoomOut} disabled={scale <= 0.5} sx={{ color: 'white' }}>
                            <ZoomOut />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
                        {Math.round(scale * 100)}%
                    </Typography>
                    <Tooltip title="Phóng to (+)">
                        <IconButton onClick={zoomIn} disabled={scale >= 2.0} sx={{ color: 'white' }}>
                            <ZoomIn />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isFullscreen ? "Thoát (F)" : "Toàn màn (F)"}>
                        <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                    </Tooltip>

                    <Box sx={{
                        ml: 2,
                        p: 1.5,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        minWidth: 200
                    }}>
                        <Stack spacing={0.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 600 }}>
                                    📖 Trang:
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    {currentPage} / {numPages}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 600 }}>
                                    📊 Tiến độ:
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    {localProgress.toFixed(1)}%
                                </Typography>
                                {serverProgress > 0 && (
                                    <Typography variant="caption" sx={{ color: '#4caf50' }}>
                                        (Lưu: {serverProgress.toFixed(1)}%)
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 600 }}>
                                    ⏱️ Thời gian:
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    {Math.floor(getDurationSeconds() / 60)} phút {getDurationSeconds() % 60} giây
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            <LinearProgress
                variant="determinate"
                value={localProgress}
                sx={{
                    height: 6,
                    bgcolor: '#424242',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: serverIsCompleted ? '#4caf50' : '#2196f3',
                        transition: 'all 0.3s ease'
                    }
                }}
            />

            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'auto',
                p: 2,
                pt: 4
            }}>
                {pdfError ? (
                    <Box sx={{ textAlign: 'center', p: 4, maxWidth: 600 }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            {pdfError}
                        </Typography>
                        <Paper sx={{
                            p: 2,
                            mt: 2,
                            bgcolor: 'grey.100',
                            wordBreak: 'break-all'
                        }}>
                        </Paper>
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                            <Button
                                onClick={() => {
                                    setPdfError(null);
                                    window.location.reload();
                                }}
                                variant="outlined"
                            >
                                🔄 Thử lại
                            </Button>
                            <Button onClick={() => navigate(-1)} variant="contained">
                                ← Quay lại
                            </Button>
                        </Stack>
                    </Box>
                ) : !pdfBlob || isLoadingPdf ? (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                        <CircularProgress sx={{ color: 'white', mb: 2 }} size={60} />
                        <Typography variant="h6" color="white">
                            {isLoadingPdf ? '📥 Đang tải PDF từ server...' : 'Đang chuẩn bị...'}
                        </Typography>
                        <Typography variant="body2" color="white" sx={{ mt: 1, opacity: 0.8 }}>
                            {isLoadingPdf ? 'Vui lòng chờ...' : 'Chuẩn bị hiển thị PDF'}
                        </Typography>
                        {pdfBlob && (
                            <Typography variant="caption" color="white" sx={{ mt: 2, display: 'block', opacity: 0.7 }}>
                                📦 Đã tải: {(pdfBlob)} MB
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <Document
                        file={pdfBlob}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={handleLoadError}
                        options={pdfOptions}
                        loading={
                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                <CircularProgress sx={{ color: 'white', mb: 2 }} size={60} />
                                <Typography variant="h6" color="white">
                                    Đang hiển thị PDF...
                                </Typography>
                                <Typography variant="body2" color="white" sx={{ mt: 1, opacity: 0.8 }}>
                                    Chuẩn bị theo dõi tiến độ đọc
                                </Typography>
                            </Box>
                        }
                    >
                        <Page
                            pageNumber={currentPage}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={true}
                        />
                    </Document>
                )}
            </Box>

            <Paper elevation={3} sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                borderRadius: 0,
                bgcolor: '#1a1a1a'
            }}>
                <Button
                    variant="contained"
                    startIcon={<ChevronLeft />}
                    onClick={goToPreviousPage}
                    disabled={currentPage <= 1}
                    sx={{ minWidth: 120 }}
                >
                    Trước
                </Button>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ color: 'white' }}>Trang</Typography>
                    <input
                        type="number"
                        value={currentPage}
                        onChange={(e) => goToPage(Number(e.target.value))}
                        style={{
                            width: 80,
                            padding: '10px',
                            textAlign: 'center',
                            border: '2px solid #2196f3',
                            borderRadius: 8,
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                        min={1}
                        max={numPages}
                    />
                    <Typography sx={{ color: 'white' }}>/ {numPages}</Typography>
                </Stack>

                <Button
                    variant="contained"
                    endIcon={<ChevronRight />}
                    onClick={goToNextPage}
                    disabled={currentPage >= numPages}
                    sx={{ minWidth: 120 }}
                >
                    Sau
                </Button>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ fontSize: '14px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BookFileReadingPage;