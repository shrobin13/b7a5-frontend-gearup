"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getAdminUsers, updateUserRole } from "@/services/admin";
import { useAuthStore } from "@/store/auth-store";
import type { AppUser } from "@/types";
import { toast } from "sonner";

const sidebarItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gear", label: "Gear" },
  { href: "/admin/rentals", label: "Rentals" },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER" | "ADMIN">("CUSTOMER");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const nextUsers = await getAdminUsers();
        setUsers(Array.isArray(nextUsers) ? nextUsers : []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [hasHydrated, isAuthenticated, router]);

  const openEditor = (user: AppUser) => {
    setEditingUser(user);
    setRole((user.role as "CUSTOMER" | "PROVIDER" | "ADMIN") ?? "CUSTOMER");
    setIsActive(user.status ? user.status === "ACTIVE" : user.isActive !== false);
  };

  const handleSave = async () => {
    if (!editingUser?.id && !editingUser?._id) return;
    setSaving(true);
    try {
      await updateUserRole(editingUser.id ?? editingUser._id ?? "", {
        role,
        status: isActive ? "ACTIVE" : "SUSPENDED",
      });
      toast.success("User updated");
      const nextUsers = await getAdminUsers();
      setUsers(Array.isArray(nextUsers) ? nextUsers : []);
      setEditingUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update user");
    } finally {
      setSaving(false);
    }
  };

  if (!hasHydrated || !isAuthenticated) return null;

  return (
    <DashboardShell title="Admin" accent="ink" items={sidebarItems}>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">Users</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Member directory</h1>
        </div>
        <Button className="rounded-xl bg-ink text-white hover:bg-ink/90">Invite user</Button>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={users.map((user) => ({
          ...user,
          status: user.status ?? (user.isActive === false ? "SUSPENDED" : "ACTIVE"),
          actions: (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => openEditor(user)}>
                  Edit role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit user access</DialogTitle>
                  <DialogDescription>Update the role and status for this account.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as "CUSTOMER" | "PROVIDER" | "ADMIN")}> 
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                        <SelectItem value="PROVIDER">PROVIDER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active account</p>
                      <p className="text-xs text-ink-muted">Suspend or restore access</p>
                    </div>
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ),
        }))}
      />

      {loading && users.length === 0 ? <p className="mt-4 text-sm text-ink-muted">Loading users…</p> : null}
    </DashboardShell>
  );
}
