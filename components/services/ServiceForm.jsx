"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const typeOptions = [
  { value: "", label: "اختر النوع..." },
  { value: "Hosting", label: "استضافة" },
  { value: "Database", label: "قاعدة بيانات" },
  { value: "Storage", label: "تخزين" },
  { value: "SaaS", label: "SaaS" },
  { value: "CDN", label: "CDN" },
  { value: "Auth", label: "مصادقة" },
  { value: "Other", label: "أخرى" },
];

const planOptions = [
  { value: "Free", label: "مجاني" },
  { value: "Pro", label: "احترافي" },
  { value: "Enterprise", label: "مؤسسي" },
  { value: "Custom", label: "مخصص" },
];

const defaultForm = { name: "", type: "", email: "", plan: "Free", renewalDate: "", notes: "" };

export function ServiceForm({ initial = null, onSubmit, loading }) {
  const [form, setForm] = useState(initial || defaultForm);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.type) e.type = "النوع مطلوب";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="اسم الخدمة *"
          placeholder="مثال: Cloudinary"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
        <Select
          label="النوع *"
          options={typeOptions}
          value={form.type}
          onChange={(e) => set("type", e.target.value)}
          error={errors.type}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="البريد / اسم المستخدم"
          placeholder="account@email.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <Select
          label="الخطة"
          options={planOptions}
          value={form.plan}
          onChange={(e) => set("plan", e.target.value)}
        />
      </div>
      <Input
        label="تاريخ التجديد"
        type="date"
        value={form.renewalDate ? form.renewalDate.split("T")[0] : ""}
        onChange={(e) => set("renewalDate", e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">ملاحظات</label>
        <textarea
          rows={3}
          placeholder="موقع مفتاح API، معلومات الفوترة، ملاحظات الاستخدام..."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
        />
      </div>
      <div className="flex justify-start gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "جارٍ الحفظ..." : initial ? "تحديث الخدمة" : "إضافة الخدمة"}
        </Button>
      </div>
    </form>
  );
}
