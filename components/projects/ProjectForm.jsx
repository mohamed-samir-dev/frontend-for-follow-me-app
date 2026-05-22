"use client";
import { useState } from "react";

const fields = [
  { name: "clientName", label: "اسم العميل", type: "text", required: true, placeholder: "مثال: أحمد محمد" },
  { name: "projectName", label: "اسم المشروع", type: "text", required: true, placeholder: "مثال: موقع شركة X" },
  { name: "domain", label: "الدومين", type: "text", placeholder: "example.com" },
  { name: "renewalDate", label: "تاريخ تجديد الدومين", type: "date" },
  { name: "maintenanceEndDate", label: "انتهاء الصيانة المجانية", type: "date" },
  { name: "notes", label: "ملاحظات", type: "textarea", placeholder: "أي ملاحظات إضافية..." },
];

export function ProjectForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    clientName: initial.clientName || "",
    projectName: initial.projectName || "",
    domain: initial.domain || "",
    renewalDate: initial.renewalDate ? initial.renewalDate.slice(0, 10) : "",
    maintenanceEndDate: initial.maintenanceEndDate ? initial.maintenanceEndDate.slice(0, 10) : "",
    notes: initial.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(({ name, label, type, required, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
          {type === "textarea" ? (
            <textarea
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              placeholder={placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          ) : (
            <input
              type={type}
              required={required}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "جاري الحفظ..." : initial._id ? "حفظ التعديلات" : "إضافة المشروع"}
      </button>
    </form>
  );
}
