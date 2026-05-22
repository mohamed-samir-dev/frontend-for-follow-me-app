"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getServices } from "@/lib/api";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Modal } from "@/components/ui/Modal";
import { ServiceForm } from "@/components/services/ServiceForm";
import { updateService, deleteService } from "@/lib/api";
import toast from "react-hot-toast";

interface Service { _id: string; name: string; type: string; email?: string; plan: string; renewalDate?: string; notes?: string; status: string; }

const FAVORITES_KEY = "favorites_ids";

export default function FavoritesPage() {
  const [all, setAll] = useState<Service[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    setFavIds(stored);
    getServices({}).then((res) => setAll(res.data)).catch(() => toast.error("تعذر تحميل الخدمات"));
  }, []);

  const favorites = all.filter((s) => favIds.includes(s._id));

  const removeFav = (id: string) => {
    const updated = favIds.filter((f) => f !== id);
    setFavIds(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    toast.success("تمت الإزالة من المفضلة");
  };

  const handleEdit = async (form: unknown) => {
    if (!editTarget) return;
    setLoading(true);
    try {
      await updateService(editTarget._id, form);
      toast.success("تم تحديث الخدمة!");
      setEditTarget(null);
      const res = await getServices({});
      setAll(res.data);
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
      removeFav(id);
      const res = await getServices({});
      setAll(res.data);
    } catch {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Star size={18} className="text-amber-500 fill-amber-500" />
        <p className="text-sm text-gray-500">{favorites.length} خدمة في المفضلة</p>
      </div>

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Star size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">لا توجد خدمات مفضلة</p>
          <p className="text-xs text-gray-400 mt-1">أضف خدمات للمفضلة من صفحة الخدمات</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map((s, i) => (
            <div key={s._id} className="relative">
              <ServiceCard service={s} index={i} onEdit={(svc: unknown) => setEditTarget(svc as Service)} onDelete={handleDelete} />
              <button
                onClick={() => removeFav(s._id)}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-500 transition-colors"
                title="إزالة من المفضلة"
              >
                <Star size={14} className="fill-amber-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="تعديل الخدمة">
        {/* @ts-ignore */}
        {editTarget && <ServiceForm initial={editTarget} onSubmit={handleEdit} loading={loading} />}
      </Modal>
    </div>
  );
}
