import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function PoliticalPartiesSection() {
  const [parties, setParties] = useState([
    {
      id: 1,
      name: 'Nepal Communist Party (Unified)',
      abbr: 'NCP',
      color: '#FF6B35',
      members: 245,
      logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvectorseek.com%2Fwp-content%2Fuploads%2F2023%2F06%2FNepal-Communist-Party-Logo-Vector.jpg&f=1&nofb=1&ipt=10f46ee6de2a4c0bf881948874b6b30230e4784e8c5b047fd65f4a3a101507c2',
      description: 'Marxist-Leninist ideology'
    },
    {
      id: 2,
      name: 'Nepali Congress',
      abbr: 'NC',
      color: '#1E88E5',
      members: 198,
      logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvectorseek.com%2Fwp-content%2Fuploads%2F2023%2F06%2FNepali-Congress-Symbol-Logo-Vector.jpg&f=1&nofb=1&ipt=b59c3301e9a7351850d274c4cae6f1a5064efc5680e6780261f0e4594f4ab67d',
      description: 'Liberal democratic party'
    },
    {
      id: 3,
      name: 'Rastriya Janata Party',
      abbr: 'RJP',
      color: '#7C3AED',
      members: 156,
      logo: 'https://via.placeholder.com/150?text=RJP',
      description: 'Federalist party'
    },
    {
      id: 4,
      name: 'CPN Maoist Center',
      abbr: 'CPNMC',
      color: '#DC2626',
      members: 134,
      logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F3%2F35%2FLogo_of_the_Communist_Party_of_Nepal_(Maoist_Centre).png%3F20220804080654&f=1&nofb=1&ipt=d705e04bb243864cd77d2a6cdd159bf9589515d77f5cc66210cc0b87df4d3d2d',
      description: 'Socialist ideology'
    },
    {
      id: 5,
      name: 'Rastriya Samajbadi Party',
      abbr: 'RSP',
      color: '#F59E0B',
      members: 112,
      logo: 'https://via.placeholder.com/150?text=RSP',
      description: 'Socialist party'
    },
    {
      id: 6,
      name: 'Janata Dal',
      abbr: 'JD',
      color: '#10B981',
      members: 89,
      logo: 'https://via.placeholder.com/150?text=JD',
      description: 'Democratic party'
    }
  ]);

  const [selectedParty, setSelectedParty] = useState(null);

  return (
    <div className="min-h-screen bg-black px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Political Parties</h1>
          <p className="text-gray-400 text-lg">Explore the major political parties contesting in Nepal</p>
          <div className="h-1 w-24 bg-linear-to-r from-pink-500 to-pink-600 rounded-full mt-6"></div>
        </div>

        {/* Party Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {parties.map((party) => (
            <div
              key={party.id}
              onClick={() => setSelectedParty(party)}
              className="group cursor-pointer bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
            >
              {/* Color Bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: party.color }}
              ></div>

              {/* Party Logo */}
              <div
                className="h-64 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300"
              >
                <img 
                  src={party.logo} 
                  alt={party.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{party.name}</h3>
                    <p className="text-gray-400 text-sm">{party.description}</p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-white font-bold text-sm"
                    style={{ backgroundColor: party.color }}
                  >
                    {party.abbr}
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-gray-400 text-sm">Members</span>
                  <span className="text-white font-bold">{party.members}</span>
                </div>

                {/* Button */}
                <button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                  View Profile
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedParty && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => setSelectedParty(null)}
          >
            <div
              className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-800 p-8 max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-6">
                <div
                  className="shrink-0 w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: `${selectedParty.color}15` }}
                >
                  <img 
                    src={selectedParty.logo} 
                    alt={selectedParty.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedParty.name}</h2>
                  <div className="flex gap-2 mb-4">
                    <span
                      className="px-4 py-1 rounded-full text-white font-bold"
                      style={{ backgroundColor: selectedParty.color }}
                    >
                      {selectedParty.abbr}
                    </span>
                    <span className="px-4 py-1 rounded-full bg-slate-800 text-gray-200">
                      {selectedParty.members} members
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{selectedParty.description}</p>
                  <button
                    onClick={() => setSelectedParty(null)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}