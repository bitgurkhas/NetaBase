"use client";

import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import api from '@/services/api';

interface Party {
  id: number;
  name: string;
  short_name?: string;
  slug: string;
  flag?: string;
  politician_count: number;
}

interface Politician {
  slug: string;
  name: string;
  photo: string;
  age: number;
  average_rating: number;
  rated_by: number;
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
  const [selectedPartyPoliticians, setSelectedPartyPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPoliticians, setLoadingPoliticians] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParties();
  }, []);

  // Fetch all parties
  const fetchParties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<PartiesResponse>('/api/parties/');
      setParties(response.data.results || []);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? (err.response as any)?.data?.detail || 'Failed to fetch parties'
        : 'Failed to fetch parties';
      setError(errorMessage);
      console.error('Error fetching parties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch politicians of a party
  const fetchPartyPoliticians = async (slug: string) => {
    try {
      setLoadingPoliticians(true);

      const response = await api.get<PoliticiansResponse>(`/api/parties/${slug}/politicians/`);
      setSelectedPartyPoliticians(response.data.results || []);
    } catch (err) {
      console.error('Error fetching politicians:', err);
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
    const colors = ['#FF6B35', '#1E88E5', '#7C3AED', '#DC2626', '#F59E0B', '#10B981'];
    return colors[id % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading parties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-red-500/20 rounded-xl p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">Error Loading Parties</h2>
          <p className="text-gray-400 text-center mb-4">{error}</p>
          <button
            onClick={fetchParties}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Political Parties</h1>
          <p className="text-gray-400 text-lg">Explore the major political parties in Nepal</p>
          <div className="h-1 w-24 bg-linear-to-r from-pink-500 to-pink-600 rounded-full mt-6"></div>
        </div>

        {/* Party Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {parties.map((party) => {
            const partyColor = getPartyColor(party.id);
            return (
              <div
                key={party.id}
                onClick={() => handlePartyClick(party)}
                className="group cursor-pointer bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
              >
                {/* Color Bar */}
                <div className="h-1 w-full" style={{ backgroundColor: partyColor }}></div>

                {/* Party Logo */}
                <div className="h-64 flex items-center justify-center overflow-hidden bg-slate-800 group-hover:scale-105 transition-transform duration-300">
                  {party.flag ? (
                    <img
                      src={party.flag}
                      alt={party.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl font-bold text-gray-600">{party.name.charAt(0)}</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg leading-tight mb-1">{party.name}</h3>
                      {party.short_name && (
                        <p className="text-gray-400 text-sm">{party.short_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Members */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-gray-400 text-sm">Politicians</span>
                    <span className="text-white font-bold">{party.politician_count}</span>
                  </div>

                  {/* Button */}
                  <button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                    View Profile
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selectedParty && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => {
              setSelectedParty(null);
              setSelectedPartyPoliticians([]);
            }}
          >
            <div
              className="bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-800 p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="flex gap-6 mb-6">
                  <div className="shrink-0 w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center bg-slate-800">
                    {selectedParty.flag ? (
                      <img
                        src={selectedParty.flag}
                        alt={selectedParty.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-5xl font-bold text-gray-600">
                        {selectedParty.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedParty.name}</h2>
                    <div className="flex gap-2 mb-4">
                      {selectedParty.short_name && (
                        <span
                          className="px-4 py-1 rounded-full text-white font-bold"
                          style={{ backgroundColor: getPartyColor(selectedParty.id) }}
                        >
                          {selectedParty.short_name}
                        </span>
                      )}
                      <span className="px-4 py-1 rounded-full bg-slate-800 text-gray-200">
                        {selectedParty.politician_count} politicians
                      </span>
                    </div>
                  </div>
                </div>

                {/* Politicians Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">Politicians</h3>

                  {loadingPoliticians ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-2" />
                      <p className="text-gray-400">Loading politicians...</p>
                    </div>
                  ) : selectedPartyPoliticians.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPartyPoliticians.map((politician) => (
                        <div
                          key={politician.slug}
                          className="bg-slate-800 rounded-lg p-4 flex gap-4 items-center hover:bg-slate-700 transition-colors duration-200"
                        >
                          <img
                            src={politician.photo}
                            alt={politician.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{politician.name}</h4>
                            <p className="text-gray-400 text-sm">Age: {politician.age}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-yellow-500 text-sm">
                                ★ {politician.average_rating.toFixed(1)}
                              </span>
                              <span className="text-gray-500 text-xs">
                                ({politician.rated_by} ratings)
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      No politicians found for this party.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedParty(null);
                    setSelectedPartyPoliticians([]);
                  }}
                  className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}