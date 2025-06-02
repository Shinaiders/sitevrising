import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Subscriber {
  id: string;
  name: string;
  whatsapp: string;
  isNotified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se há inscritos para notificar
    const subscribersCount = await prisma.notificationSubscriber.count({
      where: {
        isNotified: false
      }
    });

    if (subscribersCount === 0) {
      return NextResponse.json({
        message: 'Nenhum inscrito encontrado para notificar',
        count: 0
      });
    }

    // Buscar todos os inscritos
    const subscribers = await prisma.notificationSubscriber.findMany({
      where: {
        isNotified: false
      }
    });

    // Simular envio de notificações (substitua pela sua API de WhatsApp)
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber: Subscriber) => {
        const message = `🎮 Olá ${subscriber.name}! 

🚀 O servidor UMBRELLIX V Rising foi lançado!

⚔️ Servidores disponíveis:
• UMBRELLIX PVP - Para batalhas épicas
• UMBRELLIX PVE - Para exploração cooperativa

🔗 Acesse: https://seusite.com

Nos vemos no jogo! 🦇🏰`;

        // Aqui você integraria com sua API de WhatsApp
        // Por enquanto, vamos apenas simular o envio
        console.log(`Enviando para ${subscriber.name} (${subscriber.whatsapp}): ${message}`);

        // Marcar como notificado
        await prisma.notificationSubscriber.update({
          where: { id: subscriber.id },
          data: { isNotified: true }
        });

        return { success: true, subscriber: subscriber.name };
      })
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    return NextResponse.json({
      message: 'Notificações processadas',
      total: subscribers.length,
      successful,
      failed,
      details: results
    });

  } catch (error) {
    console.error('Erro ao enviar notificações:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 