import {
  Star,
  User,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { PoliticianInfoProps } from "@/types/politician";


export default function PoliticianInfo({ politician }: PoliticianInfoProps) {
  const renderRating = () => {
    if (!politician.average_rating) return null;
    
    const rating = parseFloat(politician.average_rating.toString());
    if (isNaN(rating) || rating === 0) return null;

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 backdrop-blur-md w-fit px-4 py-2 rounded-2xl font-bold shadow-lg"
      >
        <Star className="fill-yellow-400" size={18} />
        <span>{rating.toFixed(1)}</span>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
      style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)" }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {politician.photo && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <img
              src={politician.photo}
              alt={politician.name}
              className="w-48 h-48 object-cover rounded-3xl shadow-2xl border-4 border-white/20"
            />
            <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        )}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-5xl font-bold text-white tracking-tight">
              {politician.name}
            </h1>
            {politician.party_name && (
              <p className="text-xl font-medium text-blue-400 mt-1">
                {politician.party_name}
              </p>
            )}
          </div>

          {renderRating()}
        </div>
      </div>

      {politician.biography && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-white mb-3">Biography</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            {politician.biography}
          </p>
        </motion.div>
      )}

      {politician.previous_party_history && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 backdrop-blur-md bg-linear-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-5"
        >
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Previous Party History
          </h3>
          <p className="text-gray-300">{politician.previous_party_history}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {politician.age && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <User className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Age</p>
                <p className="text-xl font-bold text-white">{politician.age}</p>
              </div>
            </div>
          )}

          {politician.location && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <MapPin className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-xl font-bold text-white">{politician.location}</p>
              </div>
            </div>
          )}

          {politician.party_position && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 md:col-span-2">
              <Briefcase className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Party Position</p>
                <p className="text-xl font-bold text-white">
                  {politician.party_position}
                </p>
              </div>
            </div>
          )}

          {politician.education && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="text-blue-400" size={20} />
                <p className="text-sm text-gray-400">Education</p>
              </div>
              <ul className="space-y-2 ml-8 list-disc text-white marker:text-blue-400">
                {politician.education
                  .split(/\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((edu, i) => (
                    <li key={i} className="text-base leading-relaxed">
                      {edu}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {(politician.criminal_record || politician.criticism) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 backdrop-blur-md bg-red-900/20 border border-red-500/30 rounded-2xl"
        >
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Concerns
          </h3>

          {politician.criminal_record && (
            <div className="mb-3">
              <p className="font-semibold text-red-300">Criminal Record</p>
              <ul className="space-y-1 mt-1 ml-6 list-disc text-gray-300 marker:text-red-400">
                {politician.criminal_record
                  .split(/\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((record, i) => (
                    <li key={i}>{record}</li>
                  ))}
              </ul>
            </div>
          )}

          {politician.criticism && (
            <div>
              <p className="font-semibold text-yellow-300">Public Criticism</p>
              <ul className="space-y-1 mt-1 ml-6 list-disc text-gray-300 marker:text-yellow-400">
                {politician.criticism
                  .split(/\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((crit, i) => (
                    <li key={i}>{crit}</li>
                  ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {politician.is_active !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            politician.is_active 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              politician.is_active ? 'bg-green-400' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium">
              {politician.is_active ? 'Currently Active' : 'Inactive'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}