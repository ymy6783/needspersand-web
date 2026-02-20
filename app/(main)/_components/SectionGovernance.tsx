export default function SectionGovernance() {
  return (
    <section
      id="governance"
      className="relative w-full overflow-hidden py-28"
      style={{
        background: "linear-gradient(90deg, #FF4500 0%, #FFA600 50%, #FF4500 100%)",
        backgroundSize: "200% 100%",
        animation: "gradientWave 8s ease-in-out infinite",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-center gap-16 px-[10%] sm:px-[8%] md:flex-row md:items-center md:gap-24 md:px-8 lg:px-6">
        {/* LEFT: Governance Responsibility */}
        <div className="md:w-1/3">
          <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            Governance
            <br />
            Responsibility
          </h2>
        </div>

        {/* RIGHT: 한국어 설명 + 불릿 3개 */}
        <div className="md:w-2/3">
          <p className="text-sm leading-7 text-white md:text-base">
            니즈퍼샌드는 서비스, 토큰 인프라 및 관련 프로그램의 기획·개발·운영에 대한
            단일 책임 주체입니다. 모든 공식 정보는 회사가 운영하는 지정된 채널을 통해
            제공됩니다.
          </p>
          <ul className="mt-8 space-y-2 text-sm leading-5 text-white md:text-base">
            <li className="flex gap-2 [&>span:first-child]:mt-[0.35em]">
              <span className="h-1.5 min-h-[6px] w-1.5 shrink-0 rounded-full bg-white" />
              <span>니즈퍼샌드는 사용자 자산을 보관하거나 대리 관리하지 않습니다</span>
            </li>
            <li className="flex gap-2 [&>span:first-child]:mt-[0.35em]">
              <span className="h-1.5 min-h-[6px] w-1.5 shrink-0 rounded-full bg-white" />
              <span>사용자는 서비스 및 블록체인 기능을 본인의 판단 하에 이용합니다</span>
            </li>
            <li className="flex gap-2 [&>span:first-child]:mt-[0.35em]">
              <span className="h-1.5 min-h-[6px] w-1.5 shrink-0 rounded-full bg-white" />
              <span>토큰 관련 정보는 정보 제공 목적에 한해 제공됩니다</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
