"use client";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { arSA } from "date-fns/locale";
import { Globe, Calendar, Wrench, MoreVertical, Pencil, Trash2, User, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "نشط", class: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  "expiring-soon": { label: "ينتهي قريباً", class: "bg-amber-50 text-amber-700 border-amber-100" },
  expired: { label: "منتهي", class: "bg-red-50 text-red-700 border-red-100" },
};

function DaysChip({ date, label }) {
  if (!date) return null;
  const days = differenceInDays(new Date(date), new Date());
  const isExpired = days < 0;
  const isSoon = days >= 0 && days <= 14;
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border",
      isExpired ? "bg-red-50 text-red-600 border-red-100" :
      isSoon ? "bg-amber-50 text-amber-600 border-amber-100" :
      "bg-gray-50 text-gray-500 border-gray-100"
    )}>
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">
        {isExpired ? `منذ ${Math.abs(days)} يوم` : days === 0 ? "اليوم!" : `${days} يوم`}
      </span>
    </div>
  );
}

export function ProjectCard({ project, index, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const domainStatus = statusConfig[project.status] || statusConfig.active;
  const maintStatus = statusConfig[project.maintenanceStatus] || statusConfig.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Globe size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">{project.projectName}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <User size={11} className="text-gray-300" />
              <p className="text-xs text-gray-400">{project.clientName}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-400 transition-all"
          >
            <MoreVertical size={15} />
          </button>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden min-w-[130px]"
            >
              <button
                onClick={() => { onEdit(project); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Pencil size={13} /> تعديل
              </button>
              <button
                onClick={() => { onDelete(project._id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} /> حذف
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Domain */}
      {project.domain && (
        <a
          href={project.domain.startsWith("http") ? project.domain : `https://${project.domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 mb-3 group/link"
        >
          <ExternalLink size={11} />
          <span className="truncate group-hover/link:underline">{project.domain}</span>
        </a>
      )}

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={cn("text-xs px-2.5 py-1 rounded-lg border font-medium", domainStatus.class)}>
          دومين: {domainStatus.label}
        </span>
        <span className={cn("text-xs px-2.5 py-1 rounded-lg border font-medium", maintStatus.class)}>
          صيانة: {maintStatus.label}
        </span>
      </div>

      {/* Dates */}
      <div className="space-y-2">
        {project.renewalDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>تجديد الدومين</span>
            </div>
            <div className="flex items-center gap-2">
              <DaysChip date={project.renewalDate} label="بعد" />
              <span className="text-xs text-gray-400">
                {format(new Date(project.renewalDate), "dd MMM yyyy", { locale: arSA })}
              </span>
            </div>
          </div>
        )}
        {project.maintenanceEndDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Wrench size={12} />
              <span>انتهاء الصيانة</span>
            </div>
            <div className="flex items-center gap-2">
              <DaysChip date={project.maintenanceEndDate} label="بعد" />
              <span className="text-xs text-gray-400">
                {format(new Date(project.maintenanceEndDate), "dd MMM yyyy", { locale: arSA })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {project.notes && (
        <div className="mt-4 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2.5 leading-relaxed">{project.notes}</p>
        </div>
      )}
    </motion.div>
  );
}
