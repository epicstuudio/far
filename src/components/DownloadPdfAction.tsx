"use client";

import { useState, useRef } from "react";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PermitPdfTemplate from "./PermitPdfTemplate";

export default function DownloadPdfAction({ permit }: { permit: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    setTimeout(async () => {
      if (!pdfRef.current) {
        setIsGenerating(false);
        return;
      }
      try {
        const canvas = await html2canvas(pdfRef.current, { 
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY,
        });
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
        setIsGenerating(false);
      }
    }, 200); // give it time to render
  };

  return (
    <>
      <button 
        onClick={handleDownload} 
        disabled={isGenerating}
        className="text-gray-500 hover:text-blue-600 disabled:opacity-50"
        title="Download PDF"
      >
        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      </button>

      {isGenerating && (
        <div className="absolute top-0 right-0 w-full bg-[#e5e7eb] flex justify-center z-[9999] opacity-0 pointer-events-none fixed top-[-10000px]">
          <PermitPdfTemplate permit={permit} ref={pdfRef} />
        </div>
      )}
    </>
  );
}
