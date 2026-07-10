"use client";

import AuthGuard from "@/components/shared/AuthGuard";
import ProfileSidebar from "@/components/shared/ProfileSidebar";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <AuthGuard>
      <div className="flex-grow bg-slate-50/30 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar */}
            <ProfileSidebar />

            {/* Main Content */}
            <div className="flex-grow w-full space-y-6">
              <h1 className="text-2xl font-black text-slate-900">Profile</h1>

              {/* Profile Card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-md space-y-5">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200">
                  <Image
                    src="/images/Ellipse.png"
                    alt={user?.name || "User"}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Info */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Name</span>
                    <span className="text-sm font-bold text-slate-800">
                      {user?.name || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Email</span>
                    <span className="text-sm font-bold text-slate-800">
                      {user?.email || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Nomor Handphone</span>
                    <span className="text-sm font-bold text-slate-800">
                      {user?.phone || "-"}
                    </span>
                  </div>
                </div>

                {/* Update Button */}
                <Button className="w-full bg-[#C12116] hover:bg-[#C12116]/90 text-white font-bold h-11 rounded-full mt-2">
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
