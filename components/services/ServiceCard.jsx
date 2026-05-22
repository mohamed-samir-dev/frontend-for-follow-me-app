"use client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import {
  Cloud, Database, HardDrive, Layers, Globe, Shield, MoreVertical,
  Calendar, Mail, ChevronDown, ChevronUp, Pencil, Trash2
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const typeIcons = {
  Hosting: Globe,
  Database: Database,
  Storage: HardDrive,
  SaaS: Layers,
  CDN: Cloud,
  Auth: Shield,
  Other: Layers,
};

const typeColors = {
  Hosting: "bg-blue-50 text-blue-600",
  Database: "bg-green-50 text-green-600",
  Storage: "bg-purple-50 text-purple-600",
  SaaS: "bg-orange-50 text-orange-600",
  CDN: "bg-cyan-50 text-cyan-600",
  Auth: "bg-pink-50 text-pink-600",
  Other: "bg-gray-50 text-gray-600",
};

const typeLabels = {
  Hosting: "استضافة",
  Database: "قاعدة بيانات",
  Storage: "تخزين",
  SaaS: "SaaS",
  CDN: "CDN",
  Auth: "مصادقة",
  Other: "أخرى",
};

const statusLabels = {
  active: "نشطة",
  expired: "منتهية",
  "expiring-soon": "تنتهي قريباً",
};

export function ServiceCard({ service, onEdit, onDelete, index }) {
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const Icon = typeIcons[service.type] || Layers;

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
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", typeColors[service.type])}>
            <Icon size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
            <p className="text-xs text-gray-400">{typeLabels[service.type] || service.type}</p>
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
                onClick={() => { onEdit(service); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Pencil size={13} /> تعديل
              </button>
              <button
                onClick={() => { onDelete(service._id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} /> حذف
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge label={statusLabels[service.status] || service.status} variant={service.status} />
        <Badge label={service.plan} variant={service.plan} />
      </div>

      {/* Info */}
      <div className="space-y-2">
        {service.email && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail size={12} className="text-gray-300" />
            <span className="truncate">{service.email}</span>
          </div>
        )}
        {service.renewalDate && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} className={cn(service.status === "expiring-soon" ? "text-amber-400" : "text-gray-300")} />
            <span className={cn(service.status === "expiring-soon" && "text-amber-600 font-medium")}>
              {format(new Date(service.renewalDate), "dd MMM yyyy", { locale: arSA })}
            </span>
          </div>
        )}
      </div>

      {/* Notes toggle */}
      {service.notes && (
        <div className="mt-4 pt-3 border-t border-gray-50">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showNotes ? "إخفاء الملاحظات" : "عرض الملاحظات"}
          </button>
          {showNotes && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 leading-relaxed"
            >
              {service.notes}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}
