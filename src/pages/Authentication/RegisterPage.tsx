import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from 'react'

import { Authetication } from '../../apis';
import type { LoginRequest } from '../../request/LoginRequest';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../../assets/loginBg.jpg'
import type { RegisterRequest } from '../../request/RegisterRequest';
import type { ConfirmOTPRequest } from '../../request/ConfirmOTPRequest';

export const RegisterPage = () => {
    const initialRegister: RegisterRequest = {
        email: "",
        name: "",
        password: ""
    }

    const [register, setRegister] = useState<RegisterRequest>(() => initialRegister)
    const [emaiError, setEmailError] = useState<string>("")
    const [usernameError, setUsernameError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [error, setError] = useState({
        password: "",
        confirmPassword: ""
    })
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

    const handleToggleVisibility = () => {
        setShowPassword((prev) => !prev)
    }





    const onhandleRegister = async (): Promise<boolean> => {
        try {
            if (!register.email.trim()) {
                alert('email không được để trống!');
                return false;
            } else if (!register.password.trim()) {
                alert('password không được để trống!');
                return false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(register.email)) {
                alert("Email không hợp lệ!");
                return false;
            }

            let hasError = false;
            const newError = { password: "", confirmPassword: "" };

            if (register.password.length < 6) {
                newError.password = "Mật khẩu phải ít nhất 6 ký tự";
                hasError = true;
            }

            if (confirmPassword !== register.password) {
                newError.confirmPassword = "Mật khẩu không khớp";
                hasError = true;
            }

            setError(newError);
            if (hasError) return false;

            const response = await Authetication.register(register);

            if (!response.isSuccess && response.message.includes("tài khoản")) {
                setUsernameError("Tài khoản không tồn tại");
                return false;
            } else if (!response.isSuccess && response.message.includes("Mật khẩu")) {
                setPasswordError("Mật khẩu không đúng");
                return false;
            }
            return true;

        } catch (error) {
            alert('Đăng ký thất bại!' + error);
            console.log(error);
            return false;
        }
    };

    const [dialogOTP, setDialogOTP] = useState<boolean>(false)

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
    const openDialog = () => {
        setDialogOTP(true)
    }
    const closeDialog = () => {
        setDialogOTP(false)
    }
    const handleChangeOTP = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (value && nextInput) {
            (nextInput as HTMLInputElement).focus();
        }
    }

    const [confirmOTP, setConfirmOTP] = useState<ConfirmOTPRequest>({
        email: "",
        confirmOtp: ""
    })
    const onHandleConfirmOtp = async () => {
        const otpCode = otp.join('');
        console.log("OTP đã nhập:", otpCode);
        console.log(register.email);
        if (otpCode.length !== 6) {
            alert("Vui lòng nhập đầy đủ mã OTP");
            return;
        }
        confirmOTP.confirmOtp = otpCode;
        confirmOTP.email = register.email;
        const response = await Authetication.confirmOTP(confirmOTP)
        if (response.isSuccess) {
            alert("Đăng ký thành công" + response.message)
            setConfirmOTP(response.data)

            // ✅ Kiểm tra nếu có redirect URL đã lưu
            const redirectPath = localStorage.getItem("redirectAfterLogin");
            if (redirectPath) {
                localStorage.removeItem("redirectAfterLogin"); // clear sau khi dùng
                navigate(redirectPath);
            } else {
                navigate('/login');
            }
        }

        else {
            if (response.message === "Mã đã hết hiệu lực") {
                alert("Mã đã hết hiệu lực. Vui lòng kiểm tra lại")
                navigate('/register')
                return
            } else if (response.message === "Mã Otp không tồn tại") {
                alert("Mã otp không tồn tại. Vui lòng kiểm tra lại email")
                navigate('/register')
                return
            } else if (response.message === "Mã OTP không chính xác") {
                alert("Mã OTP không chính xác. Vui lòng kiểm tra lại")
                navigate('/register')
                return
            }
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
                <Paper
                    elevation={6}
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        padding: 5,
                        width: '100%',
                        maxWidth: 460,
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
                            placeholder="Nhập email"
                            value={register.email}
                            onChange={(e) => setRegister({ ...register, email: e.target.value })}
                            error={!!emaiError}
                            helperText={emaiError}
                        />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1 }}>Name</Typography>
                        <TextField
                            fullWidth
                            placeholder="Tên người dùng"
                            value={register.name}
                            onChange={(e) => setRegister({ ...register, name: e.target.value })}
                            error={!!usernameError}
                            helperText={usernameError}
                        />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1 }}>Password</Typography>
                        <TextField
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            fullWidth
                            value={register.password}
                            onChange={(e) => setRegister({ ...register, password: e.target.value })}
                            error={!!error.password}
                            helperText={error.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ mb: 1 }}>Confirm Password</Typography>
                        <TextField
                            name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!error.confirmPassword}
                            helperText={error.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    const success = await onhandleRegister();
                                    if (success) {
                                        openDialog();
                                    }
                                }}
                            >
                                Đăng ký
                            </Button>
                            <Dialog open={dialogOTP} onClose={() => { setDialogOTP(false) }}>
                                <DialogTitle sx={{ textAlign: "center" }}>XÁC NHẬN MÃ OTP</DialogTitle>
                                <DialogContent>
                                    <DialogContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                                            {otp.map((digit, index) => (
                                                <TextField
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    value={digit}
                                                    onChange={(e) => handleChangeOTP(index, e.target.value)}
                                                    inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '20px' } }}
                                                    sx={{ width: 50 }}
                                                />
                                            ))}
                                        </Box>


                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                            <Button color="primary" onClick={onHandleConfirmOtp}>Xác nhận</Button>

                                        </Box>
                                    </DialogContent>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    </div>

                </Paper>

            </Box>
        </div >
    )
}
