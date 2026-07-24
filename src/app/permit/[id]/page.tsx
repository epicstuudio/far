import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import PermitView from "./PermitView";

const prisma = new PrismaClient();

export default async function PermitPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const permit = await prisma.permit.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!permit) {
    notFound();
  }

  // Determine if it requires a password
  const requiresPassword = !!permit.passwordHash;

  // Remove the hash before sending to client
  const { passwordHash, ...cleanPermit } = permit;

  return <PermitView permit={cleanPermit as any} requiresPassword={requiresPassword} />;
}
