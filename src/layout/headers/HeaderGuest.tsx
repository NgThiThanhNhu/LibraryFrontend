import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "@mui/material";

const HeaderGuest = () => {
    const navigate = useNavigate();
    const handleBtnLogin = () => {
        const token = Cookies.get("accessToken"); // 👈 dùng thư viện đọc cookie

        if (!token) {
            navigate("/login");
        }
    }
    return (
        <header className="bg-white shadow p-4 flex items-center justify-between">
            {/* Logo / Tiêu đề */}
            <div className="flex items-center space-x-4">
                <h1 className="ml-4 text-xl font-bold">📚 Thư viện điện tử</h1>
            </div>

            {/* Nút đăng nhập */}
            <div className="relative group">
                <Button onClick={handleBtnLogin}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md transition duration-150"
                >
                    <LoginIcon className="mr-2" />
                    Đăng nhập
                </Button>
            </div>
        </header>
    );
};

export default HeaderGuest;
