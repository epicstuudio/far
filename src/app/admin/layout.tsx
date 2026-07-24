import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/shared/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple admin header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Ajeer Admin</span>
          </div>
          {session && (
            <div className="flex items-center">
              <SignOutButton />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
