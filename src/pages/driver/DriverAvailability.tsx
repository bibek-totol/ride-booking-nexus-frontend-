import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { driverApi } from '@/lib/api';
import { toast } from 'sonner';
import { ToggleLeft, Info } from 'lucide-react';

export default function DriverAvailability() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleAvailability = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      const response = await driverApi.setAvailability(checked);
      if (response.error) {
        toast.error(response.error);
      } else {
        setIsAvailable(checked);
        toast.success(
          checked ? 'You are now available for rides' : 'You are now offline'
        );
      }
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Availability Settings</h2>
          <p className="text-muted-foreground">Manage when you're available to accept rides</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Availability Toggle */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="h-5 w-5 text-primary" />
                Online Status
              </CardTitle>
              <CardDescription>Toggle your availability to accept new ride requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <Label htmlFor="availability" className="text-base font-semibold">
                    {isAvailable ? 'Available' : 'Offline'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isAvailable
                      ? 'You will receive new ride requests'
                      : 'You will not receive any ride requests'}
                  </p>
                </div>
                <Switch
                  id="availability"
                  checked={isAvailable}
                  onCheckedChange={handleToggleAvailability}
                  disabled={isUpdating}
                  className="data-[state=checked]:bg-success"
                />
              </div>

              <div className="space-y-3">
                <div
                  className={`p-4 border rounded-lg transition-all ${
                    isAvailable
                      ? 'border-success/50 bg-success/10'
                      : 'border-muted bg-muted/50'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {isAvailable ? '✓ Ready to Accept Rides' : '○ Currently Offline'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAvailable
                      ? 'New ride requests will appear in your dashboard'
                      : 'Turn on availability to start receiving ride requests'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <div className="space-y-4">
            <Card className="shadow-lg border-info/20 bg-gradient-to-br from-info/5 to-info/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-info" />
                  How it Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">When you're available:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>You'll receive real-time ride requests</li>
                    <li>Riders nearby can see you're online</li>
                    <li>You can accept or reject requests</li>
                    <li>Your location is shared with riders</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium">When you're offline:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>No new ride requests will be sent</li>
                    <li>You won't appear to nearby riders</li>
                    <li>You can take a break anytime</li>
                    <li>Your location is not tracked</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tips for Drivers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Turn on availability during peak hours for more rides</p>
                <p>• Stay in areas with high demand for faster requests</p>
                <p>• Maintain a high rating for better opportunities</p>
                <p>• Turn off availability when you need a break</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
