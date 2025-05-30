// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TodoPage } from "./pages/TodoPage";
import { PublisherPage } from "./pages/PublisherPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/publisher" element={<PublisherPage />} />
        <Route path="/login" element={<AuthenticationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
