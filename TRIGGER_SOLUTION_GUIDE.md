# 🛠️ Guia de Soluções - Trigger.dev

## 🚨 **Problemas Identificados nos Logs:**

### **1. Servidor Próprio - Erro "features"**
```bash
❌ [TRIGGER] Erro detalhado: TypeError: Cannot read properties of undefined (reading 'features')
```

### **2. Trigger.dev Cloud - Erro 500**
```bash
❌ [TRIGGER] Erro detalhado: Unexpected Server Error
```

### **3. URL Alternativa - Erro 404**
```bash
📡 [TRIGGER] Response status: 404
```

## 🎯 **Soluções Práticas:**

### **SOLUÇÃO 1: Configurar Chave de API Válida**

**Problema:** Sua `TRIGGER_SECRET_KEY` pode estar incorreta ou expirada.

**Passos:**
1. **Acesse o dashboard do Trigger.dev:**
   - Vá para [https://trigger.dev](https://trigger.dev)
   - Faça login na sua conta

2. **Obtenha uma nova chave:**
   - Vá em **Settings** → **API Keys**
   - Clique em **Generate New Key**
   - Copie a nova chave (formato: `tr_dev_...`)

3. **Atualize seu .env:**
   ```env
   TRIGGER_SECRET_KEY="tr_dev_sua_nova_chave_aqui"
   ```

### **SOLUÇÃO 2: Fazer Deploy do Job no Servidor Próprio**

**Problema:** O job `send-launch-notifications` não existe no seu servidor próprio.

**Passos:**
1. **Verificar se o job existe:**
   ```bash
   curl -X GET https://trigger.ricioconsultas.com.br/api/v1/jobs \
     -H "Authorization: Bearer tr_dev_C0XCgKMoEpQPZeaQDfK1"
   ```

2. **Fazer deploy do job:**
   ```bash
   npx trigger.dev@latest deploy --endpoint https://trigger.ricioconsultas.com.br
   ```

3. **Verificar se o deploy funcionou:**
   ```bash
   curl -X GET https://trigger.ricioconsultas.com.br/api/v1/jobs/send-launch-notifications \
     -H "Authorization: Bearer tr_dev_C0XCgKMoEpQPZeaQDfK1"
   ```

### **SOLUÇÃO 3: Usar Apenas Trigger.dev Cloud (Temporário)**

**Se o servidor próprio continuar com problemas:**

1. **Comentar servidor próprio no .env:**
   ```env
   # TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"
   ```

2. **Configurar apenas cloud:**
   ```env
   TRIGGER_SECRET_KEY="tr_dev_sua_chave_cloud"
   TRIGGER_PROJECT_ID="seu_project_id"
   ```

3. **Criar projeto no Trigger.dev Cloud:**
   - Acesse [https://trigger.dev](https://trigger.dev)
   - Crie um novo projeto: "UMBRELLIX V Rising"
   - Copie o Project ID

### **SOLUÇÃO 4: Configurar Webhook HTTP Source**

**Para usar Trigger.dev Cloud corretamente:**

1. **No dashboard do Trigger.dev:**
   - Vá em **Sources**
   - Clique em **+ New Source**
   - Selecione **HTTP**

2. **Configure o webhook:**
   - **Name:** "UMBRELLIX Launch Notifications"
   - **Event Name:** `launch.notifications.send`
   - **Description:** "Dispara notificações quando o servidor é lançado"

3. **Copie a URL do webhook** e use no sistema

## 🧪 **Como Testar as Soluções:**

### **1. Use o Diagnóstico Automático:**
- Acesse o site UMBRELLIX
- Role até o **Centro de Testes**
- Clique em **🔍 Diagnóstico**
- Siga as recomendações mostradas

### **2. Logs Esperados Após Correção:**
```bash
🔍 [HEALTH CHECK] Iniciando verificação de saúde do Trigger.dev...
✅ [HEALTH] Variáveis de Ambiente: OK
✅ [HEALTH] Trigger.dev Cloud: OK
📊 [HEALTH] Verificação concluída: healthy
```

### **3. Teste o Sistema Corrigido:**
```bash
☁️ [TRIGGER] Tentativa 2: Trigger.dev Cloud
🔗 [TRIGGER] Disparando para: https://api.trigger.dev/api/v1/sources/http/events
📡 [TRIGGER] Response status: 200
✅ [TRIGGER] Resposta bem-sucedida: { "id": "evt_123" }
```

## 🔧 **Comandos de Verificação:**

### **Testar Conectividade:**
```bash
# Testar servidor próprio
curl -X GET https://trigger.ricioconsultas.com.br/health

# Testar Trigger.dev Cloud
curl -X POST https://api.trigger.dev/api/v1/sources/http/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tr_dev_sua_chave" \
  -d '{"eventName":"test","payload":{"test":true}}'
```

### **Verificar Jobs:**
```bash
# Listar jobs no servidor próprio
curl -X GET https://trigger.ricioconsultas.com.br/api/v1/jobs \
  -H "Authorization: Bearer tr_dev_sua_chave"
```

## 📊 **Monitoramento Contínuo:**

### **Use o Centro de Testes Regularmente:**
1. **🔍 Diagnóstico** - Para verificar saúde geral
2. **🚀 Teste Trigger.dev** - Para testar funcionalidade
3. **📧 Teste Local** - Como fallback sempre funcional

### **Logs do Microsoft Clarity:**
Todos os testes são automaticamente rastreados:
- `test_trigger_health_clicked`
- `trigger_health_status: healthy/partial/unhealthy`
- `test_trigger_notifications_success`

## 🚀 **Resultado Esperado:**

**Após aplicar as soluções:**
- ✅ **Diagnóstico:** Status "Saudável"
- ✅ **Teste Trigger.dev:** Sucesso via Cloud ou Servidor Próprio
- ✅ **Notificações:** Sempre enviadas (com fallback garantido)
- ✅ **Logs:** Claros e informativos

## 💡 **Dicas Importantes:**

1. **Sempre teste o diagnóstico primeiro** antes de tentar enviar notificações
2. **O sistema de fallback garante** que notificações nunca falhem
3. **Use o servidor próprio apenas** se estiver 100% configurado
4. **Trigger.dev Cloud é mais confiável** para a maioria dos casos
5. **Monitore via Microsoft Clarity** para análise de comportamento

**Com essas soluções, seu Trigger.dev funcionará perfeitamente! 🎯** 