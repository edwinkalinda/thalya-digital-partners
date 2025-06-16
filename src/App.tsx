
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppProvider } from "./contexts/AppContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIConfig from "./pages/AIConfig";
import VoiceManagement from "./pages/VoiceManagement";
import ClinicDashboard from "./pages/ClinicDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import OutreachDashboard from "./pages/OutreachDashboard";
import LiveReservations from "./pages/LiveReservations";
import RealEstateVisits from "./pages/RealEstateVisits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/onboarding-success" element={
              <ProtectedRoute>
                <OnboardingSuccess />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/ai-config" element={
              <ProtectedRoute>
                <AIConfig />
              </ProtectedRoute>
            } />
            <Route path="/voice-management" element={
              <ProtectedRoute>
                <VoiceManagement />
              </ProtectedRoute>
            } />
            <Route path="/clinic" element={
              <ProtectedRoute>
                <ClinicDashboard />
              </ProtectedRoute>
            } />
            <Route path="/restaurant" element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            } />
            <Route path="/real-estate" element={
              <ProtectedRoute>
                <RealEstateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/outreach" element={
              <ProtectedRoute>
                <OutreachDashboard />
              </ProtectedRoute>
            } />
            <Route path="/live-reservations" element={
              <ProtectedRoute>
                <LiveReservations />
              </ProtectedRoute>
            } />
            <Route path="/real-estate-visits" element={
              <ProtectedRoute>
                <RealEstateVisits />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
