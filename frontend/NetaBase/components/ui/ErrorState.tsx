import { AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

export default function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10] text-gray-200 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
      >
        <ArrowLeft size={18} /> Back
      </button>
    </div>
  );
}