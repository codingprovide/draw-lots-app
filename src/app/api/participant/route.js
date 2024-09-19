import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, group = null, role, color = null } = await request.json();

  try {
    const newParticipant = await prisma.participant.create({
      data: {
        name,
        group,
        role,
        color,
      },
    });

    return NextResponse.json(newParticipant);
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding participant" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const participants = await prisma.participant.findMany();
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching participants" },
      { status: 500 }
    );
  }
}
