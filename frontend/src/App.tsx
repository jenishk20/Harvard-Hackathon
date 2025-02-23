import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PartnerPage from "./pages/insurances/partner";
import Footer from "./components/Footer";
import MicroInsurancePage from "./pages/insurances/micro-insurance";
import PurchaseInsurancePage from "./pages/insurances/micro-insurance/plan";
import ClaimsPage from "./pages/insurances/claims";
import LandingPage from "./pages/landing";
import TeamPage from "./pages/team";

function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={<ProtectedRoute component={<HomePage />} />}
          />
          <Route
            path="/insurances/partner"
            element={<ProtectedRoute component={<PartnerPage />} />}
          />
          <Route
            path="/insurances/micro-insurance"
            element={<ProtectedRoute component={<MicroInsurancePage />} />}
          />
          <Route
            path="/insurances/micro-insurance/:plan"
            element={<ProtectedRoute component={<PurchaseInsurancePage />} />}
          />
          <Route
            path="/claims/assistance"
            element={<ProtectedRoute component={<ClaimsPage />} />}
          />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
        <Toaster richColors theme="light" />
        <Footer />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
