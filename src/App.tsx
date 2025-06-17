
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import VoiceManagement from "./pages/VoiceManagement";
import AIConfig from "./pages/AIConfig";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ClinicDashboard from "./pages/ClinicDashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import RealEstateVisits from "./pages/RealEstateVisits";
import LiveReservations from "./pages/LiveReservations";
import OutreachDashboard from "./pages/OutreachDashboard";
import Signup from "./pages/Signup";
import WaitingList from "./pages/WaitingList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import VoiceConfiguration from "./pages/VoiceConfiguration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/voice-configuration" element={<VoiceConfiguration />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/voice-management" element={<VoiceManagement />} />
              <Route path="/ai-config" element={<AIConfig />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding-success" element={<OnboardingSuccess />} />
              <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              <Route path="/clinic-dashboard" element={<ClinicDashboard />} />
              <Route path="/real-estate-dashboard" element={<RealEstateDashboard />} />
              <Route path="/real-estate-visits" element={<RealEstateVisits />} />
              <Route path="/live-reservations" element={<LiveReservations />} />
              <Route path="/outreach-dashboard" element={<OutreachDashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/waiting-list" element={<WaitingList />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
