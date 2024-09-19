// app/api/participants/role/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role"); // 從查詢參數中獲取身份

  try {
    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // 從資料庫中根據身份篩選用戶
    const participants = await prisma.participant.findMany({
      where: { role },
    });

    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching participants" },
      { status: 500 }
    );
  }
}
