"use client";
import { motion } from "framer-motion";
import { Download, Database, Info } from "lucide-react";
import { getServices } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const exportJSON = async () => {
    try {
      const res = await getServices({});
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `services-${Date.now()}.json`;
      a.click();
      toast.success("تم التصدير بصيغة JSON!");
    } catch {
      toast.error("فشل التصدير");
    }
  };

  const exportCSV = async () => {
    try {
      const res = await getServices({});
      const data: Record<string, unknown>[] = res.data;
      const headers = ["name", "type", "email", "plan", "renewalDate", "status", "notes"];
      const rows = data.map((s) =>
        headers.map((h) => `"${String(s[h] ?? "").replace(/"/g, '""')}"`).join(",")
      );
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `services-${Date.now()}.csv`;
      a.click();
      toast.success("تم التصدير بصيغة CSV!");
    } catch {
      toast.error("فشل التصدير");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">تصدير البيانات</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">تحميل جميع بيانات خدماتك بصيغة JSON أو CSV للنسخ الاحتياطي.</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="" onClick={exportJSON}><Download size={14} /> تصدير JSON</Button>
          <Button variant="secondary" className="" onClick={exportCSV}><Download size={14} /> تصدير CSV</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">بيئة التشغيل</h2>
        </div>
        <div className="space-y-3">
          <EnvRow label="رابط API" value={process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"} />
          <EnvRow label="البيئة" value={process.env.NODE_ENV || "development"} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">حول التطبيق</h2>
        </div>
        <div className="space-y-2 text-sm text-gray-500">
          <p>ServiceTracker v1.0.0</p>
          <p>مبني باستخدام Next.js و TailwindCSS و Framer Motion و Express و MongoDB</p>
          <p className="text-xs text-gray-400">لوحة تحكم شخصية — تتبع جميع خدماتك السحابية في مكان واحد</p>
        </div>
      </motion.div>
    </div>
  );
}

function EnvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <code className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg border border-gray-100">{value}</code>
    </div>
  );
}
