import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Eye, Share2, Trash2 } from "lucide-react";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const permits = await prisma.permit.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Permits</h1>
        <Link 
          href="/admin/permit/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Permit
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Permit Number</th>
                <th className="px-6 py-4 font-medium">Worker Name</th>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {permits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No permits created yet.
                  </td>
                </tr>
              ) : (
                permits.map((permit) => (
                  <tr key={permit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{permit.permitNumber}</td>
                    <td className="px-6 py-4">{permit.workerName}</td>
                    <td className="px-6 py-4">{format(new Date(permit.issueDate), "yyyy-MM-dd")}</td>
                    <td className="px-6 py-4">{format(new Date(permit.expiryDate), "yyyy-MM-dd")}</td>
                    <td className="px-6 py-4">
                      {permit.passwordHash ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Password Protected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Public
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <Link href={`/permit/${permit.id}`} target="_blank" className="text-gray-500 hover:text-blue-600">
                        <Eye size={18} />
                      </Link>
                      <button className="text-gray-500 hover:text-blue-600">
                        <Share2 size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
