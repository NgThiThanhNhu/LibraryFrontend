// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TodoPage } from "./pages/TodoPage";
import { PublisherPage } from "./pages/PublisherPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";
import { AuthorPage } from "./pages/AuthorPage";
import { BookCategoryPage } from "./pages/BookCategoryPage";
import { BookChapterPage } from "./pages/BookChapterPage";


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/publisher" element={<PublisherPage />} />
        <Route path="/login" element={<AuthenticationPage />} />
        <Route path="/author" element={<AuthorPage />} />
        <Route path="/bookcategory" element={<BookCategoryPage />} />
        <Route path="/bookchapter" element={<BookChapterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
