import { forwardRef, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { format } from "date-fns";

const PermitPdfTemplate = forwardRef<HTMLDivElement, { permit: any }>(({ permit }, ref) => {
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    const baseUrl = window.location.origin;
    setPublicUrl(`${baseUrl}/permit/${permit.id}`);
  }, [permit.id]);

  const issueStr = format(new Date(permit.issueDate), "yyyy-MM-dd");
  const expiryStr = format(new Date(permit.expiryDate), "yyyy-MM-dd");

  return (
    <div ref={ref} className="w-[794px] min-h-[1123px] bg-[#ffffff] p-10 font-sans text-[#111827] flex flex-col shadow-2xl mt-8" dir="rtl">
      {/* Header Box */}
      <div className="border border-[#d1d5db] flex justify-between items-center p-4">
        {/* Right: Logos */}
        <div className="flex items-center gap-6 w-1/3">
          <img src="/logos/mlsd-logo.png" alt="Ministry" width={140} className="object-contain" />
          <img src="/logos/ajeer-logo.png" alt="Ajeer" width={60} className="object-contain" />
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
  );
});

PermitPdfTemplate.displayName = "PermitPdfTemplate";
export default PermitPdfTemplate;
