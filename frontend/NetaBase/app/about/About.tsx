"use client";

import {
  Users,
  Heart,
  Shield,
  BookOpen,
  Scale,
  Image,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About{" "}
            <span className="bg-linear-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              NetaBase
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Know Your Leaders, Shape Your Nation.
          </p>
        </div>

        {/* Mission & Independence  */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-pink-600 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-pink-600/20 p-3 rounded-lg">
                  <Heart className="text-pink-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                To create a transparent, citizen-driven space where public
                opinion matters. We aim to foster civic engagement, promote
                accountability, and encourage constructive dialogue about the
                performance of political leaders in Nepal.
              </p>
            </div>

            {/* Independence */}
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-blue-600 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <Shield className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  We Are Independent
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                <span className="text-white font-semibold">
                  NetaBase is completely independent.
                </span>{" "}
                We are not funded by, associated with, or influenced by any
                political party, leader, or organization. Our only commitment is
                to the Nepali people and the democratic process.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimers  */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
            <span className="bg-linear-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Disclaimers
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Generated Content */}
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-pink-600 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-pink-600/20 p-3 rounded-lg">
                  <Users className="text-pink-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  User Generated Content
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The content on this website is crowd-sourced and opinion-based.
                The ratings and reviews reflect the personal views of individual
                users, not those of NetaBase.
              </p>
            </div>

            {/* Political Neutrality */}
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-blue-600 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <Shield className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  Political Neutrality
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We do not endorse, support, or promote any political candidate
                or party.
              </p>
            </div>

            {/* Educational Purpose */}
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-green-600 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <BookOpen className="text-green-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  Educational Purpose
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Our platform is intended solely for educational, informational,
                and civic engagement purposes.
              </p>
            </div>

            {/* Media Attribution */}
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800 hover:border-purple-600 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <Image className="text-purple-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  Media Attribution
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Our site includes images sourced from online platforms for
                illustrative purposes only. The views expressed are those of the
                public contributors and do not necessarily reflect the views of
                any affiliated organizations.
              </p>
            </div>

            {/* Constitutional Basis */}
            <div className="md:col-span-2 bg-linear-to-br from-amber-950/30 to-gray-950 rounded-xl p-6 border border-amber-900/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-600/20 p-3 rounded-lg">
                  <Scale className="text-amber-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  Constitutional Basis
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                This platform is operated pursuant to{" "}
                <span className="text-amber-400 font-semibold">
                  Article 17 of the Constitution of Nepal
                </span>
                , in lawful exercise of the right to freedom of opinion and
                expression, subject to the reasonable restrictions prescribed by
                law to safeguard national sovereignty, public order, and social
                harmony.
              </p>
              <p className="text-gray-500 text-sm mt-3">
                Ref: Article 17, Article 19 ETA (Article 57) & Privacy Law
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-linear-to-r from-pink-600/20 to-blue-600/20 rounded-2xl p-8 sm:p-12 border border-pink-600/50">
            <CheckCircle className="text-pink-600 mx-auto mb-4" size={48} />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Join the Movement
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              Your voice matters. Rate politicians, share your opinions, and
              contribute to a more accountable democracy in Nepal.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-linear-to-r from-pink-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-pink-600/50 transition-all duration-300"
            >
              Start Rating Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}