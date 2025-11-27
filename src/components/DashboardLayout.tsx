import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, LogOut, User, MapPin, History, DollarSign, ToggleLeft, Users, BarChart3, Shield,BookCopy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case 'rider':
        return [
          { icon: MapPin, label: 'Request Ride', path: '/rider' },
          { icon: History, label: 'My Rides', path: '/rider/rides' },
          { icon: MapPin, label: 'Track Realtime', path: '/rider/track-realtime' }, 
          { icon: User, label: 'Profile', path: '/rider/profile' },
        ];
    case 'driver':
  return user.approved
    ? [
        { icon: MapPin, label: 'Active Rides', path: '/driver' },
        { icon: DollarSign, label: 'Earnings', path: '/driver/earnings' },
        { icon: ToggleLeft, label: 'Availability', path: '/driver/availability' },
        { icon: MapPin, label: 'Track Realtime', path: '/driver/track-realtime' },
        { icon: User, label: 'Profile', path: '/driver/profile' },
      ]
    : [
        { icon: User, label: 'Profile', path: '/driver/profile' },
         { icon: BookCopy, label: 'Form', path: '/driver/information-form' },
        
      ];

      case 'admin':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Car, label: 'Drivers', path: '/admin/drivers' },
           { icon: Car, label: 'Driver Additionals', path: '/admin/drivers-additional' },
          
          { icon: MapPin, label: 'Rides', path: '/admin/rides' },
          { icon: Shield, label: 'Reports', path: '/admin/reports' },
          { icon: User, label: 'Profile', path: '/admin/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-hero shadow-md">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RideBook</h1>
              <p className="text-xs text-muted-foreground capitalize">{user.role} Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 px-4 py-6">
        
        <aside className="w-64 shrink-0 hidden md:block">
          <nav className="space-y-1 sticky top-20">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-hero text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

      
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

    
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
