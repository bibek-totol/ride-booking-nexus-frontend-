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
        // In production, this would download or display the report
      }
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    {
      title: 'Revenue Report',
      description: 'Total earnings and revenue breakdown',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'User Activity',
      description: 'User registration and engagement metrics',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Driver Performance',
      description: 'Driver ratings, rides, and earnings',
      icon: Car,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Ride Analytics',
      description: 'Ride volume, cancellations, and trends',
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate comprehensive reports for your platform</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((report) => (
            <Card key={report.title} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-full ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={handleGenerateReport} disabled={isGenerating}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-success">$12,450.00</p>
                <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Users</p>
                <p className="text-2xl font-bold text-primary">1,234</p>
                <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Completed Rides</p>
                <p className="text-2xl font-bold text-info">456</p>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-info/20 bg-gradient-to-br from-info/5 to-info/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-info" />
              Export Data
            </CardTitle>
            <CardDescription>Download comprehensive data reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport} disabled={isGenerating}>
                <FileText className="h-4 w-4 mr-2" />
                Export All Data (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport} disabled={isGenerating}>
                <FileText className="h-4 w-4 mr-2" />
                Export User Data (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport} disabled={isGenerating}>
                <FileText className="h-4 w-4 mr-2" />
                Export Ride Data (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
