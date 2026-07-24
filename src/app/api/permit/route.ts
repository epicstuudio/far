import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Hash password if provided
    let passwordHash = null;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    const permit = await prisma.permit.create({
      data: {
        permitNumber: data.permitNumber,
        permitType: data.permitType,
        issueDate: new Date(data.issueDate),
        expiryDate: new Date(data.expiryDate),
        workerName: data.workerName,
        nationality: data.nationality,
        gender: data.gender,
        idNumber: data.idNumber,
        profession: data.profession,
        dob: data.dob ? new Date(data.dob).toISOString() : null, // Storing as ISO string if needed, or update schema
        facilityName: data.facilityName,
        facilityNumber: data.facilityNumber,
        beneficiaryFacilityName: data.beneficiaryFacilityName,
        beneficiaryFacilityNumber: data.beneficiaryFacilityNumber,
        contractDescription: data.contractDescription,
        workLocations: data.workLocations,
        passwordHash,
      },
    });

    return NextResponse.json(permit, { status: 201 });
  } catch (error) {
    console.error("Error creating permit:", error);
    return NextResponse.json({ error: "Failed to create permit" }, { status: 500 });
  }
}
