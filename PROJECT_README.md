# RideBook - Complete Ride Booking Platform

A modern, responsive ride-booking web application built with React, TypeScript, and Tailwind CSS. This platform supports three user roles: Riders, Drivers, and Admins, with complete API integration ready for your backend.

## 🚀 Features

### For Riders
- **Request Rides**: Easy-to-use form with pickup and destination locations
- **Ride History**: View all past and active rides
- **Real-time Status**: Track ride status updates
- **Cancel Rides**: Cancel pending rides anytime
- **Profile Management**: View and manage account details

### For Drivers
- **Active Rides Dashboard**: Accept or reject ride requests
- **Earnings Tracking**: View earnings history and statistics
- **Availability Toggle**: Control when you're available for rides
- **Status Updates**: Update ride status (picked up, completed, etc.)
- **Profile Management**: Manage driver information

### For Admins
- **Dashboard Overview**: Key metrics and statistics
- **User Management**: View, block, and unblock users
- **Driver Management**: Approve, suspend, and manage drivers
- **Ride Monitoring**: View all rides across the platform
- **Reports**: Generate comprehensive reports and analytics

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradient accents
- **Responsive**: Fully responsive for mobile, tablet, and desktop
- **Dark Mode Ready**: Design system supports dark mode
- **Semantic Colors**: HSL-based color system for consistent theming
- **Status Indicators**: Clear visual feedback for all actions
- **Toast Notifications**: User-friendly success/error messages

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 📦 Installation

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

   The app will be available at `http://localhost:8080`

## 🔌 API Integration

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

## 🔐 Authentication

The app uses JWT token-based authentication:

1. User logs in with email and password
2. Backend returns `accessToken` and `refreshToken`
3. Tokens are stored in localStorage
4. All authenticated requests include `Authorization: Bearer {accessToken}` header
5. Token refresh is handled automatically

## 👥 User Roles

### Demo Credentials
Use these credentials to test different roles:

- **Rider**: `rider@example.com` / `password123`
- **Driver**: `driver@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

### Role-Based Access
- Each role has its own dashboard and routes
- Protected routes prevent unauthorized access
- Users are automatically redirected to their role-specific dashboard

## 📱 Pages Structure

```
/                          - Landing page
/login                     - Login page
/register                  - Registration page

/rider                     - Rider dashboard (request ride)
/rider/rides              - Rider's ride history
/rider/profile            - Rider profile

/driver                    - Driver dashboard (active rides)
/driver/earnings          - Driver earnings history
/driver/availability      - Driver availability settings
/driver/profile           - Driver profile

/admin                     - Admin dashboard (overview)
/admin/users              - Manage users
/admin/drivers            - Manage drivers
/admin/rides              - View all rides
/admin/reports            - Generate reports
```

## 🎨 Customization

### Colors
Edit `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 217 91% 60%;    /* Blue */
  --accent: 25 95% 53%;      /* Orange */
  --success: 142 76% 36%;    /* Green */
  --warning: 38 92% 50%;     /* Yellow */
  --destructive: 0 84% 60%;  /* Red */
}
```

### Components
All UI components are in `src/components/ui/` and can be customized using Tailwind CSS classes.

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Deploy to Vercel
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel settings
4. Deploy!

Alternatively, use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

## 📝 Environment Variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

**Important**: Never commit the `.env` file to version control. Use `.env.example` as a template.

## 🐛 Troubleshooting

### API Connection Issues
- Verify your backend is running
- Check the `VITE_API_BASE_URL` in `.env`
- Ensure CORS is configured on your backend
- Check browser console for error messages

### Authentication Issues
- Clear localStorage and try logging in again
- Verify JWT tokens are being sent in request headers
- Check token expiration settings on backend

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear build cache: `npm run build --force`

## 📄 License

This project is built for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API integration guide
3. Check browser console for errors
4. Verify backend is running correctly

## 🎯 Next Steps

1. **Connect Your Backend**: Update the API base URL in `.env`
2. **Test All Flows**: Try registering and using all three user roles
3. **Customize Design**: Adjust colors and styling to match your brand
4. **Add Features**: Extend functionality based on your needs
5. **Deploy**: Deploy to Vercel or your preferred hosting platform

## ✨ Features to Consider Adding

- Real-time ride tracking with maps integration (Google Maps, Mapbox)
- Push notifications for ride updates
- Payment gateway integration (Stripe, PayPal)
- Driver ratings and reviews
- Chat between rider and driver
- Trip sharing and splitting
- Promotional codes and discounts
- Multi-language support
- Progressive Web App (PWA) features

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
