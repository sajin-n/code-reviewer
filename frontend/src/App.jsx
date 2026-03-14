import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ReviewProvider } from "./context/ReviewContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReviewPage from "./pages/ReviewPage";
import DashboardPage from "./pages/DashboardPage";
import SubmissionDetailPage from "./pages/SubmissionDetailPage";
import LandingPage from "./pages/LandingPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

/** Shows the landing page to guests; redirects logged-in users to /review */
function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  return user ? <Navigate to="/review" replace /> : <LandingPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/review"
        element={
          <PrivateRoute>
            <ReviewPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/submission/:id"
        element={
          <PrivateRoute>
            <SubmissionDetailPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReviewProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155" },
            }}
          />
        </ReviewProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
