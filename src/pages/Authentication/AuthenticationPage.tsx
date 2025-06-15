import { Box, Button, Icon, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'

import { Authetication } from '../../apis';
import type { LoginRequest } from '../../request/LoginRequest';
import { useNavigate } from 'react-router-dom';
import loginBg from '../../assets/loginBg.jpg'

export const AuthenticationPage = () => {
    const initialLogin: LoginRequest = {
        email: "",
        password: ""
    }

    const [login, setLogin] = useState<LoginRequest>(() => initialLogin)
    const [usernameError, setUsernameError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const navigate = useNavigate();

    const onhandleLogin = async () => {
        try {
            if (!login.email.trim()) {
                alert('email không được để trống!')
                return
            } else if (!login.password.trim()) {
                alert('password không được để trống!')
                return
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(login.email)) {
                alert("Email không hợp lệ!");
                return;
            }
            const response = await Authetication.login(login);
            console.log(response)
            if (!response.isSuccess && response.message.includes("tài khoản")) {
                setUsernameError("Tài khoản không tồn tại")
                return
            } else if (!response.isSuccess && response.message.includes("Mật khẩu")) {
                setPasswordError("Mật khẩu không đúng")
                return
            }
            navigate('/publisher')
        } catch (error) {
            alert('Đăng nhập thất bại!' + error);
            console.log(error)
        }
    }
    return (
        <div>
            <Box
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: `url(${loginBg})`,
                }}
            >

                {/* Form đăng nhập */}
                <Paper
                    elevation={6}
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        padding: 5,
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Thư viện điện tử
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1 }}>Email Address</Typography>
                        <TextField
                            fullWidth
                            placeholder="Email Address"
                            value={login.email}
                            onChange={(e) => setLogin({ ...login, email: e.target.value })}
                            error={!!usernameError}
                            helperText={usernameError}
                        />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ mb: 1 }}>Password</Typography>
                        <TextField
                            fullWidth
                            type="password"
                            placeholder="Password"
                            value={login.password}
                            onChange={(e) => setLogin({ ...login, password: e.target.value })}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" onClick={onhandleLogin}>
                            Đăng nhập
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}
