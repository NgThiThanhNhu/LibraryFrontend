// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TodoPage } from "./pages/TodoPage";
import { PublisherPage } from "./pages/PublisherPage";


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/publisher" element={<PublisherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
