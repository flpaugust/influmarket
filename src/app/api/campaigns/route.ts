import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const role = (session.user as { role: string }).role;

    if (role === "BRAND") {
      const brand = await prisma.profileBrand.findUnique({
        where: { userId: session.user.id },
      });

      if (!brand) {
        return NextResponse.json({ campaigns: [] });
      }

      const campaigns = await prisma.campaign.findMany({
        where: { brandId: brand.id },
        include: {
          _count: { select: { proposals: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ campaigns });
    }

    // Influencer vê todas as campanhas abertas
    const campaigns = await prisma.campaign.findMany({
      where: { status: "OPEN" },
      include: {
        brand: true,
        _count: { select: { proposals: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
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

    const role = (session.user as { role: string }).role;
    if (role !== "BRAND") {
      return NextResponse.json(
        { error: "Apenas marcas podem criar campanhas." },
        { status: 403 }
      );
    }

    const brand = await prisma.profileBrand.findUnique({
      where: { userId: session.user.id },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Complete seu perfil de marca antes de criar campanhas." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, budget, niche } = body;

    if (!title || !description || !budget || !niche) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: brand.id,
        title,
        description,
        budget: parseFloat(budget),
        niche,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
