import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, saveAuthTokens, clearAuthTokens } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "rider" | "driver" | "admin";
  approved: boolean;
  blocked: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  verifyLoginOtp: (email: string, otp: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
    phone: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        clearAuthTokens();
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      if (response.error) {
        toast.error(response.error);
        return response;
      }

      if (response.data) {
        console.log("Login response data:", response.data);
        
        // Check for requireOtp in both response.data and response.data.data
        const data = response.data as any;
      
        const requireOtp = data.requiresOtp || data.data?.requiresOtp;


        if (requireOtp) {
          console.log("OTP required, redirecting...");
          return response;
        }

        if (!data.user && !data.data?.user) {
          console.error("No user data found in response");
          throw new Error("User data missing from response");
        }

        const userData = data.user || data.data?.user;
        const accessToken = data.accessToken || data.data?.accessToken;
        const refreshToken = data.refreshToken || data.data?.refreshToken;

        saveAuthTokens(accessToken, refreshToken);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        const dashboardPath = `/${userData.role}`;
        navigate(dashboardPath);
        toast.success("Welcome back!");
      }
      return response;
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return { error: "Login failed" };
    }
  };

  const verifyLoginOtp = async (email: string, otp: string) => {
    try {
      const response = await authApi.verifyLoginOtp(email, otp);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.data) {
        const data = response.data as any;
        const userData = data.user || data.data?.user;
        const accessToken = data.accessToken || data.data?.accessToken;
        const refreshToken = data.refreshToken || data.data?.refreshToken;

        saveAuthTokens(accessToken, refreshToken);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        const dashboardPath = `/${userData.role}`;
        navigate(dashboardPath);
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
    phone: string
  ) => {
    try {
      const response = await authApi.register({ name, email, password, role, phone });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    clearAuthTokens();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };


  

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        verifyLoginOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
