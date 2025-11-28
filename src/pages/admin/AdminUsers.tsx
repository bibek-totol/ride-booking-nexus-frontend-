import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Users, Ban, CheckCircle, Loader2, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";


export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');         

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.listUsers();
      if (response.data) {
        setUsers(response.data.users as any[]);
      } else if (response.error) {
        toast.error(response.error);
        setUsers([
          {
            _id: '1',
            name: 'Demo Name',
            email: 'demo@example.com',
            role: 'demo role',
            approved: true,
            blocked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await adminApi.blockUser(userId);
      if (response.error) toast.error(response.error);
      else {
        toast.success('User blocked successfully');
        fetchUsers();
      }
    } catch {
      toast.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await adminApi.unblockUser(userId);
      if (response.error) toast.error(response.error);
      else {
        toast.success('User unblocked successfully');
        fetchUsers();
      }
    } catch {
      toast.error('Failed to unblock user');
    }
  };


  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((u) =>
      u._id.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* PAGE HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
            <p className="text-muted-foreground">View and manage all registered users</p>
          </div>

        
          <div className="flex items-center gap-2  px-3 py-2 rounded-md">
          
            <Input
              type="text"
              placeholder="Search ID, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border-primary/40 focus-visible:ring-primary"
            />
          </div>

          {/* Total Users Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">{filteredUsers.length}</span>
            <span className="text-sm text-muted-foreground">Users Found</span>
          </div>
        </div>

        {/* TABLE */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>All registered users in the system</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No matching users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-extrabold">{user._id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>

                        <TableCell>
                          <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className={user.blocked ? "bg-red-500" : "bg-green-500"}>
                            {user.blocked ? "Blocked" : "Active"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-right">
                          {user.blocked ? (
                            <Button size="sm" variant="outline" onClick={() => handleUnblockUser(user._id)}>
                              <CheckCircle className="h-4 w-4 mr-1" /> Unblock
                            </Button>
                          ) : (
                            <Button size="sm" variant="destructive" onClick={() => handleBlockUser(user._id)}>
                              <Ban className="h-4 w-4 mr-1" /> Block
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
