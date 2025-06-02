interface EvolutionApiResponse {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation: string;
  };
  messageTimestamp: string;
  status: string;
}

interface SendMessageParams {
  number: string;
  message: string;
}

interface SendMessageResult {
  success: boolean;
  data?: EvolutionApiResponse;
  error?: string;
}

/**
 * Envia uma mensagem via Evolution API
 * @param params - Parâmetros da mensagem (number e message)
 * @returns Resultado do envio
 */
export async function sendWhatsAppMessage(params: SendMessageParams): Promise<SendMessageResult> {
  try {
    // Validar variáveis de ambiente
    const apiUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;

    if (!apiUrl || !apiKey || !instance) {
      throw new Error('Variáveis de ambiente da Evolution API não configuradas');
    }

    // Limpar o número (remover caracteres não numéricos)
    const cleanNumber = params.number.replace(/\D/g, '');
    
    // Garantir que o número tenha o código do país (55 para Brasil)
    const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;

    console.log(`📱 [EVOLUTION API] Enviando mensagem para: ${formattedNumber}`);

    // Fazer a requisição para a Evolution API
    const response = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: formattedNumber,
        text: params.message
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Evolution API falhou: ${response.status} - ${errorText}`);
    }

    const data: EvolutionApiResponse = await response.json();
    
    console.log(`✅ [EVOLUTION API] Mensagem enviada com sucesso para: ${formattedNumber}`);
    console.log(`📋 [EVOLUTION API] ID da mensagem: ${data.key?.id}`);

    return {
      success: true,
      data
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error(`❌ [EVOLUTION API] Erro ao enviar mensagem:`, errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Envia mensagem de lançamento do servidor
 * @param name - Nome do usuário
 * @param whatsapp - Número do WhatsApp
 * @returns Resultado do envio
 */
export async function sendLaunchMessage(name: string, whatsapp: string): Promise<SendMessageResult> {
  const message = `🎮 Olá ${name}! 

🚀 O UMBRELLIX V Rising ACABOU DE SER LANÇADO!

⚔️ Servidores disponíveis AGORA:
• 🔥 UMBRELLIX PVP - Dificuldade Brutal
• 🛡️ UMBRELLIX PVE - Dificuldade Brutal

🎯 Entre no Discord para mais informações:
https://discord.gg/tNZDmgB6Cz

⚡ Não perca tempo! Os melhores territórios serão ocupados rapidamente!

Nos vemos no jogo! 🦇🏰`;

  return sendWhatsAppMessage({
    number: whatsapp,
    message
  });
}

/**
 * Envia mensagem de teste
 * @param name - Nome do usuário
 * @param whatsapp - Número do WhatsApp
 * @returns Resultado do envio
 */
export async function sendTestMessage(name: string, whatsapp: string): Promise<SendMessageResult> {
  const message = `🧪 Teste de Notificação

Olá ${name}! 

Esta é uma mensagem de teste do sistema de notificações do UMBRELLIX V Rising.

Se você recebeu esta mensagem, significa que tudo está funcionando perfeitamente! 🎮

Em breve você receberá a notificação oficial do lançamento! 🚀`;

  return sendWhatsAppMessage({
    number: whatsapp,
    message
  });
}

/**
 * Valida se as configurações da Evolution API estão corretas
 * @returns true se as configurações estão válidas
 */
export function validateEvolutionApiConfig(): boolean {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;

  return !!(apiUrl && apiKey && instance);
} 