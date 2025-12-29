import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import OrgChartPage from './pages/OrgChartPage';
import MembersPage from './pages/MembersPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';

// Handle GitHub Pages SPA redirect
function GitHubPagesRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = location.search;
    if (query.startsWith('?/')) {
      const path = query.slice(2).split('&')[0].replace(/~and~/g, '&');
      navigate('/' + path, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/vinhan">
        <GitHubPagesRedirect />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="org-chart" element={<OrgChartPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
