import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	const queryClient = new QueryClient();

	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/home" element={<ProtectedRoute component={<HomePage/>} />} />
				</Routes>
				<Toaster />
			</QueryClientProvider>
		</AuthProvider>
	);
}

export default App;
