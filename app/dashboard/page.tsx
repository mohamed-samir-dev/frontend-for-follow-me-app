"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Server, CheckCircle, XCircle, AlertTriangle, ArrowRight, Globe, Wrench } from "lucide-react";
import Link from "next/link";
import { getStats, getServices, updateService, deleteService, getProjects, getProjectStats } from "@/lib/api";
import { StatsCard } from "@/components/services/StatsCard";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Modal } from "@/components/ui/Modal";
import { ServiceForm } from "@/components/services/ServiceForm";
import toast from "react-hot-toast";

interface Stats { total: number; active: number; expired: number; expiringSoon: number; }
interface ProjectStats { total: number; active: number; expiringSoon: number; maintenanceExpired: number; }
interface Service { _id: string; name: string; type: string; email?: string; plan: string; renewalDate?: string; notes?: string; status: string; }
interface Project { _id: string; clientName: string; projectName: string; domain?: string; renewalDate?: string; maintenanceEndDate?: string; notes?: string; status: string; maintenanceStatus: string; }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [recent, setRecent] = useState<Service[]>([]);
  const [urgentProjects, setUrgentProjects] = useState<Project[]>([]);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [s, r, ps, p] = await Promise.all([
        getStats(),
        getServices({ sort: "renewal" }),
        getProjectStats(),
        getProjects({ sort: "renewal" }),
      ]);
      setStats(s.data);
      setRecent(r.data.slice(0, 6));
      setProjectStats(ps.data);
      // عرض المشاريع التي تنتهي قريباً أو صيانتها منتهية
      const urgent = p.data.filter(
        (proj: Project) => proj.status !== "active" || proj.maintenanceStatus !== "active"
      ).slice(0, 3);
      setUrgentProjects(urgent);
    } catch {
      toast.error("تعذر تحميل بيانات اللوحة");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = async (form: unknown) => {
    if (!editTarget) return;
    setLoading(true);
    try {
      await updateService(editTarget._id, form);
      toast.success("تم تحديث الخدمة!");
      setEditTarget(null);
      fetchData();
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذه الخدمة?")) return;
    try {
      await deleteService(id);
      toast.success("تم الحذف");
      fetchData();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="space-y-8">
      {/* Services Stats */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">الخدمات السحابية</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="إجمالي الخدمات" value={stats?.total} icon={Server} color="blue" delay={0} />
          <StatsCard label="نشطة" value={stats?.active} icon={CheckCircle} color="green" delay={0.05} />
          <StatsCard label="منتهية" value={stats?.expired} icon={XCircle} color="red" delay={0.1} />
          <StatsCard label="تنتهي قريباً" value={stats?.expiringSoon} icon={AlertTriangle} color="amber" delay={0.15} />
        </div>
      </div>

      {/* Projects Stats */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">مشاريع العملاء</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="إجمالي المشاريع" value={projectStats?.total} icon={Globe} color="blue" delay={0} />
          <StatsCard label="نشطة" value={projectStats?.active} icon={CheckCircle} color="green" delay={0.05} />
          <StatsCard label="تنتهي قريباً" value={projectStats?.expiringSoon} icon={AlertTriangle} color="amber" delay={0.1} />
          <StatsCard label="صيانة منتهية" value={projectStats?.maintenanceExpired} icon={Wrench} color="red" delay={0.15} />
        </div>
      </div>

      {/* Urgent Projects */}
      {urgentProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">مشاريع تحتاج انتباه</h2>
              <p className="text-xs text-gray-400 mt-0.5">دومين أو صيانة على وشك الانتهاء</p>
            </div>
            <Link href="/dashboard/projects" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              عرض الكل <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {urgentProjects.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">التجديدات القادمة</h2>
            <p className="text-xs text-gray-400 mt-0.5">مرتبة حسب تاريخ التجديد</p>
          </div>
          <Link href="/dashboard/services" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            عرض الكل <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} onEdit={(svc: unknown) => setEditTarget(svc as Service)} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="تعديل الخدمة">
        {/* @ts-ignore */}
        {editTarget && <ServiceForm initial={editTarget} onSubmit={handleEdit} loading={loading} />}
      </Modal>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl border border-gray-100">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Server size={20} className="text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-600">لا توجد خدمات بعد</p>
      <p className="text-xs text-gray-400 mt-1">أضف خدمتك السحابية الأولى للبدء</p>
      <Link href="/dashboard/add" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
        إضافة خدمة
      </Link>
    </motion.div>
  );
}
