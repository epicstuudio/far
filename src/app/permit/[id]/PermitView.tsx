"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

export default function PermitView({ permit, requiresPassword }: { permit: any, requiresPassword: boolean }) {
  const [isUnlocked, setIsUnlocked] = useState(!requiresPassword);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const permitRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    setPublicUrl(window.location.href);
  }, []);

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

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    
    // Allow React to render the PDF container
    setTimeout(async () => {
      if (!pdfRef.current) {
        setIsGeneratingPdf(false);
        return;
      }
      try {
        const canvas = await html2canvas(pdfRef.current, { 
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY, // Fixes cropping
        });
        // Use JPEG with 0.8 quality to drastically reduce file size from ~10MB to < 500KB
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Ajeer-Permit-${permit.permitNumber}.pdf`);
      } catch (err) {
        console.error("PDF generation failed", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 200);
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
    <div className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col" dir="rtl">
      
      {/* 
        PDF Generator Container (Hidden visually unless generating)
        We use absolute positioning to keep it out of the normal document flow.
      */}
      <div className={`absolute top-0 right-0 w-full bg-[#e5e7eb] flex justify-center z-[9999] ${isGeneratingPdf ? 'opacity-100 pb-20' : 'opacity-0 pointer-events-none fixed top-[-10000px]'}`}>
        <div ref={pdfRef} className="w-[794px] min-h-[1123px] bg-[#ffffff] p-10 font-sans text-[#111827] flex flex-col shadow-2xl mt-8" dir="rtl">
          
          {/* Header Box */}
          <div className="border border-[#d1d5db] flex justify-between items-center p-4">
            {/* Right: Logos */}
            <div className="flex items-center gap-4 w-1/3">
              <div className="text-right leading-tight border-l border-[#d1d5db] pl-4">
                <div className="text-[10px] text-[#2563eb] font-bold">الموارد البشرية</div>
                <div className="text-[10px] text-[#2563eb] font-bold">والتنمية الاجتماعية</div>
              </div>
              <div className="text-2xl font-bold text-[#00602b] leading-none text-center">
                أجير<br/><span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Ajeer</span>
              </div>
            </div>
            
            {/* Center: Title */}
            <div className="w-1/3 text-center text-xl font-bold text-[#111827]">
              تصريح أجير – تعاقد أجير
            </div>
            
            {/* Left: QR Code */}
            <div className="w-1/3 flex flex-col items-end pl-4">
              <div className="flex flex-col items-center">
                <QRCode value={publicUrl || "https://ajeer.com.sa"} size={64} />
                <span className="text-xs mt-1 font-bold">{permit.permitNumber}</span>
                <span className="text-[10px] text-[#6b7280]">امسح للتحقق</span>
              </div>
            </div>
          </div>

          {/* Paragraph */}
          <div className="text-center text-xs text-[#4b5563] py-6 leading-relaxed px-4">
            نشعركم أنه تم التعاقد من قبلنا كجهة مقدمة للخدمة مع الجهة المستفيدة من الخدمة حسب المعلومات المبينة أدناه، ولذلك تم تسجيل معلومات العقد لتكون بحوزة العامل لإثبات عدم مخالفته لنظام العمل ولتقديمها إلى من يهمه الأمر من الجهات المختصة عند طلبها للتحقق من صحة تواجده في مكان تقديم الخدمة
          </div>

          {/* Tables */}
          <div className="w-full border border-[#d1d5db] text-xs flex flex-col mb-6">
            
            {/* Worker Data */}
            <div className="bg-[#f3f4f6] text-center font-bold text-[#111827] py-2 border-b border-[#d1d5db]">
              بيانات العامل
            </div>
            <div className="grid grid-cols-4">
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">اسم العامل</div>
              <div className="p-2 border-b border-l border-[#d1d5db]">{permit.workerName}</div>
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">المهنة</div>
              <div className="p-2 border-b border-[#d1d5db]">{permit.profession}</div>

              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">رقم الهوية / الإقامة</div>
              <div className="p-2 border-b border-l border-[#d1d5db]">{permit.idNumber}</div>
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">الجنسية</div>
              <div className="p-2 border-b border-[#d1d5db]">{permit.nationality}</div>
            </div>

            {/* Provider Data */}
            <div className="bg-[#f3f4f6] text-center font-bold text-[#111827] py-2 border-b border-[#d1d5db]">
              بيانات مقدم الخدمة
            </div>
            <div className="grid grid-cols-4">
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">المنشأة المقدمة للخدمة</div>
              <div className="p-2 border-b border-l border-[#d1d5db]">{permit.facilityName}</div>
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold flex items-center">رقم المنشأة في وزارة الموارد البشرية والتنمية الاجتماعية</div>
              <div className="p-2 border-b border-[#d1d5db] flex items-center">{permit.facilityNumber}</div>
            </div>

            {/* Beneficiary Data */}
            <div className="bg-[#f3f4f6] text-center font-bold text-[#111827] py-2 border-b border-[#d1d5db]">
              بيانات المستفيد من الخدمة
            </div>
            <div className="grid grid-cols-4">
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold flex items-center">المنشأة المستفيدة من الخدمة</div>
              <div className="p-2 border-b border-l border-[#d1d5db] flex items-center">{permit.beneficiaryFacilityName || "-"}</div>
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold flex items-center">رقم المنشأة في وزارة الموارد البشرية والتنمية الاجتماعية</div>
              <div className="p-2 border-b border-[#d1d5db] flex items-center">{permit.beneficiaryFacilityNumber || "-"}</div>
            </div>

            {/* Permit Data */}
            <div className="bg-[#f3f4f6] text-center font-bold text-[#111827] py-2 border-b border-[#d1d5db]">
              بيانات التصريح
            </div>
            <div className="grid grid-cols-4">
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">نبذة عن التعاقد</div>
              <div className="p-2 border-b border-[#d1d5db] col-span-3">{permit.contractDescription || "عقد بالباطن"}</div>

              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">تاريخ بداية التصريح</div>
              <div className="p-2 border-b border-l border-[#d1d5db]">{issueStr}</div>
              <div className="bg-[#f9fafb] p-2 border-b border-l border-[#d1d5db] font-bold">تاريخ نهاية التصريح</div>
              <div className="p-2 border-b border-[#d1d5db]">{expiryStr}</div>

              <div className="bg-[#f9fafb] p-2 border-l border-[#d1d5db] font-bold">مواقع العمل</div>
              <div className="p-2 col-span-3 border-[#d1d5db]">{permit.workLocations || "-"}</div>
            </div>
          </div>

          {/* Declarations */}
          <div className="flex-1 mt-4">
            <h3 className="text-center font-bold text-base mb-4">إقرارات</h3>
            <p className="font-bold mb-2 text-xs">أقر أنا المنشأة المقدمة للخدمة والموضحة بياناتي أعلاه وأتعهد بـ:</p>
            <div className="space-y-1 text-xs text-[#4b5563] leading-relaxed pr-2">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#4b5563] mt-2 shrink-0"></div>
                <p>إن العامل حامل هذا التصريح يحمله له يقر ويتعهد بأن البيانات المدونة فيه صحيحة على مسؤوليته الشخصية، وأنه يعمل لدى المنشأة ولحسابها، بموجب رخصة إقامة سارية المفعول. وأتحمل أي تبعات قانونية أو غرامات تترتب على خلاف المذكور أعلاه.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#4b5563] mt-2 shrink-0"></div>
                <p>الالتزام والتقيد بأنظمة العمل والعمال وأي أنظمة و لوائح وقرارات أخرى ذات علاقة.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#4b5563] mt-2 shrink-0"></div>
                <p>أن الموقع الإلكتروني الخاص بأجير أو القائمين عليه عبارة عن وسيط إلكتروني ما بين الباحثين عن العمل وأصحاب الأعمال فقط وبدون أي التزام قانوني أو غيره على القائمين على موقع أجير.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#4b5563] mt-2 shrink-0"></div>
                <p>أي تعديل أو كشط في هذا التصريح يجعله لاغياً.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-[#6b7280] space-y-2 pb-4">
            <div>للتحقق من صحة هذا التصريح وسريان مفعوله بإمكانك زيارة موقع أجير (https://ajeer.com.sa)</div>
            <div>* خدمة معتمدة من وزارة الموارد البشرية والتنمية الاجتماعية *</div>
          </div>

        </div>
      </div>

      {/* --- WEB UI --- */}
      
      {/* Top Navbar */}
      <header className="bg-[#ffffff] border-b border-[#e5e7eb] px-4 md:px-8 py-3 flex justify-between items-center shadow-sm relative z-10">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold text-[#00602b] leading-tight">
            أجير<br/><span className="text-xs uppercase tracking-widest text-[#6b7280]">Ajeer</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-xs text-[#6b7280] font-bold text-left leading-tight border-l border-[#e5e7eb] pl-4">
            الموارد البشرية<br/>والتنمية الاجتماعية
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-[#3b82f6] to-[#22c55e] rounded-bl-xl rounded-tr-xl opacity-80"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-8 px-4 flex flex-col items-center relative z-10">
        
        {/* Download Button */}
        <div className="w-full max-w-[900px] flex justify-end mb-4 gap-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="bg-[#2563eb] text-[#ffffff] px-5 py-2 rounded shadow hover:bg-[#1d4ed8] transition text-sm font-medium disabled:opacity-50"
          >
            {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        {/* Web Document Container */}
        <div 
          ref={permitRef} 
          className="w-full max-w-[900px] bg-[#ffffff] shadow-sm border border-[#e5e7eb] p-6 md:p-10"
        >
          {/* Header Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#d1d5db] mb-8 items-stretch">
            {/* 1st (Right) - Logos */}
            <div className="flex items-center justify-center p-4 border-b md:border-b-0 md:border-l border-[#d1d5db] gap-4">
               <div className="text-right leading-tight">
                 <div className="text-[10px] text-[#2563eb] font-bold">الموارد البشرية</div>
                 <div className="text-[10px] text-[#2563eb] font-bold">والتنمية الاجتماعية</div>
               </div>
               <div className="text-2xl font-bold text-[#00602b] leading-none text-center">
                 أجير<br/><span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Ajeer</span>
               </div>
            </div>
            
            {/* 2nd (Center) - Title */}
            <div className="flex items-center justify-center p-6 border-b md:border-b-0 md:border-l border-[#d1d5db]">
               <h1 className="text-xl md:text-2xl font-bold text-[#111827]">التحقق من تصريح أجير</h1>
            </div>
            
            {/* 3rd (Left) - Status */}
            <div className="flex items-center justify-center p-6">
               <span className="text-[#10b981] font-bold text-lg">ساري / فعال</span>
            </div>
          </div>

          {/* Success message */}
          <div className="text-center text-[#1f2937] mb-8 font-medium">
            تم التحقق من التصريح بنجاح
          </div>

          {/* Tables Container */}
          <div className="space-y-6 text-sm">
            
            {/* Permit Data Table */}
            <div className="border border-[#d1d5db] bg-[#ffffff]">
              <div className="bg-[#f3f4f6] text-center font-bold text-[#1f2937] py-3 border-b border-[#d1d5db]">
                بيانات التصريح
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">رقم التصريح</div>
                <div className="p-3 border-b md:border-l border-[#d1d5db] text-[#111827] flex items-center">{permit.permitNumber}</div>
                <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">نوع التصريح</div>
                <div className="p-3 border-b border-[#d1d5db] text-[#111827] flex items-center">{permit.permitType}</div>

                <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">تاريخ بداية التصريح</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#111827] flex items-center">{issueStr}</div>
                <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">تاريخ نهاية التصريح</div>
                <div className="p-3 text-[#111827] flex items-center">{expiryStr}</div>
              </div>
            </div>

            {/* Worker Data Table */}
            <div className="border border-[#d1d5db] bg-[#ffffff]">
              <div className="bg-[#f3f4f6] text-center font-bold text-[#1f2937] py-3 border-b border-[#d1d5db]">
                بيانات العامل
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">اسم العامل</div>
                <div className="p-3 border-b md:border-l border-[#d1d5db] text-[#111827] flex items-center uppercase">{permit.workerName}</div>
                <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">رقم الهوية / الإقامة</div>
                <div className="p-3 border-b border-[#d1d5db] text-[#111827] flex items-center">{permit.idNumber}</div>

                <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">الجنسية</div>
                <div className="p-3 border-b md:border-l border-[#d1d5db] text-[#111827] flex items-center">{permit.nationality}</div>
                <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">المهنة</div>
                <div className="p-3 border-b border-[#d1d5db] text-[#111827] flex items-center">{permit.profession}</div>

                <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">الجنس</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#111827] flex items-center">{permit.gender || "-"}</div>
                <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">تاريخ الميلاد</div>
                <div className="p-3 text-[#111827] flex items-center">{permit.dob || "-"}</div>
              </div>
            </div>

            {/* Facility Data Table */}
            <div className="border border-[#d1d5db] bg-[#ffffff]">
              <div className="bg-[#f3f4f6] text-center font-bold text-[#1f2937] py-3 border-b border-[#d1d5db]">
                بيانات المنشأة
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">رقم المنشأة</div>
                <div className="p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#111827] flex items-center">{permit.facilityNumber}</div>
                <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">اسم المنشأة</div>
                <div className="p-3 text-[#111827] flex items-center">{permit.facilityName}</div>
              </div>
            </div>

            {/* Beneficiary Facility Data Table (if exists) */}
            {permit.beneficiaryFacilityName && (
              <div className="border border-[#d1d5db] bg-[#ffffff]">
                <div className="bg-[#f3f4f6] text-center font-bold text-[#1f2937] py-3 border-b border-[#d1d5db]">
                  بيانات المستفيد من الخدمة
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">المنشأة المستفيدة</div>
                  <div className="p-3 border-b md:border-l border-[#d1d5db] text-[#111827] flex items-center">{permit.beneficiaryFacilityName}</div>
                  <div className="bg-[#f9fafb] p-3 border-b md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">رقم المنشأة</div>
                  <div className="p-3 border-b border-[#d1d5db] text-[#111827] flex items-center">{permit.beneficiaryFacilityNumber}</div>

                  <div className="bg-[#f9fafb] p-3 border-b md:border-b-0 md:border-l border-[#d1d5db] text-[#4b5563] font-bold flex items-center">مواقع العمل</div>
                  <div className="p-3 md:col-span-3 text-[#111827] flex items-center">{permit.workLocations}</div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#ffffff] border-t border-[#e5e7eb] py-8 mt-auto relative z-10">
         <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-[#4b5563] text-center md:text-right">
            <div>
               <h4 className="font-bold text-[#1f2937] mb-3 text-base">أجير</h4>
               <ul className="space-y-2">
                 <li>عن أجير</li>
                 <li>خدمات أجير</li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-[#1f2937] mb-3 text-base">الدعم</h4>
               <ul className="space-y-2">
                 <li>الدعم والمساعدة</li>
                 <li>الأسئلة الشائعة</li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-[#1f2937] mb-3 text-base">الشروط والخصوصية</h4>
               <ul className="space-y-2">
                 <li>الشروط والأحكام</li>
                 <li>سياسة الخصوصية</li>
               </ul>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3">
               <span className="font-bold text-[#1f2937] text-base">تواصل معنا</span>
               <div className="flex gap-3">
                 <div className="w-8 h-8 bg-[#f3f4f6] text-[#4b5563] rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-[#e5e7eb]">X</div>
                 <div className="w-8 h-8 bg-[#f3f4f6] text-[#4b5563] rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-[#e5e7eb]">in</div>
               </div>
            </div>
         </div>
         
         <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-[#f3f4f6] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 items-center">
               <div className="text-[#9ca3af] text-xs font-bold">هيئة الحكومة الرقمية</div>
               <div className="text-[#9ca3af] text-xs font-bold">تكامل Takamol</div>
            </div>
            <div className="text-xs text-[#6b7280] font-medium">مسجل لدى</div>
         </div>
      </footer>
    </div>
  );
}
