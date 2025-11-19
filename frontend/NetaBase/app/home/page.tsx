import Home from "@/app/home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NetaBase | Home",
  description: "Explore profiles and ratings of political leaders in Nepal",
};

export default function Page() {
  return <Home />;
}