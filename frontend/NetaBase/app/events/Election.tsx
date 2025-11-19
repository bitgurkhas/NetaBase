"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit = ({ value, label }: TimeUnitProps) => (
  <div className="flex flex-col items-center">
    <div className="relative w-20 h-20 md:w-24 md:h-24">
      <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50"></div>
      <div className="absolute inset-0.5 bg-linear-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center">
        <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-400 tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
    </div>
    <span className="text-slate-300 text-xs md:text-sm font-semibold mt-3 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

export default function NepalElectionCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const targetDate = new Date("2026-03-05T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      setCurrentTime(new Date());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          🇳🇵 Nepal Election 2026
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          General Election - March 5, 2026
        </p>

        {/* Countdown */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Countdown to Election
          </h2>
          <p className="text-slate-400 mb-10">
            Time remaining until Nepal's General Election
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </div>

          <div className="mt-10 w-full bg-slate-700 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-500 to-red-600 transition-all duration-1000"
              style={{ width: `${(timeLeft.seconds / 60) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Time */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 shadow-lg inline-block">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
            Current Time
          </p>
          <p className="text-2xl font-bold text-cyan-400 font-mono">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {currentTime.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}