import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { SessionProvider } from "./contexts/SessionContext";
import { PresenceProvider } from "./contexts/PresenceContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import CourtsListPage from "./pages/CourtsListPage";
import CourtDetailsPage from "./pages/CourtDetailsPage";
import LawyersDirectory from "./pages/LawyersDirectory";
import ConversationsPage from "./pages/ConversationsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import CasesPage from "./pages/CasesPage";
import CreateCasePage from "./pages/CreateCasePage";
import CaseDetailsPage from "./pages/CaseDetailsPage";
import LawyerProfilePage from "./pages/LawyerProfilePage";
import AdminEditCasePage from "./pages/AdminEditCasePage";

// Auth wrappers
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import MainLayout from "./components/layout/MainLayout";
import AppWrapper from "./components/AppWrapper";

// Components
import { OnlineLawyersIndicator } from "./components/OnlineLawyersIndicator";


function App() {
  return (
    <Router>
      <SessionProvider>
        <SettingsProvider>
          <PresenceProvider>
            <AppWrapper>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes with Layout */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/cases" element={<CasesPage />} />
                  <Route path="/cases/new" element={<CreateCasePage />} />
                  <Route path="/cases/:id" element={<CaseDetailsPage />} />
                  <Route path="/courts" element={<CourtsListPage />} />
                  <Route path="/courts/:id" element={<CourtDetailsPage />} />
                  <Route path="/lawyers" element={<LawyersDirectory />} />
                  <Route path="/lawyers/:id" element={<LawyerProfilePage />} />
                  <Route path="/conversations" element={<ConversationsPage />} />
                  <Route path="/conversations/:id" element={<ConversationsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/cases/:id/edit" element={<AdminRoute><AdminEditCasePage /></AdminRoute>} />
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global Components */}
              <ProtectedRoute>
                <OnlineLawyersIndicator />
              </ProtectedRoute>
            </AppWrapper>
            <Sonner />
          </PresenceProvider>
        </SettingsProvider>
      </SessionProvider>
    </Router>
  );
}

export default App;