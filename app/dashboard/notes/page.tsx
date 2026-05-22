"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote, Bell, BellOff, Loader2 } from "lucide-react";
import { getNotes, createNote, deleteNote } from "@/lib/api";

const COLORS = ["yellow", "blue", "green", "pink", "purple"];
const COLOR_MAP: Record<string, string> = {
  yellow: "bg-yellow-50 border-yellow-200",
  blue: "bg-blue-50 border-blue-200",
  green: "bg-green-50 border-green-200",
  pink: "bg-pink-50 border-pink-200",
  purple: "bg-purple-50 border-purple-200",
};

type Note = { _id: string; text: string; color: string; reminderDate?: string; notified?: boolean };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotes()
      .then((r) => setNotes(r.data))
      .finally(() => setLoading(false));
  }, []);

  const addNote = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    try {
      const { data } = await createNote({
        text: newText.trim(),
        color: COLORS[colorIdx],
        reminderDate: reminderDate || null,
      });
      setNotes((prev) => [data, ...prev]);
      setNewText("");
      setReminderDate("");
    } finally {
      setSaving(false);
    }
  };

  const removeNote = async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

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

        <div className="flex flex-wrap items-center gap-3 mt-3">
          {/* Color picker */}
          <div className="flex gap-1.5">
            {COLORS.map((c, i) => (
              <button
                key={c}
                onClick={() => setColorIdx(i)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${COLOR_MAP[c].split(" ")[0].replace("bg-", "bg-").replace("50", "300")} ${colorIdx === i ? "border-gray-600 scale-110" : "border-transparent"}`}
              />
            ))}
          </div>

          {/* Reminder date */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <Bell size={14} className="text-gray-400 shrink-0" />
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 mr-auto">
            <p className="text-xs text-gray-400 hidden sm:block">Ctrl + Enter للإضافة</p>
            <button
              onClick={addNote}
              disabled={!newText.trim() || saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} />}
              إضافة
            </button>
          </div>
        </div>
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-blue-400" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <StickyNote size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">لا توجد ملاحظات بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative rounded-2xl border p-5 group ${COLOR_MAP[note.color] ?? COLOR_MAP.yellow}`}
              >
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pr-1">{note.text}</p>

                {note.reminderDate && (
                  <div className={`flex items-center gap-1 mt-3 text-xs ${note.notified ? "text-gray-400" : "text-blue-600"}`}>
                    {note.notified ? <BellOff size={12} /> : <Bell size={12} />}
                    {new Date(note.reminderDate).toLocaleString("ar-EG", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                    {note.notified && <span className="mr-1 text-gray-400">(تم الإرسال)</span>}
                  </div>
                )}

                <button
                  onClick={() => removeNote(note._id)}
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
