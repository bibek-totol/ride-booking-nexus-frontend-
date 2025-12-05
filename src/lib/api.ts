
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}


const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};


export const saveAuthTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};


export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
};


async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();


  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    console.log('API Response:', data);


    if (!response.ok) {
      return {
        error: data.message || data.error || 'An error occurred',
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
}


interface Credentials {
  email: string;
  password: string;
}


export const authApi = {

  register: (userData: UserData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: Credentials) =>
    apiRequest<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  refreshToken: (token: string) =>
    apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};


export const userApi = {
  getProfile: () => apiRequest('/users/profile'),

  getAcceptedRides: () => apiRequest('/users/acceptedrides'),

  getRideById: (rideId: string) => apiRequest(`/users/rides/${rideId}`),

  getUserById: (userId: string) => apiRequest(`/users/${userId}`),

  sendPasswordOtp: () =>
    apiRequest('/users/password/otp', {
      method: 'POST',
    }),

  verifyPasswordOtp: (otp: string) =>
    apiRequest('/users/password/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    }),

  changePassword: (newPassword: string) =>
    apiRequest('/users/password', {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword }),
    }),

  updateProfile: (data: { name?: string; email?: string; role?: string }) =>
    apiRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};


export const riderApi = {
  requestRide: (rideData: {
    pickup: { lat: number; lng: number; address: string };
    destination: { lat: number; lng: number; address: string };
    price: number;
    payment: {
      method?: string;
      paymentIntentId?: string;
      amount?: number;
    };
    riderName?: string;
    riderEmail?: string;
  }) =>
    apiRequest('/riders/request', {
      method: 'POST',
      body: JSON.stringify(rideData),
    }),

  cancelRide: (rideId: string) =>
    apiRequest(`/riders/${rideId}/cancel`, {
      method: 'POST',
    }),

  createPaymentIntent: (amount: number) =>
    apiRequest('/riders/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  getRideHistory: () => apiRequest('/riders/history'),

  getRideById: (rideId: string) => apiRequest(`/riders/${rideId}`),
  getCoords: (address: string) =>
    apiRequest(`/riders/coords?address=${encodeURIComponent(address)}`),
};


export const driverApi = {
  acceptRide: (rideId: string, body: any) =>
    apiRequest(`/drivers/${rideId}/accept`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),


  rejectRide: (rideId: string) =>
    apiRequest(`/drivers/${rideId}/reject`, {
      method: 'PUT',
    }),

  updateRideStatus: (rideId: string, status: string) =>
    apiRequest(`/drivers/${rideId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  setAvailability: (available: boolean) =>
    apiRequest('/drivers/availability', {
      method: 'POST',
      body: JSON.stringify({ available }),
    }),





  getDriverEarnings: () => apiRequest('/drivers/earnings'),

  getRideById: (rideId: string) => apiRequest(`/drivers/${rideId}`),



  getAllRides: () => apiRequest('/drivers/rides'),
};


export const adminApi = {
  listUsers: () => apiRequest('/admin/users'),

  listDrivers: () => apiRequest('/admin/drivers'),

  listRides: () => apiRequest('/admin/rides'),

  getAllDriversAdditional: () => apiRequest("/admin/drivers/additional"),


  approveDriver: (driverId: string) =>
    apiRequest(`/admin/drivers/${driverId}/approve`, {
      method: 'POST',
    }),

  suspendDriver: (driverId: string) =>
    apiRequest(`/admin/drivers/${driverId}/suspend`, {
      method: 'POST',
    }),

  blockUser: (userId: string) =>
    apiRequest(`/admin/users/${userId}/block`, {
      method: 'POST',
    }),

  unblockUser: (userId: string) =>
    apiRequest(`/admin/users/${userId}/unblock`, {
      method: 'POST',
    }),

  generateReport: () => apiRequest('/admin/reports'),


  getAllDriverEarnings: (driverId: string) => apiRequest(`/admin/drivers/${driverId}/earnings`)

};
