// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { AuthenticationPage } from "./pages/Authentication/AuthenticationPage";

import { AdminRoutes } from "./routes/AdminRoutes";



function App() {
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<AuthenticationPage />} />
        <Route path="/unauthorized" element={<div>Không có quyền truy cập</div>} />

        {/* Route riêng cho từng role */}
        <Route path="/*" element={<AdminRoutes />} />
        {/* <Route path="/*" element={<UserRoutes />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
