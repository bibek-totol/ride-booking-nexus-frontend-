import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { Users, Ban, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response: any = await adminApi.listUsers();
      if (response.data) {
        setUsers(response.data.users);
      } else if (response.error) {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (id: string) => {
    try {
      const res = await adminApi.blockUser(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("User blocked");
        fetchUsers();
      }
    } catch {
      toast.error("Error blocking user");
    }
  };

  const handleUnblockUser = async (id: string) => {
    try {
      const res = await adminApi.unblockUser(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("User unblocked");
        fetchUsers();
      }
    } catch {
      toast.error("Error unblocking user");
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((u) =>
      `${u._id} ${u.name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

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
      {/* PAGE BACKGROUND */}
      <div
        className="
        relative min-h-screen p-6 rounded-xl
        bg-muted/30
        dark:bg-gradient-to-r dark:from-[#08010F] dark:via-[#380996] dark:to-[#240404]
      "
      >
        {/* Background Art */}
      
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl dark:bg-purple-600/30 pointer-events-none animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl dark:bg-red-600/30 pointer-events-none animate-float-slow" />

        <div className="relative z-10 space-y-6">

          {/* PAGE HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight dark:text-white">
                Manage Users
              </h2>
              <p className="text-muted-foreground dark:text-gray-300">
                View and manage all registered users
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-md">
              <Input
                type="text"
                placeholder="Search by ID, Name, Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-64 border-primary/40 focus-visible:ring-primary
                  dark:bg-[#08010f]/40 dark:text-white dark:placeholder-gray-400
                "
              />
            </div>

            {/* Total Users */}
            <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg dark:bg-[#08010F]/40 backdrop-blur-sm">
              <Users className="h-5 w-5 text-muted-foreground dark:text-purple-300" />
              <span className="font-semibold dark:text-white">{filteredUsers.length}</span>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                Users Found
              </span>
            </div>
          </div>

          {/* USERS TABLE */}
          <Card
            className="
              shadow-lg bg-card/50 backdrop-blur-sm
              dark:bg-[#08010f]/50 border-border
            "
          >
            <CardHeader>
              <CardTitle className="dark:text-white">User Directory</CardTitle>
              <CardDescription className="dark:text-gray-300">
                All registered users in the system
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader className="dark:bg-[#12041d]/40">
                    <TableRow>
                      <TableHead className="dark:text-gray-200">User ID</TableHead>
                      <TableHead className="dark:text-gray-200">Name</TableHead>
                      <TableHead className="dark:text-gray-200">Email</TableHead>
                      <TableHead className="dark:text-gray-200">Role</TableHead>
                      <TableHead className="dark:text-gray-200">Status</TableHead>
                      <TableHead className="dark:text-gray-200">Joined</TableHead>
                      <TableHead className="text-right dark:text-gray-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-8 text-center text-muted-foreground dark:text-gray-300"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user._id}
                          className="
                            hover:bg-muted/40 dark:hover:bg-[#1a0a2b]/40
                            transition-colors
                          "
                        >
                          <TableCell className="font-extrabold dark:text-white">
                            {user._id}
                          </TableCell>

                          <TableCell className="font-medium dark:text-white">
                            {user.name}
                          </TableCell>

                          <TableCell className="dark:text-gray-200">
                            {user.email}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="capitalize dark:border-purple-400 dark:text-purple-300"
                            >
                              {user.role}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={
                                user.blocked
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                              }
                            >
                              {user.blocked ? "Blocked" : "Active"}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-muted-foreground dark:text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>

                          <TableCell className="text-right">
                            {user.blocked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnblockUser(user._id)}
                                className="dark:border-green-400 dark:text-green-300"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Unblock
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleBlockUser(user._id)}
                                className="dark:bg-red-600"
                              >
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
      </div>
    </DashboardLayout>
  );
}
