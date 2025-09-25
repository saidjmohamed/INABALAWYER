import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// Auth wrappers (معطلة مؤقتًا)
// import { ProtectedRoute } from "./components/auth/ProtectedRoute";
// import AdminRoute from "./components/auth/AdminRoute";
import MainLayout from "./components/layout/MainLayout";
import AppWrapper from "./components/AppWrapper";

// Components
import { WhatsAppButton } from "./components/WhatsAppButton";

function App() {
  return (
    <Router>
      <SessionProvider>
        <SettingsProvider>
          <PresenceProvider>
            <AppWrapper>
              <Routes>
                {/* Public Routes - محولة إلى الصفحة الرئيسية مؤقتًا */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/signup" element={<Navigate to="/" replace />} />

                {/* جميع الطرق متاحة بدون تحقق (مؤقتًا) */}
                <Route element={<MainLayout />}>
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
                  
                  {/* لوحة التحكم متاحة بدون تحقق (مؤقتًا) */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/cases/:id/edit" element={<AdminEditCasePage />} />
                </Route>

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global Components */}
              <WhatsAppButton />
            </AppWrapper>
            <Sonner />
          </PresenceProvider>
        </SettingsProvider>
      </SessionProvider>
    </Router>
  );
}

export default App;