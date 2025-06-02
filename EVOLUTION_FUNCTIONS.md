# 📱 Funções da Evolution API - Guia de Uso

## 🎯 **Funções Criadas**

### 1. **`sendWhatsAppMessage()`** - Função Base
```typescript
import { sendWhatsAppMessage } from '@/lib/evolution-api';

const result = await sendWhatsAppMessage({
  number: '11999999999',
  message: 'Sua mensagem aqui'
});

if (result.success) {
  console.log('Enviado!', result.data?.key?.id);
} else {
  console.error('Erro:', result.error);
}
```

### 2. **`sendLaunchMessage()`** - Mensagem de Lançamento
```typescript
import { sendLaunchMessage } from '@/lib/evolution-api';

const result = await sendLaunchMessage('João', '11999999999');
```

### 3. **`sendTestMessage()`** - Mensagem de Teste
```typescript
import { sendTestMessage } from '@/lib/evolution-api';

const result = await sendTestMessage('João', '11999999999');
```

### 4. **`validateEvolutionApiConfig()`** - Validar Configuração
```typescript
import { validateEvolutionApiConfig } from '@/lib/evolution-api';

if (validateEvolutionApiConfig()) {
  console.log('Evolution API configurada!');
} else {
  console.log('Faltam variáveis de ambiente');
}
```

## 🧪 **Como Testar**

### **1. Teste via API Route**
```bash
curl -X POST http://localhost:3000/api/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "whatsapp": "11999999999",
    "type": "test"
  }'
```

### **2. Teste via Painel Admin**
1. Acesse a página principal
2. Role até o painel administrativo
3. Clique em "📱 Teste WhatsApp Direto"
4. Digite nome e WhatsApp
5. Verifique se a mensagem chegou

### **3. Teste de Lançamento**
1. Clique em "🎮 Teste Mensagem de Lançamento"
2. Digite nome e WhatsApp
3. Receberá a mensagem real de lançamento

## 📋 **Formatos de Número**

### **Aceitos:**
- `11999999999` ✅
- `(11) 99999-9999` ✅ (será limpo automaticamente)
- `+55 11 99999-9999` ✅ (será limpo automaticamente)
- `5511999999999` ✅ (já com código do país)

### **Resultado Final:**
Sempre será formatado como: `5511999999999`

## 🔧 **Configuração Necessária**

### **Variáveis de Ambiente (.env)**
```env
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua_api_key_aqui"
EVOLUTION_INSTANCE="sua_instancia_aqui"
```

### **Validação Automática**
As funções automaticamente:
- ✅ Validam se as variáveis estão configuradas
- ✅ Limpam e formatam o número do WhatsApp
- ✅ Adicionam código do país (55) se necessário
- ✅ Fazem logs detalhados
- ✅ Retornam resultado estruturado

## 📱 **Mensagens Enviadas**

### **Mensagem de Teste**
```
🧪 Teste de Notificação

Olá João! 

Esta é uma mensagem de teste do sistema de notificações do UMBRELLIX V Rising.

Se você recebeu esta mensagem, significa que tudo está funcionando perfeitamente! 🎮

Em breve você receberá a notificação oficial do lançamento! 🚀
```

### **Mensagem de Lançamento**
```
🎮 Olá João! 

🚀 O UMBRELLIX V Rising ACABOU DE SER LANÇADO!

⚔️ Servidores disponíveis AGORA:
• 🔥 UMBRELLIX PVP - Dificuldade Brutal
• 🛡️ UMBRELLIX PVE - Dificuldade Brutal

🎯 Entre no Discord para mais informações:
https://discord.gg/tNZDmgB6Cz

⚡ Não perca tempo! Os melhores territórios serão ocupados rapidamente!

Nos vemos no jogo! 🦇🏰
```

## 🔄 **Integração com Trigger.dev**

### **No Job (`jobs/send-launch-notifications.ts`)**
```typescript
import { sendLaunchMessage } from '@/lib/evolution-api';

// Dentro do job
const result = await sendLaunchMessage(subscriber.name, subscriber.whatsapp);

if (result.success) {
  // Marcar como enviado no banco
  await prisma.notificationSubscriber.update({
    where: { id: subscriber.id },
    data: { isNotified: true }
  });
}
```

## 📊 **Logs e Monitoramento**

### **Logs Esperados**
```
📱 [EVOLUTION API] Enviando mensagem para: 5511999999999
✅ [EVOLUTION API] Mensagem enviada com sucesso para: 5511999999999
📋 [EVOLUTION API] ID da mensagem: 3EB0C767D049B5CC9C
```

### **Em Caso de Erro**
```
❌ [EVOLUTION API] Erro ao enviar mensagem: Evolution API falhou: 401 - Unauthorized
```

## 🚨 **Tratamento de Erros**

### **Erros Comuns**
- **401 Unauthorized**: API key inválida
- **404 Not Found**: Instância não encontrada
- **400 Bad Request**: Número inválido
- **500 Internal Server Error**: Problema na Evolution API

### **Como as Funções Tratam**
```typescript
if (!result.success) {
  console.error('Erro:', result.error);
  // Continua com próximo usuário
  // Não para o processo
}
```

## 🎯 **Exemplo Completo de Uso**

```typescript
import { sendLaunchMessage, validateEvolutionApiConfig } from '@/lib/evolution-api';

async function notifyUser(name: string, whatsapp: string) {
  // 1. Validar configuração
  if (!validateEvolutionApiConfig()) {
    console.error('Evolution API não configurada');
    return;
  }

  // 2. Enviar mensagem
  const result = await sendLaunchMessage(name, whatsapp);

  // 3. Verificar resultado
  if (result.success) {
    console.log(`✅ Enviado para ${name}!`);
    console.log(`📋 ID: ${result.data?.key?.id}`);
  } else {
    console.error(`❌ Falha para ${name}: ${result.error}`);
  }
}

// Usar
await notifyUser('João', '11999999999');
```

## 🚀 **Próximos Passos**

1. **Configure sua Evolution API** no `.env`
2. **Teste as funções** via painel admin
3. **Verifique os logs** no console
4. **Confirme recebimento** no WhatsApp
5. **Deploy em produção** quando tudo estiver funcionando

**Funções prontas para uso em produção!** 🎮 