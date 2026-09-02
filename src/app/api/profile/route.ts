import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        influencer: true,
        brand: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const profile =
      user.role === "INFLUENCER" ? user.influencer : user.brand;

    return NextResponse.json({ profile, role: user.role });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (user.role === "INFLUENCER") {
      const profile = await prisma.profileInfluencer.upsert({
        where: { userId: user.id },
        update: {
          name: body.name,
          instagram: body.instagram,
          tiktok: body.tiktok,
          followers: body.followers ? parseInt(body.followers) : 0,
          niche: body.niche,
          bio: body.bio,
        },
        create: {
          userId: user.id,
          name: body.name,
          instagram: body.instagram,
          tiktok: body.tiktok,
          followers: body.followers ? parseInt(body.followers) : 0,
          niche: body.niche,
          bio: body.bio,
        },
      });
      return NextResponse.json({ profile });
    }

    if (user.role === "BRAND") {
      const profile = await prisma.profileBrand.upsert({
        where: { userId: user.id },
        update: {
          companyName: body.companyName,
          industry: body.industry,
        },
        create: {
          userId: user.id,
          companyName: body.companyName,
          industry: body.industry,
        },
      });
      return NextResponse.json({ profile });
    }

    return NextResponse.json(
      { error: "Tipo de conta inválido." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao salvar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
