import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();

    const updatedPost = await prisma.post.update({
      where: {
        slug: params.slug,
      },
      data: {
        title: body.title,
        content: body.content,
        tag: body.tag,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.log("Post update error:", error);
    return NextResponse.json(
      { error: "Güncelleme başarısız" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.delete({
      where: {
        id: params.slug,
      },
    });

    return NextResponse.json({ message: "Post silindi" });
  } catch (error) {
    console.log("Post delete error:", error);
    return NextResponse.json(
      { error: "Silme başarısız" },
      { status: 500 }
    );
  }
}
