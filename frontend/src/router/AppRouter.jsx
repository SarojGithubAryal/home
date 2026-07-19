import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import HomePage from '../pages/HomePage';
import MoodPage from '../pages/MoodPage';
import RoomDetailPage from '../pages/RoomDetailPage';
import ContentViewerPage from '../pages/ContentViewerPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mood/:moodId" element={<MoodPage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
          <Route path="/content/:roomId/:action" element={<ContentViewerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;