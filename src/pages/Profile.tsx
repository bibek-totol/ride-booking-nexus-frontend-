import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/lib/api";
import { toast } from "sonner";
import { User, Mail, Shield, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit profile dialog state
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"rider" | "driver" | "">("");
  const [isSaving, setIsSaving] = useState(false);

  // Load profile on mount
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        if (!mounted) return;
        if (response?.data) {
          setProfile(response.data);
        } else if (response?.error) {
          toast.error(response.error);
          setProfile(user || null);
        } else {
          setProfile(user || null);
        }
      } catch (err) {
        if (!mounted) return;
        setProfile(user || null);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
    
  }, []);

  
  useEffect(() => {
    const src = profile || {};
    setEditName(src.name || "");
    setEditEmail(src.email || "");
    setEditRole((src.role as "rider" | "driver") || "");

     

    if (user.role === 'driver' && !user.approved) {
      toast.info('You are not approved yet. Please wait...');
    }
 
  }, [profile, user]);

  
  const handleEditDialogOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      if (val) {
        const src = profile || user || {};
        setEditName(src.name || "");
        setEditEmail(src.email || "");
        setEditRole((src.role as "rider" | "driver") || "");
      }
    },
    [profile, user]
  );

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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
        
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile?.name || user?.name || ""} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || user?.email || ""}
                    readOnly
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="role"
                    value={profile?.role || user?.role || ""}
                    readOnly
                    className="pl-10 capitalize"
                  />
                </div>
              </div>

            
              <Dialog open={open} onOpenChange={handleEditDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your name, email and account type.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address</Label>
                      <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-role">Account Type</Label>
                      <Select value={editRole}  disabled={user?.role == "admin"} onValueChange={(val) => setEditRole(val as "rider" | "driver")}>
                        <SelectTrigger id="edit-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rider">Rider</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>

                      <div className="ml-auto">
                        <Button
                          onClick={async () => {
                            if (!editName.trim() || !editEmail.trim() || !editRole) {
                              toast.error("Please fill all fields");
                              return;
                            }

                            setIsSaving(true);
                            try {
                              const res = await userApi.updateProfile({
                                name: editName.trim(),
                                email: editEmail.trim(),
                                role: editRole,
                              });

                              if (res?.error) {
                                toast.error(res.error);
                              } else if (res?.data) {
                                toast.success("Profile updated");
                                setProfile(res.data);
                                try {
                                  localStorage.setItem("user", JSON.stringify(res.data));
                                } catch {}
                                setOpen(false);
                              }
                            } catch (err) {
                              toast.error("Failed to update profile");
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          
          <div className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Your usage statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Account Status</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success">Active</span>
                </div>

                {user?.role === "rider" && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Total Rides</span>
                    <span className="text-sm font-bold">0</span>
                  </div>
                )}

                {user?.role === "driver" && (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Completed Rides</span>
                      <span className="text-sm font-bold">0</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Total Earnings</span>
                      <span className="text-sm font-bold text-success">$0.00</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            
            <Card className="shadow-lg border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your account secure by using a strong password and enabling two-factor authentication.
                </p>

              
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Change Password (Secure 2FA)
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>A 6-digit OTP will be sent to your registered email.</DialogDescription>
                    </DialogHeader>

                    <PasswordChangeFlow />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


function PasswordChangeFlow() {
  const [step, setStep] = useState<"send" | "otp" | "newPass">("send");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState<number | null>(null);

  
  useEffect(() => {
    if (resendCountdown === null) return;
    if (resendCountdown <= 0) {
      setResendCountdown(null);
      return;
    }
    const t = setTimeout(() => setResendCountdown((c) => (c ? c - 1 : 0)), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await userApi.sendPasswordOtp();
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("OTP sent to your email!");
        setStep("otp");
        setResendCountdown(60); 
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown && resendCountdown > 0) return;
    await handleSendOtp();
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return toast.error("Enter OTP");
    setLoading(true);
    try {
      const res = await userApi.verifyPasswordOtp(otp.trim());
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("OTP verified!");
        setStep("newPass");
      }
    } catch {
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPass.trim()) return toast.error("Enter new password");
    if (newPass.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await userApi.changePassword(newPass.trim());
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Password successfully updated!");
        
        setStep("send");
        setOtp("");
        setNewPass("");
      }
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {step === "send" && (
        <>
          <div className="text-sm text-muted-foreground">
            Click <strong>Send OTP</strong> to receive a 6-digit code on your registered email.
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSendOtp} className="flex-1" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input id="otp" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleVerifyOtp} className="flex-1" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button onClick={handleResendOtp} variant="ghost" disabled={loading || (resendCountdown !== null && resendCountdown > 0)}>
                {resendCountdown ? `Resend (${resendCountdown}s)` : "Resend"}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === "newPass" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="newPass">New Password</Label>
            <Input id="newPass" type="password" placeholder="Enter new password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <Button onClick={handleChangePassword} className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
