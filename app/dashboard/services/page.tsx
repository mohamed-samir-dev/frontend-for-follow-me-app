"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { getServices, updateService, deleteService } from "@/lib/api";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Modal } from "@/components/ui/Modal";
import { ServiceForm } from "@/components/services/ServiceForm";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Service { _id: string; name: string; type: string; email?: string; plan: string; renewalDate?: string; notes?: string; status: string; }

const typeLabels = ["الكل", "استضافة", "قاعدة بيانات", "تخزين", "SaaS", "CDN", "مصادقة", "أخرى"];
const typeValues = ["All", "Hosting", "Database", "Storage", "SaaS", "CDN", "Auth", "Other"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("createdAt");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchServices = useCallback(async () => {
    setFetching(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (type !== "All") params.type = type;
      if (sort === "renewal") params.sort = "renewal";
      const res = await getServices(params);
      setServices(res.data);
    } catch {
      toast.error("تعذر تحميل الخدمات");
    } finally {
      setFetching(false);
    }
  }, [search, type, sort]);

  useEffect(() => {
    const t = setTimeout(fetchServices, 300);
    return () => clearTimeout(t);
  }, [fetchServices]);

  const handleEdit = async (form: unknown) => {
    if (!editTarget) return;
    setLoading(true);
    try {
      await updateService(editTarget._id, form);
      toast.success("تم تحديث الخدمة!");
      setEditTarget(null);
      fetchServices();
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذه الخدمة؟")) return;
    try {
      await deleteService(id);
      toast.success("تم الحذف!");
      fetchServices();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث في الخدمات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          >
            <option value="createdAt">آخر إضافة</option>
            <option value="renewal">تاريخ التجديد</option>
          </select>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={cn("p-2 transition-colors", view === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-2 transition-colors", view === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600")}
            >
              <List size={16} />
            </button>
          </div>
          <Link href="/dashboard/add">
            <Button className=""><Plus size={15} /> إضافة</Button>
          </Link>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        {typeLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => setType(typeValues[i])}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              type === typeValues[i] ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Services */}
      {fetching ? (
        <LoadingSkeleton />
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500">لا توجد خدمات</p>
        </div>
      ) : (
        <motion.div className={cn(view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3")}>
          {services.map((s, i) => (
            <ServiceCard key={s._id} service={s} index={i} onEdit={(svc: unknown) => setEditTarget(svc as Service)} onDelete={handleDelete} />
          ))}
        </motion.div>
      )}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="تعديل الخدمة">
        {/* @ts-ignore */}
        {editTarget && <ServiceForm initial={editTarget} onSubmit={handleEdit} loading={loading} />}
      </Modal>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            <div className="space-y-1.5">
              <div className="w-24 h-3 bg-gray-100 rounded" />
              <div className="w-16 h-2.5 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="w-16 h-5 bg-gray-100 rounded-full" />
            <div className="w-12 h-5 bg-gray-100 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-2.5 bg-gray-100 rounded" />
            <div className="w-3/4 h-2.5 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
