# 🎯 Integração do Trigger.dev - Guia Completo

## 📍 **Onde o Trigger.dev Entra no Sistema**

```
🌐 PÁGINA PRINCIPAL
    ↓ (cronômetro zera)
📡 /api/notifications/trigger-launch
    ↓ (dispara webhook)
🚀 TRIGGER.DEV JOB
    ↓ (executa em background)
📱 ENVIO WHATSAPP
    ↓ (marca como enviado)
💾 BANCO DE DADOS
```

## 🔄 **Fluxo Detalhado**

### 1. **Cronômetro Zera** (`app/page.tsx`)
```javascript
// Quando difference <= 0
if (!hasLaunched && !isTriggering) {
  // Chama a API
  fetch('/api/notifications/trigger-launch', { method: 'POST' })
}
```

### 2. **API Route** (`app/api/notifications/trigger-launch/route.ts`)
```javascript
// 🎯 AQUI ENTRA O TRIGGER.DEV!
const triggerResponse = await fetch(`${process.env.TRIGGER_API_URL}/api/v1/jobs/send-launch-notifications/trigger`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.TRIGGER_SECRET_KEY}`
  },
  body: JSON.stringify({
    launchTime: new Date().toISOString(),
    subscribersCount: subscribersCount,
    source: 'countdown-timer'
  })
});
```

### 3. **Trigger.dev Job** (`jobs/send-launch-notifications.ts`)
```javascript
export const sendLaunchNotifications = task({
  id: "send-launch-notifications",
  run: async (payload: LaunchPayload) => {
    // Busca inscritos no banco
    // Envia WhatsApp para cada um
    // Marca como notificado
    // Retorna estatísticas
  }
});
```

## 🛠️ **Configuração Necessária**

### 1. **Variáveis de Ambiente**
```env
# Trigger.dev
TRIGGER_SECRET_KEY="tr_dev_C0XCgKMoEpQPZeaQDfK1"
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"

# WhatsApp API
WHATSAPP_API_URL="https://sua-api-whatsapp.com/send"
WHATSAPP_API_TOKEN="seu_token_aqui"

# Database
DATABASE_URL="postgresql://..."
```

### 2. **Configurar Project ID**
```typescript
// trigger.config.ts
export default defineConfig({
  project: "proj_SEU_PROJECT_ID_AQUI", // 🔧 MUDE AQUI
  dirs: ["./jobs"],
});
```

### 3. **Deploy do Job**
```bash
# Fazer deploy dos jobs para o Trigger.dev
npx trigger.dev@latest deploy
```

## 🎯 **3 Formas de Usar o Trigger.dev**

### **Opção 1: Webhook (Implementado) ✅**
- Cronômetro zera → API chama webhook → Trigger.dev executa job
- **Vantagem**: Execução em background, logs detalhados, retry automático
- **Desvantagem**: Requer configuração do Trigger.dev

### **Opção 2: Scheduled Job (Alternativa)**
```javascript
export const scheduledLaunch = task({
  id: "scheduled-launch",
  run: async () => {
    // Verifica se chegou a hora do lançamento
    const launchDate = new Date('2024-12-25T19:00:00');
    const now = new Date();
    
    if (now >= launchDate) {
      // Envia notificações
    }
  }
});

// Configurar para rodar a cada minuto
```

### **Opção 3: Manual Trigger (Para testes)**
```javascript
// Disparar manualmente via API
await trigger.dev.sendEvent({
  name: "launch.notifications",
  payload: { source: "manual" }
});
```

## 🧪 **Como Testar**

### 1. **Teste Local (Sem Trigger.dev)**
- Sistema atual funciona como fallback
- Logs aparecem no console do navegador

### 2. **Teste com Trigger.dev**
```bash
# 1. Configure as variáveis de ambiente
# 2. Deploy dos jobs
npx trigger.dev@latest deploy

# 3. Teste via painel admin
# Clique em "🚀 TESTAR LANÇAMENTO AUTOMÁTICO"
```

### 3. **Verificar Logs**
- **Frontend**: Console do navegador (F12)
- **Trigger.dev**: Dashboard do Trigger.dev
- **Backend**: Logs do servidor Next.js

## 🔧 **Configuração da API de WhatsApp**

### No Job do Trigger.dev (`jobs/send-launch-notifications.ts`)
```javascript
// Descomente e configure as linhas 54-66:
const whatsappResponse = await fetch(process.env.WHATSAPP_API_URL || '', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
  },
  body: JSON.stringify({
    to: `55${subscriber.whatsapp}`,
    message: message
  })
});
```

## 📊 **Monitoramento**

### **Logs do Trigger.dev**
```
🚀 [TRIGGER.DEV] Iniciando envio de notificações
📊 [TRIGGER.DEV] Encontrados 5 inscritos para notificar
📱 [TRIGGER.DEV] Enviando para João (11999999999)
✅ [TRIGGER.DEV] Notificação enviada para João
📈 [TRIGGER.DEV] Resultado: 5 sucessos, 0 falhas
```

### **Dashboard do Trigger.dev**
- Acesse: https://trigger.ricioconsultas.com.br
- Veja execuções em tempo real
- Logs detalhados de cada job
- Estatísticas de sucesso/falha

## 🚨 **Sistema de Fallback**

Se o Trigger.dev falhar, o sistema automaticamente:
1. Detecta o erro
2. Executa as notificações localmente
3. Registra que foi via fallback
4. Garante que as notificações sejam enviadas

```javascript
} catch (triggerError) {
  console.error('❌ Erro ao disparar Trigger.dev, executando fallback local:', triggerError);
  return await executeLocalNotifications();
}
```

## 🎯 **Vantagens do Trigger.dev**

### ✅ **Com Trigger.dev**
- ⚡ Execução em background (não bloqueia a interface)
- 🔄 Retry automático em caso de falha
- 📊 Logs detalhados e monitoramento
- ⏱️ Timeout configurável
- 🎯 Jobs agendados
- 📈 Dashboard de monitoramento

### ❌ **Sem Trigger.dev (Fallback)**
- 🐌 Execução síncrona (pode travar a interface)
- 🔄 Sem retry automático
- 📊 Logs apenas no console
- ⏱️ Timeout do navegador/servidor
- 🎯 Apenas execução manual
- 📈 Sem dashboard

## 🚀 **Próximos Passos**

1. **Configure o Project ID** no `trigger.config.ts`
2. **Configure as variáveis de ambiente**
3. **Deploy dos jobs**: `npx trigger.dev@latest deploy`
4. **Configure sua API de WhatsApp real**
5. **Teste o sistema completo**

## 🆘 **Troubleshooting**

### **Trigger.dev não dispara**
1. Verifique `TRIGGER_SECRET_KEY` e `TRIGGER_API_URL`
2. Confirme que o job foi deployado
3. Verifique logs no dashboard do Trigger.dev

### **Fallback sempre executa**
1. Verifique conectividade com o Trigger.dev
2. Confirme as credenciais
3. Teste manualmente via dashboard

### **WhatsApp não envia**
1. Configure `WHATSAPP_API_URL` e `WHATSAPP_API_TOKEN`
2. Descomente o código de envio no job
3. Teste sua API de WhatsApp separadamente 