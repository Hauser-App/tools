import dynamic from "next/dynamic";

const HauserEQDashboard = dynamic(
  () => import("../components/HauserEQDashboard"),
  { ssr: false }
);

export default function Home() {
  return <HauserEQDashboard />;
}
