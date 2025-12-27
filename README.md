
# RideBook - Complete Ride Booking Platform

A modern, responsive ride-booking web application built with React, TypeScript, and Tailwind CSS. This platform supports three user roles: Riders, Drivers, and Admins, with complete API integration ready for your backend.

# Admin Panel
![Screenshot_14](https://github.com/user-attachments/assets/0a984439-320b-4848-81bb-3ef07ea9219d)
![Screenshot_13](https://github.com/user-attachments/assets/d5c06ab2-ce94-4258-956b-469c2914063e)
![Screenshot_12](https://github.com/user-attachments/assets/dd969e47-0fd5-4846-879f-73256519cf65)
![Screenshot_11](https://github.com/user-attachments/assets/81e80f51-6c27-424b-b996-f2de0978a1ed)
![Screenshot_10](https://github.com/user-attachments/assets/4ddcd245-70f0-40f5-8f06-0500ce7f263c)
![Screenshot_9](https://github.com/user-attachments/assets/496bf184-4d49-413f-9f42-ba31dc9849d8)
![Screenshot_8](https://github.com/user-attachments/assets/7ecaec02-f78a-4455-ab67-721c6083d53c)
![Screenshot_7](https://github.com/user-attachments/assets/4d36c78f-e893-40a1-b9f3-00014da4685c)
![Screenshot_6](https://github.com/user-attachments/assets/b3e14065-4826-4746-844d-fd2099d0cd6e)
![Screenshot_5](https://github.com/user-attachments/assets/f07520a9-6d44-4ce9-8e2b-dc1b87f85b35)
![Screenshot_4](https://github.com/user-attachments/assets/c7344619-7464-40b3-a6d3-cb942e93198f)

# Driver Panel
![Screenshot_3](https://github.com/user-attachments/assets/9907247c-50df-4452-bc62-b98bbe8ac3b0)
![Screenshot_2](https://github.com/user-attachments/assets/51371071-777a-4ca2-911b-79615c1e9966)
![Screenshot_15](https://github.com/user-attachments/assets/5894e61c-4db3-4b40-bfbb-2d76c06b6c2f)

# Rider Panel
![Screenshot_17](https://github.com/user-attachments/assets/c73ede4a-8f56-4c55-bce0-7b9637c59536)
![Screenshot_16](https://github.com/user-attachments/assets/1689f43e-6ecb-4853-b793-010a34135236)




##  Features
### Authentication
- **Email-Password**
- - **Google Signin**


### For Riders
- **Request Rides**: Easy-to-use form with pickup and destination locations
- **Automate Pricing and Pickup-Destination**: Auto pricing based on timing, distance
- **Ride History**: View all past and active rides
- **Real-time Status**: Track ride status updates
- **Cancel Rides**: Cancel pending rides anytime
- **Profile Management**: View and manage account details
- **Real-Time Location Track**: Notify updated location
-  **Payment Integration**: Stripe Payment Gateway

### For Drivers
- **Active Rides Dashboard**: Accept or reject ride requests
- **Earnings Tracking**: View earnings history and statistics
- **Driver Additional Verification**: Data submit for verification like NID, RC, License, Photo etc
- **Availability Toggle**: Control when you're available for rides
- **Status Updates**: Update ride status (picked up, completed, etc.)
- **Profile Management**: Manage driver information
- - **Real-Time Location Track**: Notify updated location

### For Admins
- **Dashboard Overview**: Key metrics and statistics
- **User Management**: View, block, and unblock users
- **Driver Management**: Approve, suspend, and manage drivers
- **Ride Monitoring**: View all rides across the platform
- **Reports**: Generate comprehensive reports and analytics
- - **Real-Time Location Track**: Notify updated location

##  Design Features

- **Modern UI**: Clean, professional design with gradient accents
- **Responsive**: Fully responsive for mobile, tablet, and desktop
- **Dark Mode Ready**: Design system supports dark mode
- **Semantic Colors**: HSL-based color system for consistent theming
- **Status Indicators**: Clear visual feedback for all actions
- **Toast Notifications**: User-friendly success/error messages

##  Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Sonner** - Toast notifications
- **Lucide React** - Icons

##  Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

 

##  API Integration

The application is fully integrated with the provided Postman API collection. All API calls are configured in `src/lib/api.ts`.

### Backend Requirements

Your backend should implement these endpoints:

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token

#### Users
- `GET /users/profile` - Get user profile
- `GET /users/rides` - Get user's rides
- `GET /users/rides/:rideId` - Get specific ride

#### Riders
- `POST /riders/request` - Request a new ride
- `POST /riders/:rideId/cancel` - Cancel a ride
- `GET /riders/history` - Get ride history
- `GET /riders/:rideId` - Get specific ride

#### Drivers
- `POST /drivers/:rideId/accept` - Accept ride request
- `POST /drivers/:rideId/reject` - Reject ride request
- `POST /drivers/:rideId/status` - Update ride status
- `POST /drivers/availability` - Set driver availability
- `GET /drivers/earnings` - Get earnings history
- `GET /drivers/:rideId` - Get specific ride

#### Admin
- `GET /admin/users` - List all users
- `GET /admin/drivers` - List all drivers
- `GET /admin/rides` - List all rides
- `POST /admin/drivers/:driverId/approve` - Approve driver
- `POST /admin/drivers/:driverId/suspend` - Suspend driver
- `POST /admin/users/:userId/block` - Block user
- `POST /admin/users/:userId/unblock` - Unblock user
- `GET /admin/reports` - Generate reports

### API Response Format

The API client expects responses in this format:

```json
{
  "data": { /* response data */ },
  "message": "Success message",
  "error": "Error message (if error)"
}
```

##  Authentication

The app uses JWT token-based authentication:

1. User logs in with email and password
2. Backend returns `accessToken` and `refreshToken`
3. All authenticated requests include `Authorization: Bearer {accessToken}` header
4. Token refresh is handled automatically








##  Environment Variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
```








## ✨ Features to Consider Adding

- Driver ratings and reviews
- Chat between rider and driver
- Trip sharing and splitting
- Promotional codes and discounts
- Multi-language support
- Progressive Web App (PWA) features

---


