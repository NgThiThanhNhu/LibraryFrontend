import { Box, Button, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from 'react'
import { Authetication } from '../../apis';
import type { LoginRequest } from '../../request/LoginRequest';
import { Link, useNavigate } from 'react-router-dom';
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
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleToggleVisibility = () => {
        setShowPassword((prev) => !prev)
    }

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
            if (response.isSuccess) {
                if (response.data.roleName == "admin") {
                    navigate('/admin/publisher')
                }
                else {

                    console.log(response.data)
                    navigate("/user/books");
                }
            } else {
                if (response.message == "Tài khoản không tồn tại") {
                    setUsernameError("Tài khoản không tồn tại")
                    return
                }
                if (response.message == "Mat khau khong chinh xac") {
                    setPasswordError("Mật khẩu không đúng")
                    return
                }
            }
        } catch (error) {
            alert('Đăng nhập thất bại!' + error);
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={login.password}
                            onChange={(e) => setLogin({ ...login, password: e.target.value })}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                                endAdornment: (<InputAdornment position='end'>
                                    <IconButton onClick={handleToggleVisibility} edge="end"> {
                                        showPassword ? <VisibilityOff /> : <Visibility />
                                    }</IconButton>
                                </InputAdornment>)
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" onClick={onhandleLogin}>
                            Đăng nhập
                        </Button>
                    </Box>
                    <Box className="p-4">
                        <p className="text-center">Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng ký</Link></p>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}
