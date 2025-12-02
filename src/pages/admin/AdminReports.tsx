import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { FileText, Download, TrendingUp, DollarSign, Users, Car } from 'lucide-react';

export default function AdminReports() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await adminApi.generateReport();
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Report generated successfully');
      }
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    { title: 'Revenue Report', description: 'Total earnings and revenue breakdown', icon: DollarSign, color: 'text-success', bgColor: 'bg-success/10 dark:bg-success/20' },
    { title: 'User Activity', description: 'User registration and engagement metrics', icon: Users, color: 'text-primary', bgColor: 'bg-primary/10 dark:bg-primary/20' },
    { title: 'Driver Performance', description: 'Driver ratings, rides, and earnings', icon: Car, color: 'text-accent', bgColor: 'bg-accent/10 dark:bg-accent/20' },
    { title: 'Ride Analytics', description: 'Ride volume, cancellations, and trends', icon: TrendingUp, color: 'text-info', bgColor: 'bg-info/10 dark:bg-info/20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 relative">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Reports & Analytics</h2>
          <p className="text-muted-foreground dark:text-gray-300">Generate comprehensive reports for your platform</p>
        </div>

         <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float dark:bg-purple-600/30 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-slow dark:bg-red-600/30 pointer-events-none" />

        {/* Report Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((report) => (
            <Card key={report.title} className="shadow-lg hover:shadow-xl transition-shadow bg-card/50 dark:bg-[#08010f]/50 border border-border dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">{report.title}</CardTitle>
                    <CardDescription className="dark:text-gray-300">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full dark:text-white dark:border-gray-600 dark:hover:bg-muted/20"
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="shadow-lg bg-card/50 dark:bg-[#08010f]/50 border border-border dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Quick Stats</CardTitle>
            <CardDescription className="dark:text-gray-300">Overview of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg border-border dark:border-gray-700">
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-success dark:text-success/80">$12,450.00</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">+15% from last month</p>
              </div>

              <div className="p-4 border rounded-lg border-border dark:border-gray-700">
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-primary dark:text-primary/80">1,234</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">+8% from last month</p>
              </div>

              <div className="p-4 border rounded-lg border-border dark:border-gray-700">
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">Completed Rides</p>
                <p className="text-2xl font-bold text-info dark:text-info/80">456</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card className="shadow-lg border border-info/20 dark:border-info/50 bg-gradient-to-br from-info/5 to-info/10 dark:from-info/10 dark:to-info/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Download className="h-5 w-5 text-info dark:text-info/80" />
              Export Data
            </CardTitle>
            <CardDescription className="dark:text-gray-300">Download comprehensive data reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['All Data', 'User Data', 'Ride Data'].map((label) => (
                <Button
                  key={label}
                  variant="outline"
                  className="w-full justify-start dark:text-white dark:border-gray-600 dark:hover:bg-muted/20"
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export {label} (CSV)
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
