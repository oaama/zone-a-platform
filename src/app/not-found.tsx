import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center flex flex-col items-center gap-5">
      <p className="font-heading text-7xl font-bold text-za-primary">404</p>
      <h1 className="font-heading text-2xl font-bold">الصفحة مش موجودة</h1>
      <p className="text-[#5A6378]">اللينك ده مش شغال أو الصفحة اتنقلت.</p>
      <Link href="/" className="bg-za-primary hover:bg-za-secondary transition text-white rounded-full px-6 py-3 text-sm font-semibold">
        الرئيسية
      </Link>
    </div>
  );
}
