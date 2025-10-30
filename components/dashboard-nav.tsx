"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";

interface DashboardNavProps {
  user: User;
}

const navItems = [
  {
    title: "แดชบอร์ด",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "ใบแจ้งหนี้",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "ลูกค้า",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "ตั้งค่า",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-slate-800 border shadow-sm"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:static
          inset-y-0 left-0
          z-40
          w-64
          bg-white dark:bg-slate-950
          border-r
          transition-transform duration-200
          ease-in-out
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">InvoiceThai</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t p-4">
            <div className="mb-3 px-3">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">แพ็กเกจ: Free</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
