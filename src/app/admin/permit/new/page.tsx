"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPermitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/permit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        alert("Failed to create permit.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Permit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 space-y-8">
        
        {/* Basic Permit Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Permit Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit Number</label>
              <input name="permitNumber" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. TQ6192037" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type</label>
              <input name="permitType" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. تصريح تعاقد أجير" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input name="issueDate" type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input name="expiryDate" type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Worker Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Worker Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Worker Name</label>
              <input name="workerName" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. MEHROZ KHAN RIFFAT ALI KHAN" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID / Iqama Number</label>
              <input name="idNumber" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 2336443920" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input name="nationality" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. باكستاني" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <input name="profession" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. كهربائي مباني" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" required className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                <option value="ذكر">ذكر (Male)</option>
                <option value="أنثى">أنثى (Female)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
              <input name="dob" type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Facility Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Facility Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider Facility Name</label>
              <input name="facilityName" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. مؤسسة روز الجبل للمقاولات العامة" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility Number</label>
              <input name="facilityNumber" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 6-1736524" />
            </div>
          </div>
        </section>

        {/* Beneficiary Facility Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Beneficiary Data (Optional for 2nd Permit Type)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Facility Name</label>
              <input name="beneficiaryFacilityName" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. شركة يو إي سي بروجيكتس سيرفيسز" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Facility Number</label>
              <input name="beneficiaryFacilityNumber" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 15-1972741" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Description</label>
              <input name="contractDescription" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. عقد بالباطن" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Locations</label>
              <input name="workLocations" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. H59V+2RR, ضرما 19835" />
            </div>
          </div>
        </section>

        {/* Security Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Security</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Optional Password Protection</label>
            <p className="text-sm text-gray-500 mb-3">If provided, users must enter this password to view the permit.</p>
            <input name="password" type="password" className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Leave blank for public access" />
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Permit"}
          </button>
        </div>

      </form>
    </div>
  );
}
