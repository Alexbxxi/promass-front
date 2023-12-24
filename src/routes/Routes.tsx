import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PostsList, Post, PostDetail } from '../pages';

export const RoutesApp: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/post" element={<Post />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
};
