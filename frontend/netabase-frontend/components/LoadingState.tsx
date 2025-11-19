import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-[#0a0b10] via-[#0f1118] to-[#0a0b10] text-gray-300">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-10 h-10 text-blue-500" />
      </motion.div>
      <p className="mt-4 text-lg">Loading politician details...</p>
    </div>
  );
}