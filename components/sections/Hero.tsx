import Image from "next/image";
const features = ["Stability", "User Focus", "Integration"];
const ICON_SRC = "/images/icons/hero-moon-icon.png";
export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* 배경 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#dfeeff] via-white to-[#fde7dd]" />

            <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-32 pb-20 md:grid-cols-2 md:pt-36 md:pb-28">
                {/* 좌측 오브젝트(합쳐진 이미지 추천) */}
                <div className="relative flex justify-center">
                    {/* 메인 오렌지 (고정, 가운데) */}
                    <Image
                        src="/images/hero/hero-orange.png"
                        alt=""
                        width={350}
                        height={350}
                        priority
                        className="relative z-10 w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] lg:max-w-[350px]"
                    />

                    {/* float 오브젝트 (겹쳐서 둥둥) */}
                    <Image
                        src="/images/hero/float-all.png"
                        alt=""
                        width={520}
                        height={520}
                        priority
                        className="absolute inset-0 w-full max-w-[520px] animate-float-all"
                    />
                </div>


                {/* 우측 텍스트 */}
                <div className="md:pl-6">
                    <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight text-neutral-800 md:text-[56px]">
                        Operationally Proven
                        <br />
                        Infrastructure
                    </h1>


                    <div className="mt-8 space-y-5 text-[15px] leading-7 text-neutral-700">
                        <p>
                            니즈퍼샌드는 사용자 서비스를 중심으로, 블록체인 기술이 적용된 서비스를 개발·운영하고 있습니다.
                        </p>
                        <p>
                            개념이나 실험 단계에 머무르지 않고, 실제 사용 가능한 서비스와 토큰 인프라를 안정적으로 운영하는 데
                            집중합니다.
                        </p>
                        <p>
                            서비스의 지속 가능성과 운영 안정성을 핵심 기준으로 삼으며, 블록체인 기술은 서비스 구조 전반에서 필요한
                            기능을 수행합니다.
                        </p>
                    </div>

                    {/* 하단 키워드 */}
                    <div className="mt-10 flex flex-wrap gap-8 text-sm text-neutral-700">
                        {features.map((item) => (
                            <span key={item} className="inline-flex items-center gap-2">
                                <Image
                                    src={ICON_SRC}
                                    alt=""
                                    width={12}
                                    height={12}
                                />
                                {item}
                            </span>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
