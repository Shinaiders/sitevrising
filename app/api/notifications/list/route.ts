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

export async function GET(request: NextRequest) {
  try {
    const subscribers = await prisma.notificationSubscriber.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const stats = {
      total: subscribers.length,
      notified: subscribers.filter((s: Subscriber) => s.isNotified).length,
      pending: subscribers.filter((s: Subscriber) => !s.isNotified).length
    };

    return NextResponse.json({
      subscribers,
      stats
    });

  } catch (error) {
    console.error('Erro ao listar inscritos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 