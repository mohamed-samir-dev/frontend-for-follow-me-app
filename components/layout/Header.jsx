"use client";
import { Bell, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const titles = {
  "/dashboard": "لوحة التحكم",
  "/dashboard/services": "جميع الخدمات",
  "/dashboard/projects": "مشاريع العملاء",
  "/dashboard/add": "إضافة خدمة جديدة",
  "/dashboard/notes": "الملاحظات",
  "/dashboard/favorites": "المفضلة",
  "/dashboard/settings": "الإعدادات",
};

export function Header({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titles[pathname] || "لوحة التحكم";

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base md:text-lg font-semibold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="تسجيل الخروج"
        >
          <LogOut size={18} />
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
          م
        </div>
      </div>
    </header>
  );
}
