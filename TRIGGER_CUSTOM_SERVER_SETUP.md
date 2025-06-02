# 🏠 Trigger.dev - Servidor Próprio (trigger.ricioconsultas.com.br)

## 🎯 **Problema Identificado nos Logs:**

```bash
🔗 [TRIGGER] Disparando para: https://api.trigger.dev/api/v1/sources/http/events
📡 [TRIGGER] Response status: 500
❌ [TRIGGER] Erro detalhado: Unexpected Server Error
```

**Causa:** Estávamos usando a URL genérica do Trigger.dev cloud, mas você tem um **servidor próprio**.

## ✅ **Solução Implementada:**

O sistema agora **detecta automaticamente** se você tem um servidor próprio configurado:

### **🏠 Servidor Próprio (Recomendado para você):**
```env
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"
TRIGGER_SECRET_KEY="sua_secret_key_do_servidor_proprio"
```

### **☁️ Trigger.dev Cloud (Fallback):**
```env
# Se TRIGGER_API_URL não estiver configurado, usa cloud automaticamente
TRIGGER_SECRET_KEY="tr_dev_sua_secret_key_cloud"
TRIGGER_PROJECT_ID="seu_project_id_cloud"
```

## 🔧 **Configuração para Seu Servidor:**

### **1. Variáveis de Ambiente (.env):**
```env
# Seu servidor Trigger.dev
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"
TRIGGER_SECRET_KEY="tr_dev_C0XCgKMoEpQPZeaQDfK1"  # Sua chave real
TRIGGER_PROJECT_ID="umbrellix-v-rising"
```

### **2. URL que será usada:**
```
https://trigger.ricioconsultas.com.br/api/v1/jobs/send-launch-notifications/trigger
```

### **3. Payload enviado:**
```json
{
  "launchTime": "2024-12-18T10:30:00.000Z",
  "subscribersCount": 1,
  "source": "countdown-timer"
}
```

## 🧪 **Testando a Nova Configuração:**

### **Logs Esperados (Servidor Próprio):**
```bash
🏠 [TRIGGER] Usando servidor próprio: https://trigger.ricioconsultas.com.br
🔗 [TRIGGER] Disparando para: https://trigger.ricioconsultas.com.br/api/v1/jobs/send-launch-notifications/trigger
📡 [TRIGGER] Response status: 200
✅ Job do Trigger.dev disparado com sucesso
```

### **Logs Esperados (Cloud Fallback):**
```bash
☁️ [TRIGGER] Usando Trigger.dev cloud
🔗 [TRIGGER] Disparando para: https://api.trigger.dev/api/v1/sources/http/events
📡 [TRIGGER] Response status: 200
✅ Job do Trigger.dev disparado com sucesso
```

## 🛠️ **Troubleshooting Específico:**

### **Erro 500 no Servidor Próprio:**
**Possíveis causas:**
1. Job `send-launch-notifications` não existe no servidor
2. Secret key incorreta para o servidor próprio
3. Servidor próprio offline ou com problemas

**Soluções:**
1. **Verificar se o job existe:**
   ```bash
   curl -X GET https://trigger.ricioconsultas.com.br/api/v1/jobs \
     -H "Authorization: Bearer tr_dev_C0XCgKMoEpQPZeaQDfK1"
   ```

2. **Testar conectividade:**
   ```bash
   curl -X GET https://trigger.ricioconsultas.com.br/health
   ```

3. **Verificar logs do servidor próprio**

### **Erro 401 - Unauthorized:**
```bash
❌ [TRIGGER] Erro detalhado: Unauthorized
```
**Solução:** Verificar se `TRIGGER_SECRET_KEY` está correta para seu servidor.

### **Erro 404 - Not Found:**
```bash
❌ [TRIGGER] Erro detalhado: Not Found
```
**Solução:** Job `send-launch-notifications` não existe. Criar o job no servidor.

## 📊 **Logs Detalhados de Debug:**

O sistema agora mostra **logs completos** quando há erro:
```bash
❌ [TRIGGER] Erro detalhado: Mensagem do servidor
❌ [TRIGGER] URL usada: https://trigger.ricioconsultas.com.br/api/v1/jobs/send-launch-notifications/trigger
❌ [TRIGGER] Payload enviado: {
  "launchTime": "2024-12-18T10:30:00.000Z",
  "subscribersCount": 1,
  "source": "countdown-timer"
}
```

## 🔄 **Sistema de Fallback Robusto:**

**Vantagem:** Mesmo se seu servidor Trigger.dev falhar, o sistema **continua funcionando**:

1. **Tenta servidor próprio** → Se falhar
2. **Executa fallback local** → Garante que notificações sejam enviadas
3. **Logs detalhados** → Para debugging
4. **Microsoft Clarity** → Rastreia tudo

## 🚀 **Próximos Passos:**

### **Para Testar Agora:**
1. **Configure** `TRIGGER_API_URL` no seu `.env`
2. **Execute** o Centro de Testes
3. **Verifique** os logs no console (F12)
4. **Confirme** se está usando servidor próprio

### **Para Produção:**
1. **Verifique** se o job existe no servidor próprio
2. **Teste** conectividade com curl
3. **Configure** alertas no servidor
4. **Monitore** via logs e Clarity

## 💡 **Configuração Flexível:**

O sistema agora é **100% flexível**:
- ✅ **Com TRIGGER_API_URL:** Usa seu servidor próprio
- ✅ **Sem TRIGGER_API_URL:** Usa Trigger.dev cloud
- ✅ **Qualquer falha:** Fallback local automático
- ✅ **Logs detalhados:** Para debugging completo

**Seu servidor próprio do Trigger.dev agora está totalmente suportado! 🏠🚀** 