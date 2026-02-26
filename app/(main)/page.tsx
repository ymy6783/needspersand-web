import Hero from "../../components/sections/Hero";
import SectionGovernance from "./_components/SectionGovernance";
import SectionOperate from "./_components/SectionOperate";
import SectionTimeline from "./_components/SectionTimeline";
import SectionVision from "./_components/SectionVision";
import UpdatesSection from "./_components/UpdatesSection";

/** Vercel 캐시 비활성화: 뉴스 등록 후 메인에 바로 반영 */
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="-mt-20">
      <Hero />
      <SectionOperate />
      <SectionVision />
      <SectionGovernance />
      <UpdatesSection />
      <SectionTimeline />
    </main>
  );
}
