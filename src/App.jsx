import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import CurrentIssuePage from './pages/home/CurrentIssuePage';
import IssueReaderPage from './pages/home/IssueReaderPage';
import ArticleReaderPage from './pages/home/ArticleReaderPage';
import ArchivePage from './pages/home/ArchivePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AuthorDashboardPage from './pages/author/AuthorDashboardPage';
import ArticleEditorPage from './pages/author/ArticleEditorPage';
import EditorPortalPage from './pages/editor/EditorPortalPage';

import { Loader2 } from 'lucide-react';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <Loader2 className="h-8 w-8 animate-spin text-rosewood" />
    </div>
  );
}

function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<CurrentIssuePage />} />
            <Route path="/issue/:id" element={<IssueReaderPage />} />
            <Route path="/articles/:id" element={<ArticleReaderPage />} />
            <Route path="/archive" element={<ArchivePage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/author"
              element={
                <RequireRole role="author">
                  <AuthorDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path="/author/new"
              element={
                <RequireRole role="author">
                  <ArticleEditorPage />
                </RequireRole>
              }
            />
            <Route
              path="/author/edit/:id"
              element={
                <RequireRole role="author">
                  <ArticleEditorPage />
                </RequireRole>
              }
            />

            <Route
              path="/editor"
              element={
                <RequireRole role="editor">
                  <EditorPortalPage />
                </RequireRole>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}