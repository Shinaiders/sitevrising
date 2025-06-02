# 📱 Evolution API - Guia Completo para UMBRELLIX

## 🎯 **Como Funciona o Fluxo Automático**

```
⏰ CRONÔMETRO ZERA
    ↓ (automaticamente)
🌐 Página detecta e chama API
    ↓
📡 /api/notifications/trigger-launch
    ↓ (dispara webhook)
🚀 TRIGGER.DEV JOB
    ↓ (executa em background)
📱 EVOLUTION API
    ↓ (envia WhatsApp)
✅ Usuários recebem mensagem
    ↓
💾 Marca como enviado no banco
```

## 🛠️ **Configuração da Evolution API**

### **Variáveis de Ambiente (.env)**
```env
# Evolution API (ÚNICO necessário para WhatsApp)
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua_api_key_aqui"
EVOLUTION_INSTANCE="sua_instancia_aqui"

# Trigger.dev
TRIGGER_SECRET_KEY="tr_dev_C0XCgKMoEpQPZeaQDfK1"
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"

# Database
DATABASE_URL="postgresql://..."
```

### **Exemplo Real**
```env
EVOLUTION_API_URL="https://evolution.seudominio.com"
EVOLUTION_API_KEY="B6D9F2A8-3C4E-4F7A-9B2D-1E5C8A7F3D9B"
EVOLUTION_INSTANCE="umbrellix_bot"
```

## 📋 **Como o Sistema Chama a Evolution API**

### **Endpoint Usado**
```
POST {EVOLUTION_API_URL}/message/sendText/{EVOLUTION_INSTANCE}
Headers: apikey: {EVOLUTION_API_KEY}
Body: { number: "5511999999999", text: "mensagem" }
```

### **Código no Trigger.dev Job**
```javascript
const evolutionResponse = await fetch(`${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.EVOLUTION_API_KEY
  },
  body: JSON.stringify({
    number: `55${subscriber.whatsapp.replace(/\D/g, '')}`,
    text: message
  })
});
```

## 🎯 **Fluxo Passo a Passo**

### **1. Cronômetro Zera (Automático)**
```javascript
// app/page.tsx - quando difference <= 0
fetch('/api/notifications/trigger-launch', { method: 'POST' })
```

### **2. API Dispara Trigger.dev**
```javascript
// app/api/notifications/trigger-launch/route.ts
fetch(`${TRIGGER_API_URL}/api/v1/jobs/send-launch-notifications/trigger`, {
  headers: { 'Authorization': `Bearer ${TRIGGER_SECRET_KEY}` }
})
```

### **3. Trigger.dev Executa Job**
```javascript
// jobs/send-launch-notifications.ts
- Busca inscritos no banco
- Para cada um: chama Evolution API
- Marca como enviado
- Retorna estatísticas
```

## 🧪 **Como Testar**

### **Teste Rápido (30 segundos)**
```javascript
// Em app/page.tsx linha ~20
const launchDate = new Date(now.getTime() + (30 * 1000)); // 30 segundos
```

### **Teste Manual**
1. Acesse a página
2. Clique em "🚀 TESTAR LANÇAMENTO AUTOMÁTICO"
3. Verifique logs no console (F12)

### **Logs Esperados**
```
🚀 LANÇAMENTO! Disparando notificações automáticas...
✅ Job do Trigger.dev disparado com sucesso
🚀 [TRIGGER.DEV] Iniciando envio de notificações
📱 [TRIGGER.DEV] Enviando para João (11999999999)
✅ [TRIGGER.DEV] Evolution API respondeu: {success: true}
📈 [TRIGGER.DEV] Resultado: 5 sucessos, 0 falhas
```

## 📱 **Mensagem Enviada**

```
🎮 Olá João! 

🚀 O UMBRELLIX V Rising ACABOU DE SER LANÇADO!

⚔️ Servidores disponíveis AGORA:
• 🔥 UMBRELLIX PVP - Dificuldade Brutal
• 🛡️ UMBRELLIX PVE - Dificuldade Brutal

🎯 Entre no Discord:
https://discord.gg/tNZDmgB6Cz

⚡ Não perca tempo! Os melhores territórios serão ocupados rapidamente!

Nos vemos no jogo! 🦇🏰
```

## 🔧 **Resposta da Evolution API**
```json
{
  "key": {
    "remoteJid": "5511999999999@s.whatsapp.net",
    "fromMe": true,
    "id": "3EB0C767D049B5CC9C"
  },
  "message": {
    "conversation": "🚀 O UMBRELLIX V Rising foi lançado!"
  },
  "status": "SUCCESS"
}
```

## 🚨 **Sistema de Fallback**

Se a Evolution API falhar:
- Sistema continua tentando outros inscritos
- Registra erros mas não para
- Retorna estatísticas de sucessos/falhas

## 📊 **Monitoramento**

### **Console do Navegador**
```
🚀 LANÇAMENTO! Disparando notificações automáticas...
✅ Notificações disparadas: {triggered: true, successful: 5}
```

### **Dashboard Trigger.dev**
- https://trigger.ricioconsultas.com.br
- Logs em tempo real
- Estatísticas detalhadas

## 🚀 **Deploy em Produção**

### **1. Configure Evolution API**
```env
EVOLUTION_API_URL="https://sua-evolution-real.com"
EVOLUTION_API_KEY="sua_key_real"
EVOLUTION_INSTANCE="sua_instancia_real"
```

### **2. Deploy Trigger.dev**
```bash
npx trigger.dev@latest deploy
```

### **3. Configure Data Real**
```javascript
// app/page.tsx
const launchDate = new Date('2024-12-25T19:00:00');
```

## 🆘 **Troubleshooting**

### **Evolution API não funciona**
1. Verifique se instância está conectada
2. Teste API key e URL
3. Confirme formato do número: `5511999999999`

### **Trigger.dev não dispara**
1. Verifique `TRIGGER_SECRET_KEY`
2. Confirme deploy dos jobs
3. Teste via dashboard

### **Cronômetro não dispara**
1. Verifique data configurada
2. Abra console (F12) para logs
3. Teste com 30 segundos

## 🎯 **Resumo**

1. **Usuários se inscrevem** no formulário
2. **Cronômetro conta regressiva**
3. **Quando zera**: dispara automaticamente
4. **Trigger.dev**: executa job em background
5. **Evolution API**: envia WhatsApp
6. **Usuários recebem** notificação
7. **Interface muda** para "LANÇADO!"

**100% automático com apenas Evolution API!** 🚀 