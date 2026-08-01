"use client";

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
export default function PermitView({ permit, requiresPassword }: { permit: any, requiresPassword: boolean }) {
  const [isUnlocked, setIsUnlocked] = useState(!requiresPassword);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch(`/api/permit/${permit.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsUnlocked(true);
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-[#ffffff] p-8 rounded shadow-sm border border-[#e5e7eb] w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-[#111827] mb-2">تصريح محمي</h2>
          <p className="text-[#6b7280] text-sm mb-6">الرجاء إدخال كلمة المرور لعرض هذا التصريح.</p>

          <form onSubmit={handleUnlock} className="space-y-4 text-right">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#d1d5db] rounded text-left"
              dir="ltr"
              placeholder="Password"
              required
            />
            {error && <p className="text-[#ef4444] text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#00602b] text-[#ffffff] font-medium py-2 rounded hover:bg-[#004d22] disabled:opacity-50"
            >
              {isVerifying ? "جاري التحقق..." : "فتح التصريح"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Format Dates
  const issueStr = format(new Date(permit.issueDate), "yyyy-MM-dd");
  const expiryStr = format(new Date(permit.expiryDate), "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-[#efeff0] flex flex-col" style={{ fontFamily: "'Frutiger Arabic', Arial, sans-serif" }} dir="rtl">

      {/* --- WEB UI --- */}

      {/* Top Navbar - Ajeer logo on left (LTR visual), MLSD on right (LTR visual) */}
      <header className="bg-[#ffffff] px-[24px] py-4 h-[70px] flex justify-between items-center relative z-10">
        {/* In RTL: first child = visually RIGHT side */}

        <div className="flex items-center">
          <Image src="/logos/ajeer-logo.png" alt="Ajeer" width={40} height={40} className="object-contain" />
        </div>
        <div className="flex items-center">
          <Image src="/logos/mlsd-logo.png" alt="Ministry" width={104} height={32} className="object-contain" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full bg-[#f7f8f7] max-w-[1398px] mx-auto py-12 px-4 flex flex-col items-center">

        {/* Web Document Container */}
        <div className="w-full bg-[#fbfcfb] border border-[#cfd3d8] max-w-[1024px]">

          {/* Header Box — RTL: col-1=right, col-2=center, col-3=left */}
          {/* Target: RIGHT=logos, CENTER=title, LEFT=status */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_200px] border border-[#cfd3d8] mb-10 items-stretch bg-white">

            {/* Col-1 (visually RIGHT in RTL): Logos — MLSD + Ajeer */}
            <div className="flex h-[126px] items-center justify-center p-4 border-b md:border-b-0 md:border-l border-[#cfd3d8] gap-6">
              <Image src="/logos/mlsd-logo.png" alt="Ministry" width={172} height={40} className="object-contain" />
              <Image src="/logos/ajeer-logo.png" alt="Ajeer" width={74} height={35} className="object-contain" />
            </div>

            {/* Col-2 (CENTER): Title */}
            <div className="flex h-[126px] items-center justify-center p-6 border-b md:border-b-0 md:border-l border-[#cfd3d8]">
              <h1 className="text-[30px] font-bold text-[#071017]">التحقق من تصريح أجير</h1>
            </div>

            {/* Col-3 (visually LEFT in RTL): Status */}
            <div className="flex h-[126px] items-center justify-center p-6">
              <span className="text-[#176747] font-bold text-lg">ساري / فعال</span>
            </div>
          </div>

          {/* Success message */}
          <div className="text-center text-[#071017] mb-10 font-medium">
            تم التحقق من التصريح بنجاح
          </div>

          {/* Tables Container */}
          <div className="px-4">
            <div className="w-full border border-[#cfd3d8] text-[#071017] text-sm text-center font-medium bg-[#fbfcfb]">

              {/* Permit Data */}
              <div className="bg-[#e9eeee] py-3 font-bold border-b border-[#cfd3d8]">
                بيانات التصريح
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">رقم التصريح</div>
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center justify-center bg-white">{permit.permitNumber}</div>
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">نوع التصريح</div>
                <div className="p-3 border-b border-[#cfd3d8] flex items-center justify-center bg-white">{permit.permitType}</div>

                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">تاريخ بداية التصريح</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center justify-center bg-white">{issueStr}</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">تاريخ نهاية التصريح</div>
                <div className="p-3 border-[#cfd3d8] flex items-center justify-center bg-white">{expiryStr}</div>
              </div>
            </div>

            <div className="w-full border-x border-b border-[#cfd3d8] text-[#071017] text-sm text-center font-medium bg-[#fbfcfb]">
              {/* Worker Data */}
              <div className="bg-[#e9eeee] py-3 font-bold border-b border-[#cfd3d8]">
                بيانات العامل
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">اسم العامل</div>
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center justify-center uppercase bg-white">{permit.workerName}</div>
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">رقم الهوية / الإقامة</div>
                <div className="p-3 border-b border-[#cfd3d8] flex items-center justify-center bg-white">{permit.idNumber}</div>

                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">الجنسية</div>
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center justify-center bg-white">{permit.nationality}</div>
                <div className="p-3 border-b md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">المهنة</div>
                <div className="p-3 border-b border-[#cfd3d8] flex items-center justify-center bg-white">{permit.profession}</div>

                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">الجنس</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center justify-center bg-white">{permit.gender || "-"}</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">تاريخ الميلاد</div>
                <div className="p-3 text-[#111827] flex items-center justify-center bg-white">{permit.dob || "-"}</div>
              </div>
            </div>

            <div className="w-full border-x border-b border-[#cfd3d8] text-[#071017] text-sm text-center font-medium bg-[#fbfcfb]">
              {/* Facility Data */}
              <div className="bg-[#e9eeee] py-3 font-bold border-b border-[#cfd3d8]">
                بيانات المنشأة
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">رقم المنشأة</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center justify-center bg-white">{permit.facilityNumber}</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#cfd3d8] flex items-center bg-[#e9eeee] justify-center">اسم المنشأة</div>
                <div className="p-3 flex items-center justify-center bg-white">{permit.facilityName}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#ffffff] border-t border-[#e5e7eb] py-8 mt-auto text-sm w-full">
        <div className="w-full px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-6">

          {/* FIRST child in DOM = visually RIGHT in RTL: Nav links + contact */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start gap-8 md:gap-12 text-right">

            <div className="flex flex-col gap-2 text-[#4b5563] w-[200px]">
              <span className="font-bold text-[#071017] text-sm mb-1">أجير</span>
              <span>عن أجير</span>
              <span>خدمات أجير</span>
            </div>

            <div className="flex flex-col gap-2 text-[#4b5563] w-[200px]">
              <span className="font-bold text-[#071017] text-sm mb-1">الدعم</span>
              <span>الدعم والمساعدة</span>
              <span>الأسئلة الشائعة</span>
            </div>
            <div className="flex flex-col gap-2 text-[#4b5563] w-[200px]">
              <span className="font-bold text-[#071017] text-sm mb-1">الشروط والخصوصية</span>
              <span>الشروط والأحكام</span>
              <span>سياسة الخصوصية</span>
            </div>
            <div className="flex flex-col gap-2 text-[#4b5563] w-[200px]">
              <span className="font-bold text-[#071017] text-sm mb-1">تواصل معنا</span>
              <div className="flex gap-4 items-center justify-start">
                <a href="#" className="text-[#6b7280] hover:text-[#071017] flex items-center justify-center">
                  <Image src="/x-twitter.svg" alt="X" width={16} height={16} />
                </a>
                <a href="#" className="text-[#6b7280] hover:text-[#071017] flex items-center justify-center">
                  <Image src="/plane.svg" alt="Send" width={16} height={16} />
                </a>
                <a href="#" className="text-[#6b7280] hover:text-[#071017] flex items-center justify-center">
                  <Image src="/Phone.svg" alt="Phone" width={16} height={16} />
                </a>
              </div>
            </div>

          </div>

          {/* LAST child in DOM = visually LEFT in RTL: Partner logos */}
          <div className="flex flex-wrap items-center gap-6 md:justify-end">
            <Image src="/logos/mlsd-logo.png" alt="Ministry" width={150} height={50} className="object-contain" />
            <Image src="/logos/takamol-logo.png" alt="Takamol" width={90} height={50} className="object-contain" />
            <Image src="/logos/tamkeen-logo-1.svg" alt="Tamkeen" width={150} height={50} className="object-contain" />
            <Image src="/logos/digital-govt-auth-logo.svg" alt="DGA" width={300} height={84} className="object-contain" />


          </div>

        </div>
      </footer>
    </div>
  );
}
