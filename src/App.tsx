import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VoiceManagement from "./pages/VoiceManagement";
import AIConfig from "./pages/AIConfig";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ClinicDashboard from "./pages/ClinicDashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import OutreachDashboard from "./pages/OutreachDashboard";
import LiveReservations from "./pages/LiveReservations";
import RealEstateVisits from "./pages/RealEstateVisits";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import WaitingList from "./pages/WaitingList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route path="/waiting-list" element={<WaitingList />} />
            
            {/* Protected Admin Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/voice-management" element={
              <ProtectedRoute>
                <VoiceManagement />
              </ProtectedRoute>
            } />
            <Route path="/ai-config" element={
              <ProtectedRoute>
                <AIConfig />
              </ProtectedRoute>
            } />
            
            {/* Other protected routes */}
            <Route path="/restaurant-dashboard" element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            } />
            <Route path="/clinic-dashboard" element={
              <ProtectedRoute>
                <ClinicDashboard />
              </ProtectedRoute>
            } />
            <Route path="/real-estate-dashboard" element={
              <ProtectedRoute>
                <RealEstateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/outreach-dashboard" element={
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
