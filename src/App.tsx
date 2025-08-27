import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { SessionProvider } from "./contexts/SessionContext";
import { PresenceProvider } from "./contexts/PresenceContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import CourtsListPage from "./pages/CourtsListPage";
import LawyersDirectory from "./pages/LawyersDirectory";
import ConversationsPage from "./pages/ConversationsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import CasesPage from "./pages/CasesPage";
import CreateCasePage from "./pages/CreateCasePage";
import CaseDetailsPage from "./pages/CaseDetailsPage";

// Auth wrappers
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <Router>
      <SessionProvider>
        <PresenceProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
            <Route path="/cases/new" element={<ProtectedRoute><CreateCasePage /></ProtectedRoute>} />
            <Route path="/cases/:id" element={<ProtectedRoute><CaseDetailsPage /></ProtectedRoute>} />
            <Route path="/courts" element={<ProtectedRoute><CourtsListPage /></ProtectedRoute>} />
            <Route path="/lawyers" element={<ProtectedRoute><LawyersDirectory /></ProtectedRoute>} />
            <Route path="/conversations" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
            <Route path="/conversations/:id" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Sonner />
        </PresenceProvider>
      </SessionProvider>
    </Router>
  );
}

export default App;