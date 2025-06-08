// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TodoPage } from "./pages/TodoPage";
import { PublisherPage } from "./pages/PublisherPage";
import { AuthenticationPage } from "./pages/AuthenticationPage";
import { AuthorPage } from "./pages/AuthorPage";
import { BookCategoryPage } from "./pages/BookCategoryPage";
import { BookChapterPage } from "./pages/BookChapterPage";
import { FloorPage } from "./pages/warehouse/FloorPage";
import { RoomPage } from "./pages/warehouse/RoomPage";
import { BookShelfPage } from "./pages/warehouse/BookShelfPage";
import { ShelfPage } from "./pages/warehouse/ShelfPage";
import { ShelfSectionPage } from "./pages/warehouse/ShelfSectionPage";
import { BookImportPage } from "./pages/warehouse/BookImportPage";



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
        <Route path="/warehouse/floor" element={<FloorPage />} />
        <Route path="/warehouse/room" element={<RoomPage />} />
        <Route path="/warehouse/bookshelf" element={<BookShelfPage />} />
        <Route path="/warehouse/shelf" element={<ShelfPage />} />
        <Route path="/warehouse/shelfsection" element={<ShelfSectionPage />} />
        <Route path="/bookimport" element={<BookImportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
