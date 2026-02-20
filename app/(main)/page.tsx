import Hero from "../../components/sections/Hero";
import SectionGovernance from "./_components/SectionGovernance";
import SectionOperate from "./_components/SectionOperate";
import SectionVision from "./_components/SectionVision";
import UpdatesSection from "./_components/UpdatesSection";

export default function Home() {
  return (
    <main className="-mt-20">
      <Hero />
      <SectionOperate />
      <SectionVision />
      <SectionGovernance />
      <UpdatesSection />
    </main>
  );
}
