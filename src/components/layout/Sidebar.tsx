"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Users,
  CalendarCheck,
  Plane,
  Wallet,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/dashboard", label: "대시보드", icon: Home },
  { href: "/dashboard/employees", label: "직원 관리", icon: Users },
  { href: "/dashboard/attendances", label: "근태 관리", icon: CalendarCheck },
  { href: "/dashboard/leaves", label: "휴가 관리", icon: Plane },
  { href: "/dashboard/payrolls", label: "급여 관리", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6" />
            <span className="">HR-MATE</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === href ? "bg-muted text-primary" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
