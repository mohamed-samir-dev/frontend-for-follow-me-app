"use client";
import { useEffect, useState } from "react";
import { getBackups, createBackup, updateBackup, deleteBackup } from "@/lib/api";
import { DatabaseBackup, Plus, Trash2, CheckCircle2, Circle, CalendarClock } from "lucide-react";

function daysLeft(date) {
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
}

function statusBadge(date, done) {
  if (done) return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓ تم</span>;
  const d = daysLeft(date);
  if (d < 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">متأخر</span>;
  if (d === 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">اليوم!</span>;
  if (d <= 2) return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">بعد {d} يوم</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">بعد {d} يوم</span>;
}

export default function BackupPage() {
  const [backups, setBackups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", backupDate: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await getBackups();
    setBackups(data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createBackup(form);
    setForm({ title: "", backupDate: "", notes: "" });
    setShowForm(false);
    await load();
    setLoading(false);
  };

  const toggleDone = async (b) => {
    await updateBackup(b._id, { done: !b.done });
    await load();
  };

  const handleDelete = async (id) => {
    await deleteBackup(id);
    await load();
  };

  const pending = backups.filter((b) => !b.done);
  const done = backups.filter((b) => b.done);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <DatabaseBackup size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">النسخ الاحتياطي</h1>
            <p className="text-sm text-gray-400">مواعيد الباك اب القادمة</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} /> إضافة موعد
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">العنوان</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مثال: باك اب قاعدة البيانات"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">التاريخ</label>
            <input
              required
              type="date"
              value={form.backupDate}
              onChange={(e) => setForm({ ...form, backupDate: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">ملاحظات (اختياري)</label>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="أي تفاصيل إضافية..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">إلغاء</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      )}

      {/* Pending */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">قادمة ({pending.length})</p>
        {pending.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            <CalendarClock size={32} className="mx-auto mb-2 opacity-30" />
            لا يوجد مواعيد قادمة
          </div>
        )}
        {pending.map((b) => (
          <div key={b._id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
            <button onClick={() => toggleDone(b)} className="text-gray-300 hover:text-green-500 transition">
              <Circle size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{b.title}</p>
              {b.notes && <p className="text-xs text-gray-400 truncate">{b.notes}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{new Date(b.backupDate).toLocaleDateString("ar-EG")}</span>
              {statusBadge(b.backupDate, b.done)}
            </div>
            <button onClick={() => handleDelete(b._id)} className="text-gray-300 hover:text-red-500 transition">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Done */}
      {done.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">مكتملة ({done.length})</p>
          {done.map((b) => (
            <div key={b._id} className="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 opacity-60">
              <button onClick={() => toggleDone(b)} className="text-green-500 hover:text-gray-300 transition">
                <CheckCircle2 size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 line-through">{b.title}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(b.backupDate).toLocaleDateString("ar-EG")}</span>
              <button onClick={() => handleDelete(b._id)} className="text-gray-300 hover:text-red-500 transition">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
