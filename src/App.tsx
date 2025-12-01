import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthenticationPage } from "./pages/Authentication/AuthenticationPage";
import { AdminRoutes } from "./routes/AdminRoutes";
import { RegisterPage } from "./pages/Authentication/RegisterPage";
import HomePage from "./pages/HomePage";

import { ClientUserRoutes } from "./routes/ClientUserRoutes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

function App() {
  const token = Cookies.get("jwtToken");
  return (

    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/login" element={<AuthenticationPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorizeds" element={<div>Không có quyền truy cập</div>} />
        <Route
          path="/"
          element={
            token ?
              <Navigate to="/user/books" replace />
              : (
                <HomePage />
              )
          }
        />


        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<ClientUserRoutes />} />
      </Routes>
    </Router>



  );
}

export default App;
