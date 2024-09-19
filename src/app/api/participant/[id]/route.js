// app/api/participant/[id]/route.js
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

// 刪除參與者
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.participant.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Participant deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting participant" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const { name, role } = await request.json();

  try {
    const updatedParticipant = await prisma.participant.update({
      where: { id: parseInt(id) },
      data: {
        name,
        role,
      },
    });
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating participant" },
      { status: 500 }
    );
  }
}
