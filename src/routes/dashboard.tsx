import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { motion } from "framer-motion";
import {
  Home, ShoppingCart, DollarSign, Package, Users, Table, FlaskConical, ShieldCheck, Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: DashboardLayout });

const NAV = [
  { to: "/dashboard",           label: "Overview",      icon: Home },
  { to: "/dashboard/database",  label: "Database Explorer", icon: Database },
  { to: "/dashboard/orders",    label: "Orders",        icon: ShoppingCart },
  { to: "/dashboard/revenue",   label: "Revenue",       icon: DollarSign },
  { to: "/dashboard/products",  label: "Products",      icon: Package },
  { to: "/dashboard/customers", label: "Customers",     icon: Users },
  { to: "/dashboard/explorer",  label: "Data Explorer", icon: Table },
  { to: "/dashboard/eda",       label: "Statistics",    icon: FlaskConical },
  { to: "/dashboard/quality",   label: "Data Quality",  icon: ShieldCheck },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-col">
        {/* Tab bar */}
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-background/80 px-4 py-1.5 backdrop-blur">
          {NAV.map((item) => {
            const isActive = item.to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        {/* Page content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
