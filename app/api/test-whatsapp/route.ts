import { NextRequest, NextResponse } from 'next/server';
import { sendTestMessage, sendLaunchMessage, validateEvolutionApiConfig } from '@/lib/evolution-api';

export async function POST(request: NextRequest) {
  try {
    // Tentar fazer parse do body, mas aceitar se estiver vazio
    let body = {};
    try {
      const requestText = await request.text();
      if (requestText.trim()) {
        body = JSON.parse(requestText);
      }
    } catch (parseError) {
      // Se não conseguir fazer parse, usar body vazio (teste de configuração)
      console.log('📝 [TEST API] Body vazio ou inválido, executando teste de configuração');
    }

    const { name, whatsapp, type = 'config' } = body as any;

    // Se não há nome/whatsapp, fazer apenas teste de configuração
    if (!name || !whatsapp) {
      console.log('🔧 [TEST API] Testando apenas configuração da Evolution API...');
      
      // Validar configuração da Evolution API
      if (!validateEvolutionApiConfig()) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Evolution API não configurada. Verifique as variáveis de ambiente.',
            details: 'Variáveis necessárias: EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE'
          },
          { status: 500 }
        );
      }

      // Teste básico de conectividade (sem enviar mensagem)
      try {
        const testUrl = `${process.env.EVOLUTION_API_URL}/instance/fetchInstances`;
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': process.env.EVOLUTION_API_KEY!,
            'Content-Type': 'application/json'
          }
        });

        if (testResponse.ok) {
          console.log('✅ [TEST API] Evolution API configurada e acessível');
          return NextResponse.json({
            success: true,
            message: 'Evolution API configurada e funcionando!',
            data: {
              url: process.env.EVOLUTION_API_URL,
              instance: process.env.EVOLUTION_INSTANCE,
              status: 'connected',
              timestamp: new Date().toISOString()
            }
          });
        } else {
          console.error('❌ [TEST API] Evolution API não acessível:', testResponse.statusText);
          return NextResponse.json(
            { 
              success: false,
              error: `Evolution API não acessível: ${testResponse.statusText}`,
              details: 'Verifique se a URL e API Key estão corretas'
            },
            { status: 500 }
          );
        }
      } catch (connectError) {
        console.error('💥 [TEST API] Erro de conexão com Evolution API:', connectError);
        return NextResponse.json(
          { 
            success: false,
            error: 'Erro de conexão com Evolution API',
            details: connectError instanceof Error ? connectError.message : 'Erro desconhecido'
          },
          { status: 500 }
        );
      }
    }

    // Se há nome/whatsapp, fazer teste completo de envio
    console.log(`🧪 [TEST API] Testando envio para ${name} (${whatsapp}) - Tipo: ${type}`);

    // Validar configuração da Evolution API
    if (!validateEvolutionApiConfig()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Evolution API não configurada. Verifique as variáveis de ambiente.'
        },
        { status: 500 }
      );
    }

    let result;
    
    if (type === 'launch') {
      // Enviar mensagem de lançamento
      result = await sendLaunchMessage(name, whatsapp);
    } else {
      // Enviar mensagem de teste (padrão)
      result = await sendTestMessage(name, whatsapp);
    }

    if (result.success) {
      console.log(`✅ [TEST API] Mensagem enviada com sucesso para ${name}`);
      return NextResponse.json({
        success: true,
        message: 'Mensagem enviada com sucesso!',
        data: {
          name,
          whatsapp,
          type,
          messageId: result.data?.key?.id,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.error(`❌ [TEST API] Falha ao enviar para ${name}:`, result.error);
      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Falha no envio da mensagem'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('💥 [TEST API] Erro crítico:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
} 