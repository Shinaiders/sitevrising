import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("⏰ [CRON] Verificando se é hora de lançar o servidor...");

    // Verificar se há inscritos para notificar
    const subscribersCount = await prisma.notificationSubscriber.count({
      where: {
        isNotified: false,
      },
    });

    if (subscribersCount === 0) {
      console.log("ℹ️ [CRON] Nenhum inscrito encontrado para notificar");
      return NextResponse.json({
        message: "Nenhum inscrito encontrado",
        checked: true,
        launched: false,
        timestamp: new Date().toISOString(),
      });
    }

    // Aqui você pode adicionar lógica para verificar se é hora de lançar
    // Por exemplo: verificar uma data/hora específica ou um flag no banco

    // Para teste, vamos simular que é sempre hora de lançar se há inscritos
    const shouldLaunch = true; // Substitua por sua lógica

    if (!shouldLaunch) {
      console.log("⏳ [CRON] Ainda não é hora de lançar");
      return NextResponse.json({
        message: "Ainda não é hora de lançar",
        checked: true,
        launched: false,
        subscribersCount,
        timestamp: new Date().toISOString(),
      });
    }

    console.log(
      `🚀 [CRON] Hora de lançar! Enviando para ${subscribersCount} inscritos...`
    );

    // Buscar todos os inscritos não notificados
    const subscribers = await prisma.notificationSubscriber.findMany({
      where: {
        isNotified: false,
      },
    });

    // Enviar notificações
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        const launchMessage = `🎮 Olá ${subscriber.name}! 

🚀 O UMBRELLIX V Rising ACABOU DE SER LANÇADO!

⚔️ Servidores disponíveis AGORA:
• 🔥 UMBRELLIX PVP - Dificuldade Brutal
• 🛡️ UMBRELLIX PVE - Dificuldade Brutal

🎯 Entre no Discord para mais informações:
https://discord.gg/tNZDmgB6Cz

⚡ Não perca tempo! Os melhores territórios serão ocupados rapidamente!

Nos vemos no jogo! 🦇🏰`;

        try {
          console.log(
            `📱 [CRON] Enviando para ${subscriber.name} (${subscriber.whatsapp})`
          );

          // Aqui você pode integrar com sua API de WhatsApp
          // Por enquanto, vamos simular o envio
          const url = `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`;

          await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.EVOLUTION_API_KEY || "",
            },
            body: JSON.stringify({
              number: subscriber.whatsapp,
              text: launchMessage,
            }),
          });
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Marcar como notificado
          await prisma.notificationSubscriber.update({
            where: { id: subscriber.id },
            data: { isNotified: true },
          });

          console.log(`✅ [CRON] Notificação enviada para ${subscriber.name}`);

          return {
            success: true,
            subscriber: subscriber.name,
            whatsapp: subscriber.whatsapp,
          };
        } catch (error) {
          console.error(
            `❌ [CRON] Erro ao enviar para ${subscriber.name}:`,
            error
          );
          throw error;
        }
      })
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log(
      `✅ [CRON] Processo concluído: ${successful} sucessos, ${failed} falhas`
    );

    return NextResponse.json({
      message: "Notificações enviadas com sucesso!",
      checked: true,
      launched: true,
      total: subscribers.length,
      successful,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("💥 [CRON] Erro crítico:", error);
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
        checked: true,
        launched: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Permitir POST também para testes manuais
export async function POST(request: NextRequest) {
  return GET(request);
}
