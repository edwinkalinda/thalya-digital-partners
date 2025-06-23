
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ClinicDashboard from "./pages/ClinicDashboard";
import RealEstateDashboard from "./pages/RealEstateDashboard";
import RealEstateVisits from "./pages/RealEstateVisits";
import OutreachDashboard from "./pages/OutreachDashboard";
import LiveReservations from "./pages/LiveReservations";
import VoiceManagement from "./pages/VoiceManagement";
import AIConfig from "./pages/AIConfig";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import VoiceChat from "./pages/VoiceChat";
import Signup from "./pages/Signup";
import WaitingList from "./pages/WaitingList";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import ClientDashboard from "./pages/ClientDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          <Route path="/clinic" element={<ClinicDashboard />} />
          <Route path="/real-estate" element={<RealEstateDashboard />} />
          <Route path="/real-estate/visits" element={<RealEstateVisits />} />
          <Route path="/outreach" element={<OutreachDashboard />} />
          <Route path="/reservations" element={<LiveReservations />} />
          <Route path="/voice" element={<VoiceManagement />} />
          <Route path="/ai-config" element={<AIConfig />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/voice-chat" element={<VoiceChat />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/waiting-list" element={<WaitingList />} />
          <Route path="/onboarding-success" element={<OnboardingSuccess />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
