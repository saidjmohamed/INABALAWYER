import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SessionProvider } from "@/contexts/SessionContext";
import { PresenceProvider } from "@/contexts/PresenceContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AdminDashboard from "@/pages/AdminDashboard";
import ProfilePage from "@/pages/ProfilePage";
import RequestDetailsPage from "@/pages/RequestDetailsPage";
import CourtsListPage from "@/pages/CourtsListPage";
import LawyersDirectory from "@/pages/LawyersDirectory";
import ConversationsPage from "@/pages/ConversationsPage";
import RepresentationCalendarPage from "@/pages/RepresentationCalendarPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/NotFound";
import RequestsByCourtPage from "@/pages/RequestsByCourtPage";
import { RequestsPage } from "@/pages/RequestsPage";
import CreateRequestPage from "@/pages/CreateRequestPage";

// Auth wrappers
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AdminRoute from "@/components/auth/AdminRoute";

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
            <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
            <Route path="/requests/new" element={<ProtectedRoute><CreateRequestPage /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<ProtectedRoute><RequestDetailsPage /></ProtectedRoute>} />
            <Route path="/courts" element={<ProtectedRoute><CourtsListPage /></ProtectedRoute>} />
            <Route path="/courts/:courtId" element={<ProtectedRoute><RequestsByCourtPage /></ProtectedRoute>} />
            <Route path="/lawyers" element={<ProtectedRoute><LawyersDirectory /></ProtectedRoute>} />
            <Route path="/conversations" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
            <Route path="/conversations/:id" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
            <Route path="/representation-calendar" element={<ProtectedRoute><RepresentationCalendarPage /></ProtectedRoute>} />
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