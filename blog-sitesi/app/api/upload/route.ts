import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    
    const cookie = req.headers.get("cookie");
    const token = cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Giriş yapmalısın" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    
    console.log("DECODED TOKEN:", decoded);
    
    const userId = decoded.userId;
    
    console.log("USER ID FROM TOKEN:", userId);
    

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string;
    const tag = formData.get("tag") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya gönderilmedi" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    
    const savedImage = await prisma.image.create({
      data: {
        name: file.name,
        url: imageUrl,
        description: description || "",
        tag: tag || "",
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return NextResponse.json(savedImage);
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Dosya yüklenemedi" },
      { status: 500 }
    );
  }
}
