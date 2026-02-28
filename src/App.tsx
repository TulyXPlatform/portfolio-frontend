import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { useState } from 'react';
import './index.css';

function App() {
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout socialLinks={socialLinks}>
          <Routes>
            <Route path="/" element={<Home onSocialLinks={setSocialLinks} />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
