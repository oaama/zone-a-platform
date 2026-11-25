import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5">
      <Image
        src="/logo-icon-color.png"
        alt="ZONE A"
        width={64}
        height={64}
        className="animate-pulse drop-shadow-[0_8px_24px_rgba(69,51,139,0.35)]"
        priority
      />
      <span className="w-7 h-7 rounded-full border-2 border-[#E5E8F0] border-t-za-primary animate-spin" />
    </div>
  );
}
