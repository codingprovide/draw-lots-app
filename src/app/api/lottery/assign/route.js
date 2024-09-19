// app/api/lottery/assign/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { NextResponse } from "next/server";

export async function POST(request) {
  const { participantId, availableNumbers } = await request.json();

  if (!availableNumbers || availableNumbers.length === 0) {
    return NextResponse.json(
      { error: "No available numbers left" },
      { status: 400 }
    );
  }

  try {
    // 隨機選擇一個數字
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];

    // 更新用戶的組別
    const updatedParticipant = await prisma.participant.update({
      where: { id: participantId },
      data: { group: selectedNumber.toString() },
    });

    // 返回選中的數字
    return NextResponse.json({
      number: selectedNumber,
      participant: updatedParticipant,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating participant" },
      { status: 500 }
    );
  }
}
