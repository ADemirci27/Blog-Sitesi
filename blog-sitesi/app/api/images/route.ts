import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    
    return NextResponse.json(images);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Görseller getirilemedi" },
      { status: 500 }
    );
  }
}
