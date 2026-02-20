import Image from "next/image";

export default function SectionVision() {
  return (
    <section id="vision" className="w-full bg-[#f5f2ed] py-28">
      <div className="mx-auto max-w-6xl px-[10%] sm:px-[8%] md:px-8 lg:px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-[100px] md:gap-y-12">
          {/* LEFT: Vision & Strategy / Why Blockchain */}
          <div className="md:col-span-5">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
              Vision <span className="text-orange-500">&amp;</span> Strategy
            </h2>
            <p className="mt-6 text-base font-semibold text-neutral-800">Why Blockchain</p>
            <div className="mt-8 space-y-6 text-sm leading-7 text-neutral-600 md:text-base">
              <p>
                블록체인은 서비스의 신뢰성과 투명성을 보완하기 위한 기술적 선택입니다.
                니즈퍼샌드는 실제 운영에서 의미 있는 역할을 할 때에만,
                필요한 영역에 제한적으로 블록체인을 적용합니다.
              </p>
              <p>
                니즈퍼샌드는 사용자가 실제로 활용할 수 있는 디지털 서비스를 통해
                기술이 일상의 가치와 연결된 환경을 만드는 것을 목표로 합니다.
              </p>
            </div>
          </div>

          {/* RIGHT: 01, 02, 03 numbered points with icons */}
          <div className="flex flex-col gap-12 md:col-span-7 md:gap-16">
            <div className="flex gap-[10px]">
              <div className="flex items-center gap-3">
                <span className="text-lg font-light text-neutral-400 md:text-xl">01</span>
                <Image
                  src="/images/hero/s3-icon-1.png"
                  alt=""
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-800 md:text-xl">
                  Stable Service Operation
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 md:text-base">
                  현재 운영 중인 서비스를 안정적으로 유지하며,
                  <br />
                  지속적인 점검과 개선을 통해 서비스 품질을 관리합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-[10px]">
              <div className="flex items-center gap-3">
                <span className="text-lg font-light text-neutral-400 md:text-xl">02</span>
                <Image
                  src="/images/hero/s3-icon-2.png"
                  alt=""
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-800 md:text-xl">
                  User-Centered Enhancement
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 md:text-base">
                  사용자 경험을 기반으로 기능을 분석하고,
                  <br />
                  실제 사용 흐름에 맞게 기능을 지속적으로 개선합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-[10px]">
              <div className="flex items-center gap-3">
                <span className="text-lg font-light text-neutral-400 md:text-xl">03</span>
                <Image
                  src="/images/hero/s3-icon-3.png"
                  alt=""
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-800 md:text-xl">
                  Integrated Token Architecture
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 md:text-base">
                  서비스 흐름과 분리할 수 없는 구조를 기반으로,
                  <br />
                  사용 과정 전반에 자연스럽게 연결된 토큰 시스템을 설계합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
