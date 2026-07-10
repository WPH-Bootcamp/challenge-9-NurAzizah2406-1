import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left side - Full image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <Image
          src="/images/BigSizeBurger.png"
          alt="Appetizing Burger"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
