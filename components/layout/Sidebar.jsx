"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Server, PlusCircle, Settings, Zap, StickyNote, Star, Globe, X, DatabaseBackup } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "الخدمات", icon: Server },
  { href: "/dashboard/projects", label: "مشاريع العملاء", icon: Globe },
  { href: "/dashboard/add", label: "إضافة خدمة", icon: PlusCircle },
  { href: "/dashboard/notes", label: "الملاحظات", icon: StickyNote },
  { href: "/dashboard/favorites", label: "المفضلة", icon: Star },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
  { href: "/dashboard/backup", label: "النسخ الاحتياطي", icon: DatabaseBackup },
];

function SidebarContent({ onClose }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">متتبع الخدمات</p>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 md:hidden">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}>
              <motion.div
                whileHover={{ x: -2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-blue-600" : "text-gray-400")} />
                {label}
                {isActive && (
                  <motion.div layoutId="activeIndicator" className="mr-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">v1.0.0 · لوحة شخصية</p>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-100 flex-col z-30">
        <SidebarContent onClose={null} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 bg-white border-l border-gray-100 z-50 md:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
