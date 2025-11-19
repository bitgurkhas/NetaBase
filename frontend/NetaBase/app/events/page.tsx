import NepalElectionCountdown from "@/app/events/Election";

export const metadata = {
  title: "Events",
  description: "Countdown to Nepal's General Election on March 5, 2026",
};

export default function Page() {
  return <NepalElectionCountdown />;
}