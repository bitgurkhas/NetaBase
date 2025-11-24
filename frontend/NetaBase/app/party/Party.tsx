"use client";

import { useState, useEffect } from "react";
import { ChevronRight, AlertCircle, Users, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";
import { SkeletonPartiesPage } from "@/components/ui/SkeletonLoader";
import { Politician } from "@/types";

interface Party {
  id: number;
  name: string;
  short_name?: string;
  slug: string;
  flag?: string;
  politician_count: number;
}

interface PartiesResponse {
  results?: Party[];
}

interface PoliticiansResponse {
  results?: Politician[];
}

export default function PoliticalPartiesSection() {
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [selectedPartyPoliticians, setSelectedPartyPoliticians] = useState<
    Politician[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPoliticians, setLoadingPoliticians] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<PartiesResponse>("/api/parties/");
      setParties(response.data.results || []);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err.response as any)?.data?.detail || "Failed to fetch parties"
          : "Failed to fetch parties";
      setError(errorMessage);
      console.error("Error fetching parties:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartyPoliticians = async (slug: string) => {
    try {
      setLoadingPoliticians(true);

      const response = await api.get<PoliticiansResponse>(
        `/api/parties/${slug}/politicians/`
      );
      setSelectedPartyPoliticians(response.data.results || []);
    } catch (err) {
      console.error("Error fetching politicians:", err);
      setSelectedPartyPoliticians([]);
    } finally {
      setLoadingPoliticians(false);
    }
  };

  const handlePartyClick = async (party: Party) => {
    setSelectedParty(party);
    await fetchPartyPoliticians(party.slug);
  };

  const getPartyColor = (id: number): string => {
    const colors = [
      "#FF6B35",
      "#1E88E5",
      "#7C3AED",
      "#DC2626",
      "#F59E0B",
      "#10B981",
    ];
    return colors[id % colors.length];
  };

  if (loading) {
    return <SkeletonPartiesPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-red-500/20 rounded-xl p-6 sm:p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-2">
            Error Loading Parties
          </h2>
          <p className="text-gray-400 text-center mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchParties}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-3 sm:px-4 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-16"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-pink-500 flex-shrink-0" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Political Parties
            </h1>
          </div>
          <p className="text-gray-400 text-base sm:text-lg">
            Explore the major political parties in Nepal
          </p>
          <div className="h-1 w-24 bg-linear-to-r from-pink-500 to-pink-600 rounded-full mt-4 sm:mt-6"></div>
        </motion.div>

        {/* Party Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-16">
          {parties.map((party, idx) => {
            const partyColor = getPartyColor(party.id);
            return (
              <motion.div
                key={party.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handlePartyClick(party)}
                className="group cursor-pointer"
              >
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-pink-500 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/30 h-full flex flex-col"
                >
                  {/* Color Bar */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: partyColor }}
                  ></div>

                  {/* Party Logo - Enhanced */}
                  <div className="h-48 sm:h-64 md:h-72 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black group-hover:scale-110 transition-transform duration-500 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    {party.flag ? (
                      <motion.img
                        src={party.flag}
                        alt={party.name}
                        className="w-full h-full object-cover relative z-10"
                        whileHover={{ scale: 1.15 }}
                      />
                    ) : (
                      <div
                        className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-600 relative z-10 drop-shadow-lg"
                        style={{ color: partyColor + "40" }}
                      >
                        {party.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-2 line-clamp-2">
                        {party.name}
                      </h3>
                      {party.short_name && (
                        <p
                          className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full inline-block"
                          style={{ backgroundColor: partyColor + "20", color: partyColor }}
                        >
                          {party.short_name}
                        </p>
                      )}
                    </div>

                    {/* Members */}
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-800 mt-3 sm:mt-4">
                      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                        <Users size={14} className="sm:w-4 sm:h-4" />
                        <span>Politicians</span>
                      </div>
                      <span
                        className="font-bold text-base sm:text-lg"
                        style={{ color: partyColor }}
                      >
                        {party.politician_count}
                      </span>
                    </div>

                    {/* Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-pink-600/50 text-sm sm:text-base"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selectedParty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-3 sm:px-4 backdrop-blur-sm"
            onClick={() => {
              setSelectedParty(null);
              setSelectedPartyPoliticians([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl max-w-4xl w-full border border-pink-500/30 p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 sm:mb-6">
                {/* Close Button for Mobile */}
                <div className="flex justify-end mb-4 sm:hidden">
                  <button
                    onClick={() => {
                      setSelectedParty(null);
                      setSelectedPartyPoliticians([]);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6 sm:mb-8 items-start">
                  {/* Enhanced Party Logo in Modal */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="shrink-0 w-32 sm:w-40 h-32 sm:h-40 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-800 to-black shadow-xl border-2"
                    style={{ borderColor: getPartyColor(selectedParty.id) + "40" }}
                  >
                    {selectedParty.flag ? (
                      <img
                        src={selectedParty.flag}
                        alt={selectedParty.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="text-5xl sm:text-7xl font-bold drop-shadow-lg"
                        style={{ color: getPartyColor(selectedParty.id) + "60" }}
                      >
                        {selectedParty.name.charAt(0)}
                      </div>
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
                      {selectedParty.name}
                    </h2>
                    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
                      {selectedParty.short_name && (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-white font-bold shadow-lg text-sm sm:text-base"
                          style={{
                            backgroundColor: getPartyColor(selectedParty.id),
                          }}
                        >
                          {selectedParty.short_name}
                        </motion.span>
                      )}
                      <span className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-slate-800 text-gray-200 flex items-center gap-2 font-semibold text-sm sm:text-base">
                        <Users size={14} className="sm:w-4 sm:h-4" />
                        {selectedParty.politician_count} politicians
                      </span>
                    </div>
                  </div>
                </div>

                {/* Politicians Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-700"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                    <Users size={20} className="sm:w-6 sm:h-6 text-pink-500" />
                    Politicians
                  </h3>

                  {loadingPoliticians ? (
                    <div className="text-center py-12">
                      <div className="inline-block">
                        <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-400 mt-4 text-sm sm:text-base">
                        Loading politicians...
                      </p>
                    </div>
                  ) : selectedPartyPoliticians.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {selectedPartyPoliticians.map((politician, idx) => (
                        <motion.div
                          key={politician.slug}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4 items-center hover:shadow-lg transition-all duration-200 border border-slate-700 hover:border-pink-500/50 group cursor-pointer"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={politician.photo}
                              alt={politician.name}
                              className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-pink-500 transition-colors"
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ backgroundColor: getPartyColor(selectedParty.id) }}
                            >
                              ★
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm sm:text-base group-hover:text-pink-400 transition-colors line-clamp-1">
                              {politician.name}
                            </h4>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              Age: {politician.age}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className="text-xs sm:text-sm font-bold px-2 py-1 rounded whitespace-nowrap"
                                style={{
                                  backgroundColor: getPartyColor(selectedParty.id) + "20",
                                  color: getPartyColor(selectedParty.id),
                                }}
                              >
                                ★ {politician.average_rating ?? 0}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-12 text-base sm:text-lg">
                      No politicians found for this party.
                    </p>
                  )}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedParty(null);
                    setSelectedPartyPoliticians([]);
                  }}
                  className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-bold shadow-lg hover:shadow-pink-600/50 text-sm sm:text-base"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}