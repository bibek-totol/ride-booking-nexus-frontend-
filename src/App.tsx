import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Rider Pages
import RiderDashboard from "./pages/rider/RiderDashboard";
import RiderRides from "./pages/rider/RiderRides";

// Driver Pages
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverEarnings from "./pages/driver/DriverEarnings";
import DriverAvailability from "./pages/driver/DriverAvailability";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminRides from "./pages/admin/AdminRides";
import AdminReports from "./pages/admin/AdminReports";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rider Routes */}
            <Route
              path="/rider"
              element={
                <ProtectedRoute allowedRoles={['rider']}>
                  <RiderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider/rides"
              element={
                <ProtectedRoute allowedRoles={['rider']}>
                  <RiderRides />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rider/profile"
              element={
                <ProtectedRoute allowedRoles={['rider']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/earnings"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverEarnings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/availability"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <DriverAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver/profile"
              element={
                <ProtectedRoute allowedRoles={['driver']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drivers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rides"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRides />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
