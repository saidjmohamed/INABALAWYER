import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AdminDashboard from "@/pages/AdminDashboard";
import RequestDetailsPage from "@/pages/RequestDetailsPage";
import LawyersDirectory from "@/pages/LawyersDirectory";
import CourtsListPage from "@/pages/CourtsListPage";
import RequestsByCourtPage from "@/pages/RequestsByCourtPage";
import ProfilePage from "@/pages/ProfilePage";
import RequestsPage from "@/pages/RequestsPage";
import ConversationsPage from "@/pages/ConversationsPage";
import RepresentationCalendarPage from "@/pages/RepresentationCalendarPage";
import AboutPage from "@/pages/AboutPage";
import { SessionProvider } from "@/contexts/SessionContext";
import { PresenceProvider } from "@/contexts/PresenceContext";
import AdminRoute from "@/components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <PresenceProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/requests/:id" element={<RequestDetailsPage />} />
              <Route path="/lawyers" element={<LawyersDirectory />} />
              <Route path="/courts" element={<CourtsListPage />} />
              <Route path="/requests/court/:courtId" element={<RequestsByCourtPage />} />
              <Route path="/conversations" element={<ConversationsPage />} />
              <Route path="/conversations/:id" element={<ConversationsPage />} />
              <Route path="/representation-calendar" element={<RepresentationCalendarPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PresenceProvider>
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;