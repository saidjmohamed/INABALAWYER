import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { RequestsPage } from "@/pages/RequestsPage";
import RequestDetailsPage from "@/pages/RequestDetailsPage";
import ProfilePage from "@/pages/ProfilePage";
import ConversationsPage from "@/pages/ConversationsPage";
import ConversationPage from "@/pages/ConversationPage";
import AdminDashboard from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailsPage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/conversations" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
            <Route path="/conversations/:id" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </main>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;