import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityPage from "./pages/CommunityPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
