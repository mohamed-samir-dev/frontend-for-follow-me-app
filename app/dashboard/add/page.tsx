"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { createService } from "@/lib/api";
import { ServiceForm } from "@/components/services/ServiceForm";
import toast from "react-hot-toast";

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (form: unknown) => {
    setLoading(true);
    try {
      await createService(form);
      setSuccess(true);
      toast.success("تمت إضافة الخدمة بنجاح!");
      setTimeout(() => router.push("/dashboard/services"), 1200);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || "فشل إضافة الخدمة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
      >
        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">تمت الإضافة!</p>
            <p className="text-sm text-gray-400 mt-1">جارٍ التحويل...</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">خدمة سحابية جديدة</h2>
              <p className="text-sm text-gray-400 mt-1">تتبع اشتراك أو حساب أو خدمة سحابية جديدة</p>
            </div>
            <ServiceForm onSubmit={handleSubmit} loading={loading} />
          </>
        )}
      </motion.div>
    </div>
  );
}
