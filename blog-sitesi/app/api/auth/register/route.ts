import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı" },
        { status: 400 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Kayıt başarılı",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error("REGISTER ERROR DETAYI:", error);

    return NextResponse.json(
      {
        error: "Kayıt sırasında hata oluştu",
        detail: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
