import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const subscribeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string()
    .min(10, 'WhatsApp deve ter pelo menos 10 dígitos')
    .regex(/^[\d\s\+\-\(\)]+$/, 'WhatsApp deve conter apenas números e símbolos válidos')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = subscribeSchema.parse(body);
    
    // Limpar e formatar o número do WhatsApp
    const cleanWhatsapp = validatedData.whatsapp.replace(/\D/g, '');
    
    // Verificar se já existe uma inscrição com este WhatsApp
    const existingSubscription = await prisma.notificationSubscriber.findFirst({
      where: {
        whatsapp: cleanWhatsapp
      }
    });
    
    if (existingSubscription) {
      return NextResponse.json(
        { message: 'Este WhatsApp já está inscrito para receber notificações!' },
        { status: 400 }
      );
    }
    
    // Criar nova inscrição
    const subscription = await prisma.notificationSubscriber.create({
      data: {
        name: validatedData.name.trim(),
        whatsapp: cleanWhatsapp,
      }
    });
    
    return NextResponse.json({
      message: 'Inscrição realizada com sucesso!',
      id: subscription.id
    });
    
  } catch (error) {
    console.error('Erro ao processar inscrição:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 