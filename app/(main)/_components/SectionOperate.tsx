// app/_components/SectionOperate.tsx
import Image from "next/image";
import Link from "next/link";

export default function SectionOperate() {
  return (
    <section id="operate" className="w-full bg-white py-28">
      <div className="mx-auto max-w-6xl px-[10%] sm:px-[8%] md:px-8 lg:px-6">
        {/* 상단 타이틀 영역 */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
              What We
              <br />
              Operate
            </h2>
          </div>

          <div className="md:col-span-8 flex items-start justify-end">
            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
              니즈퍼샌드는 사용자 서비스, 토큰 유틸리티, 참여 프로그램이
              명확한 운영 흐름으로 연결된 구조를 운영합니다.
              <br />
              각 구성 요소는 분리된 목적을 가지며 하나의 핵심 주제 아래 개발·운영됩니다.
            </p>
          </div>
        </div>

        {/* 카드 3개 */}
        <div className="mt-20 grid grid-cols-1 gap-16 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* 카드 1 - 사용자 서비스 */}
          <div className="text-center">
            <div className="relative aspect-square w-full">
              {/* 배경 카드 - 가로세로 동일, 모바일에서 축소 */}
              <div className="absolute left-1/2 top-1/2 w-[54%] -translate-x-1/2 -translate-y-1/2 aspect-square rounded-[200px] overflow-hidden md:w-[62%]">
                <Image
                  src="/images/hero/s2-bg-1.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              {/* 메인 오브젝트 - 배경 위로 2/3 올라감 */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-end justify-center pb-[15%]">
                <Image
                  src="/images/hero/s2-object-1.png"
                  alt=""
                  width={180}
                  height={220}
                  className="object-contain"
                />
              </div>
              {/* 소아이콘 - 배경 위 우측 상단, 모바일에서 확대 */}
              <div className="absolute right-4 top-3 z-20 flex gap-2 md:right-6 md:top-4">
                <Image
                  src="/images/hero/s2-sicon-1.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 object-contain md:h-8 md:w-8"
                />
                <Image
                  src="/images/hero/s2-sicon-1-2.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 object-contain md:h-8 md:w-8"
                />
              </div>
            </div>

            <h3 className="mt-0.5 text-2xl font-bold leading-tight text-[#333333] md:text-2xl md:font-semibold lg:text-3xl">
              TOMATOK
            </h3>

            <p className="mt-4 text-sm font-normal leading-relaxed text-[#333333] md:text-base">
              토마톡은 사용자 간 소통을 중심으로 설계된
              <br />
              커뮤니케이션 서비스입니다.
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-[#666666] md:text-base">
              현재 다운로드 후 사용 가능하며,
              <br />
              실제 사용자 대상 서비스로 운영 중입니다.
            </p>

            <Link href="#" className="mt-4 inline-block text-sm font-normal text-[#333333] hover:opacity-70 md:text-base">
              토마톡 바로가기 →
            </Link>
          </div>

          {/* 카드 2 - 유틸리티 토큰 */}
          <div className="text-center">
            <div className="relative aspect-square w-full">
              <div className="absolute left-1/2 top-1/2 w-[54%] -translate-x-1/2 -translate-y-1/2 aspect-square rounded-[200px] overflow-hidden md:w-[62%]">
                <Image
                  src="/images/hero/s2-bg-2.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-end justify-center pb-[20%]">
                <Image
                  src="/images/hero/s2-object-2.png"
                  alt=""
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
              <div className="absolute right-4 top-3 z-20 md:right-6 md:top-4">
                <Image
                  src="/images/hero/s2-sicon-2.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-10 w-10 rounded-[50px] object-contain md:h-8 md:w-8"
                />
              </div>
            </div>

            <h3 className="mt-0.5 text-2xl font-bold leading-tight text-[#333333] md:text-2xl md:font-semibold lg:text-3xl">
            TOTT TOKEN
            </h3>

            <p className="mt-4 text-sm font-normal leading-relaxed text-[#333333] md:text-base">
              TOTT는 토마톡 서비스 운영을 지원하기 위해
              <br />
              설계된 유틸리티 토큰입니다.
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-[#666666] md:text-base">
              온체인에 배포되어 있으며,
              <br />
              서비스 구조 내에서 역할을 수행합니다.
            </p>

            <Link href="#" className="mt-4 inline-block text-sm font-normal text-[#333333] hover:opacity-70 md:text-base">
              TOTT 바로가기 →
            </Link>
          </div>

          {/* 카드 3 - 토큰 참여 프로그램 */}
          <div className="text-center">
            <div className="relative aspect-square w-full">
              <div className="absolute left-1/2 top-1/2 w-[54%] -translate-x-1/2 -translate-y-1/2 aspect-square rounded-[200px] overflow-hidden md:w-[62%]">
                <Image
                  src="/images/hero/s2-bg-3.png"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-end justify-center pb-[15%]">
                <Image
                  src="/images/hero/s2-object-3.png"
                  alt=""
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="absolute right-4 top-3 z-20 md:right-6 md:top-4">
                <Image
                  src="/images/hero/s2-sicon-3.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain md:h-10 md:w-10"
                />
              </div>
            </div>

            <h3 className="mt-0.5 text-2xl font-bold leading-tight text-[#333333] md:text-2xl md:font-semibold lg:text-3xl">
              TOTT STAKING
            </h3>

            <p className="mt-4 text-sm font-normal leading-relaxed text-[#333333] md:text-base">
              스테이킹 프로그램은 TOTT 토큰을 기반으로 한
              <br />
              참여 메커니즘입니다.
            </p>
            <p className="mt-2 text-sm font-normal leading-relaxed text-[#666666] md:text-base">
              프로그램은 실제로 운영 중이며,
              <br />
              기능 수행 목적의 구조로 설계되었습니다.
            </p>

            <Link href="#" className="mt-4 inline-block text-sm font-normal text-[#333333] hover:opacity-70 md:text-base">
              스테이킹 바로가기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
