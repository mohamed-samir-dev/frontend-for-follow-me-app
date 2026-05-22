"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Search, Users, CheckCircle, AlertTriangle, Wrench } from "lucide-react";
import { getProjects, getProjectStats, createProject, updateProject, deleteProject } from "@/lib/api";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Modal } from "@/components/ui/Modal";
import { StatsCard } from "@/components/services/StatsCard";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [p, s] = await Promise.all([getProjects({ search }), getProjectStats()]);
      setProjects(p.data);
      setStats(s.data);
    } catch {
      toast.error("تعذر تحميل المشاريع");
    }
  };

  useEffect(() => { fetchData(); }, [search]);

  const handleAdd = async (form) => {
    setLoading(true);
    try {
      await createProject(form);
      toast.success("تم إضافة المشروع!");
      setShowAdd(false);
      fetchData();
    } catch {
      toast.error("فشل الإضافة");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (form) => {
    if (!editTarget) return;
    setLoading(true);
    try {
      await updateProject(editTarget._id, form);
      toast.success("تم تحديث المشروع!");
      setEditTarget(null);
      fetchData();
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("حذف هذا المشروع؟")) return;
    try {
      await deleteProject(id);
      toast.success("تم الحذف");
      fetchData();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="إجمالي المشاريع" value={stats?.total} icon={Globe} color="blue" delay={0} />
        <StatsCard label="نشطة" value={stats?.active} icon={CheckCircle} color="green" delay={0.05} />
        <StatsCard label="تنتهي قريباً" value={stats?.expiringSoon} icon={AlertTriangle} color="amber" delay={0.1} />
        <StatsCard label="صيانة منتهية" value={stats?.maintenanceExpired} icon={Wrench} color="red" delay={0.15} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم العميل أو المشروع..."
            className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          إضافة مشروع
        </button>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <ProjectCard
              key={p._id}
              project={p}
              index={i}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="إضافة مشروع جديد">
        <ProjectForm onSubmit={handleAdd} loading={loading} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="تعديل المشروع">
        {editTarget && <ProjectForm initial={editTarget} onSubmit={handleEdit} loading={loading} />}
      </Modal>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16 bg-white rounded-2xl border border-gray-100"
    >
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Users size={20} className="text-indigo-400" />
      </div>
      <p className="text-sm font-medium text-gray-600">لا توجد مشاريع بعد</p>
      <p className="text-xs text-gray-400 mt-1">أضف مشاريع عملائك لمتابعة التجديدات والصيانة</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus size={14} /> إضافة مشروع
      </button>
    </motion.div>
  );
}
