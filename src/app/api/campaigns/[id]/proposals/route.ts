import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/campaigns/[id]/proposals">
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await ctx.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada." },
        { status: 404 }
      );
    }

    // Verificar se o usuário é dono da campanha
    const role = (session.user as { role: string }).role;
    if (role === "BRAND") {
      const brand = await prisma.profileBrand.findUnique({
        where: { userId: session.user.id },
      });
      if (!brand || brand.id !== campaign.brandId) {
        return NextResponse.json(
          { error: "Acesso negado." },
          { status: 403 }
        );
      }
    }

    const proposals = await prisma.proposal.findMany({
      where: { campaignId: id },
      include: {
        influencer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ proposals, campaign });
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/campaigns/[id]/proposals">
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const role = (session.user as { role: string }).role;
    if (role !== "INFLUENCER") {
      return NextResponse.json(
        { error: "Apenas influenciadores podem enviar propostas." },
        { status: 403 }
      );
    }

    const influencer = await prisma.profileInfluencer.findUnique({
      where: { userId: session.user.id },
    });

    if (!influencer) {
      return NextResponse.json(
        { error: "Complete seu perfil antes de enviar propostas." },
        { status: 400 }
      );
    }

    const { id } = await ctx.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign || campaign.status !== "OPEN") {
      return NextResponse.json(
        { error: "Campanha não disponível." },
        { status: 404 }
      );
    }

    // Verificar se já enviou proposta
    const existing = await prisma.proposal.findFirst({
      where: {
        campaignId: id,
        influencerId: influencer.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Você já enviou uma proposta para esta campanha." },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "A mensagem é obrigatória." },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        campaignId: id,
        influencerId: influencer.id,
        message,
      },
    });

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error("Erro ao enviar proposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
