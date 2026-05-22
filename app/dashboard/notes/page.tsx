"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote } from "lucide-react";

const COLORS = [
  "bg-yellow-50 border-yellow-200",
  "bg-blue-50 border-blue-200",
  "bg-green-50 border-green-200",
  "bg-pink-50 border-pink-200",
  "bg-purple-50 border-purple-200",
];

const initialNotes = [
  { id: 1, text: "تجديد اشتراك AWS في نهاية الشهر — لا تنسَ تحديث بطاقة الدفع.", color: COLORS[0] },
  { id: 2, text: "مفتاح API الخاص بـ Cloudinary محفوظ في ملف .env.local — لا ترفعه على GitHub!", color: COLORS[1] },
  { id: 3, text: "خطة Vercel المجانية تسمح بـ 100GB bandwidth شهرياً، راقب الاستهلاك.", color: COLORS[2] },
  { id: 4, text: "قاعدة بيانات MongoDB Atlas — النسخة الاحتياطية التلقائية تعمل كل يوم الساعة 3 صباحاً.", color: COLORS[3] },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(initialNotes);
  const [newText, setNewText] = useState("");

  const addNote = () => {
    if (!newText.trim()) return;
    setNotes((prev) => [
      { id: Date.now(), text: newText.trim(), color: COLORS[prev.length % COLORS.length] },
      ...prev,
    ]);
    setNewText("");
  };

  const deleteNote = (id: number) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="space-y-6">
      {/* Add note */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote size={18} className="text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">ملاحظة جديدة</h2>
        </div>
        <textarea
          rows={3}
          placeholder="اكتب ملاحظتك هنا..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) addNote(); }}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">Ctrl + Enter للإضافة السريعة</p>
          <button
            onClick={addNote}
            disabled={!newText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={15} /> إضافة
          </button>
        </div>
      </div>

      {/* Notes grid */}
      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <StickyNote size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">لا توجد ملاحظات بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative rounded-2xl border p-5 group ${note.color}`}
              >
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-3 left-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
