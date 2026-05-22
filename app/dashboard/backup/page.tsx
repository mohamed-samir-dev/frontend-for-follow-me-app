"use client";
import { useEffect, useState } from "react";
import { getBackups, createBackup, updateBackup, deleteBackup } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  DatabaseBackup, Plus, Trash2, CheckCircle2, Circle, ExternalLink,
  FileText, HardDrive, Archive, Layers, CalendarClock, Link2, StickyNote,
  Pencil, X, Check
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { arSA } from "date-fns/locale";

const typeConfig = {
  database: { label: "قاعدة بيانات", icon: HardDrive, color: "bg-blue-50 text-blue-600 border-blue-100" },
  files: { label: "ملفات", icon: FileText, color: "bg-purple-50 text-purple-600 border-purple-100" },
  full: { label: "نسخة كاملة", icon: Archive, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  other: { label: "أخرى", icon: Layers, color: "bg-gray-50 text-gray-600 border-gray-100" },
};

function StatusBadge({ date, done }: { date: string; done: boolean }) {
  if (done) return <span className="text-xs px-2.5 py-1 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100 font-medium">✓ تم</span>;
  const d = differenceInDays(new Date(date), new Date());
  if (d < 0) return <span className="text-xs px-2.5 py-1 rounded-lg border bg-red-50 text-red-700 border-red-100 font-medium">متأخر {Math.abs(d)} يوم</span>;
  if (d === 0) return <span className="text-xs px-2.5 py-1 rounded-lg border bg-orange-50 text-orange-700 border-orange-100 font-medium">اليوم!</span>;
  if (d <= 3) return <span className="text-xs px-2.5 py-1 rounded-lg border bg-yellow-50 text-yellow-700 border-yellow-100 font-medium">بعد {d} يوم</span>;
  return <span className="text-xs px-2.5 py-1 rounded-lg border bg-blue-50 text-blue-600 border-blue-100 font-medium">بعد {d} يوم</span>;
}

interface Backup {
  _id: string;
  title: string;
  backupDate: string;
  notes?: string;
  link?: string;
  type: "database" | "files" | "full" | "other";
  done: boolean;
}

const emptyForm = { title: "", backupDate: "", notes: "", link: "", type: "database" };

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await getBackups();
    setBackups(data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editId) {
      await updateBackup(editId, form);
      setEditId(null);
    } else {
      await createBackup(form);
    }
    setForm(emptyForm);
    setShowForm(false);
    await load();
    setLoading(false);
  };

  const startEdit = (b: Backup) => {
    setForm({
      title: b.title,
      backupDate: b.backupDate.split("T")[0],
      notes: b.notes || "",
      link: b.link || "",
      type: b.type || "database",
    });
    setEditId(b._id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const toggleDone = async (b: Backup) => {
    await updateBackup(b._id, { done: !b.done });
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteBackup(id);
    await load();
  };

  const pending = backups.filter((b) => !b.done);
  const done = backups.filter((b) => b.done);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <DatabaseBackup size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">النسخ الاحتياطي</h1>
            <p className="text-sm text-gray-400">{pending.length} موعد قادم · {done.length} مكتمل</p>
          </div>
        </div>
        <button
          onClick={() => { cancelForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} /> إضافة موعد
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-700">{editId ? "تعديل الموعد" : "موعد جديد"}</p>
              <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">العنوان</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: باك اب قاعدة البيانات"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">التاريخ</label>
                <input
                  required
                  type="date"
                  value={form.backupDate}
                  onChange={(e) => setForm({ ...form, backupDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">النوع</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {Object.entries(typeConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">رابط (اختياري)</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">ملاحظات (اختياري)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="أي تفاصيل إضافية..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={cancelForm} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">إلغاء</button>
              <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                <Check size={14} /> {loading ? "جاري الحفظ..." : editId ? "تحديث" : "حفظ"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Pending */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">قادمة ({pending.length})</p>
        {pending.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            <CalendarClock size={32} className="mx-auto mb-2 opacity-30" />
            لا يوجد مواعيد قادمة
          </div>
        )}
        <AnimatePresence>
          {pending.map((b, i) => (
            <BackupCard key={b._id} b={b} index={i} onToggle={toggleDone} onDelete={handleDelete} onEdit={startEdit} />
          ))}
        </AnimatePresence>
      </div>

      {/* Done */}
      {done.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">مكتملة ({done.length})</p>
          <AnimatePresence>
            {done.map((b, i) => (
              <BackupCard key={b._id} b={b} index={i} onToggle={toggleDone} onDelete={handleDelete} onEdit={startEdit} isDone />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function BackupCard({
  b, index, onToggle, onDelete, onEdit, isDone = false
}: {
  b: Backup; index: number;
  onToggle: (b: Backup) => void;
  onDelete: (id: string) => void;
  onEdit: (b: Backup) => void;
  isDone?: boolean;
}) {
  const type = typeConfig[b.type] || typeConfig.other;
  const TypeIcon = type.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group ${isDone ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle */}
        <button
          onClick={() => onToggle(b)}
          className={`mt-0.5 flex-shrink-0 transition ${isDone ? "text-emerald-500 hover:text-gray-300" : "text-gray-300 hover:text-emerald-500"}`}
        >
          {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <p className={`text-sm font-semibold text-gray-900 ${isDone ? "line-through text-gray-400" : ""}`}>{b.title}</p>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border ${type.color}`}>
              <TypeIcon size={11} /> {type.label}
            </span>
            <StatusBadge date={b.backupDate} done={b.done} />
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
            <CalendarClock size={12} />
            <span>{format(new Date(b.backupDate), "dd MMMM yyyy", { locale: arSA })}</span>
          </div>

          {/* Link */}
          {b.link && (
            <a
              href={b.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline mb-2 w-fit"
            >
              <Link2 size={12} />
              <span className="truncate max-w-[280px]">{b.link}</span>
              <ExternalLink size={10} />
            </a>
          )}

          {/* Notes */}
          {b.notes && (
            <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl px-3 py-2 mt-1">
              <StickyNote size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">{b.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
          <button onClick={() => onEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(b._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
