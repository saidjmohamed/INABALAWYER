import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppWrapper } from './components/AppWrapper';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from './pages/ProfilePage';
import LawyerProfilePage from './pages/LawyerProfilePage';
import CasesPage from './pages/CasesPage';
import ConversationsPage from './pages/ConversationsPage';
import CreateCasePage from './pages/CreateCasePage';
import LawyersDirectory from './pages/LawyersDirectory';
import AboutPage from './pages/AboutPage';
import CourtDetailsPage from './pages/CourtDetailsPage';
import CourtsListPage from './pages/CourtsListPage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import AdminEditCasePage from './pages/AdminEditCasePage';
import AdminDashboard from './pages/AdminDashboard';
import MaintenancePage from './pages/MaintenancePage';

function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/lawyers/:id" element={<LawyerProfilePage />} />
          <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
          <Route path="/cases/new" element={<ProtectedRoute><CreateCasePage /></ProtectedRoute>} />
          <Route path="/cases/:id" element={<ProtectedRoute><CaseDetailsPage /></ProtectedRoute>} />
          <Route path="/cases/:id/edit" element={<ProtectedRoute><AdminEditCasePage /></ProtectedRoute>} />
          <Route path="/conversations" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
          <Route path="/conversations/:id" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
          <Route path="/lawyers" element={<ProtectedRoute><LawyersDirectory /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courts" element={<CourtsListPage />} />
          <Route path="/courts/:id" element={<CourtDetailsPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;