# Sistema de Notificações UMBRELLIX V Rising

Sistema automático que envia notificações via WhatsApp (Evolution API) quando o servidor for lançado. **Disparo automático quando o cronômetro zera!**

## 🚀 Configuração

### 1. Banco de Dados
Configure sua string de conexão PostgreSQL no `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/sitevrising?schema=public"
```

### 2. Executar Migrações
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Evolution API (WhatsApp)
Configure no `.env`:
```env
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua_api_key_aqui"
EVOLUTION_INSTANCE="sua_instancia_aqui"
```

### 4. Trigger.dev
```env
TRIGGER_SECRET_KEY="tr_dev_C0XCgKMoEpQPZeaQDfK1"
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"
```

## 📋 Funcionalidades

### 🆕 Disparo Automático
- **Cronômetro Inteligente**: Quando zera, automaticamente dispara as notificações
- **Execução Única**: Garante que as notificações sejam enviadas apenas uma vez
- **Feedback Visual**: Mostra o status do envio em tempo real
- **Logs Detalhados**: Registra todo o processo para monitoramento

### APIs Disponíveis

#### POST `/api/notifications/subscribe`
Inscreve um usuário para receber notificações.
```json
{
  "name": "João Silva",
  "whatsapp": "(11) 99999-9999"
}
```

#### GET `/api/notifications/list`
Lista todos os inscritos (administração).

#### POST `/api/notifications/send-all`
Envia notificações para todos os inscritos pendentes.

#### 🆕 POST `/api/notifications/trigger-launch`
**NOVA API**: Dispara automaticamente as notificações de lançamento.

## 🎯 Como Funciona o Disparo Automático

### 1. Cronômetro Monitora o Tempo
O cronômetro na página principal monitora constantemente o tempo restante.

### 2. Detecção de Zero
Quando o cronômetro chega a zero:
- O estado `hasLaunched` é ativado
- A interface muda para "SERVIDOR LANÇADO!"
- Automaticamente chama `/api/notifications/trigger-launch`

### 3. Envio Automático via Trigger.dev
A API de trigger:
- Dispara job no Trigger.dev
- Job busca todos os inscritos pendentes
- Envia notificações via Evolution API
- Marca os usuários como notificados
- Registra logs detalhados

### 4. Feedback Visual
- Mostra spinner durante o envio
- Exibe confirmação quando concluído
- Muda o botão para "JOGAR AGORA!"

## 🧪 Testando o Sistema

### Teste Manual (Painel Admin)
1. Acesse o painel administrativo na página
2. Clique em "🚀 TESTAR LANÇAMENTO AUTOMÁTICO"
3. Verifique os logs no console do navegador

### Teste do Cronômetro
Para testar rapidamente, modifique a data do lançamento:
```javascript
// Em app/page.tsx, linha ~20
const launchDate = new Date(now.getTime() + (30 * 1000)); // 30 segundos
```

### Verificar Logs
Abra o console do navegador (F12) para ver:
- `🚀 LANÇAMENTO! Disparando notificações automáticas...`
- `📱 [TRIGGER.DEV] Enviando para [Nome] ([WhatsApp])`
- `✅ [TRIGGER.DEV] Evolution API respondeu: {success: true}`
- `📈 [TRIGGER.DEV] Resultado: [X] sucessos, [Y] falhas`

## 🔧 Integração com Evolution API

### Configuração no Job do Trigger.dev
```javascript
// jobs/send-launch-notifications.ts
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

## 🎯 Fluxo Completo

### 1. Usuários se Inscrevem
Os usuários preenchem o formulário na página principal com nome e WhatsApp.

### 2. Cronômetro Conta Regressiva
A página mostra o tempo restante até o lançamento.

### 3. 🆕 Lançamento Automático
Quando o cronômetro zera:
- Interface muda automaticamente
- Trigger.dev executa job em background
- Evolution API envia notificações via WhatsApp
- Usuários recebem mensagem personalizada com link do Discord

### 4. Administração
Acesse `/api/notifications/list` para ver todos os inscritos e status.

## 📊 Monitoramento

### Logs Automáticos
- `🚀 Cronômetro zerou! Iniciando disparo via Trigger.dev...`
- `📊 [TRIGGER.DEV] Encontrados [X] inscritos para notificar`
- `📱 [TRIGGER.DEV] Enviando para [Nome]`
- `✅ [TRIGGER.DEV] Evolution API respondeu`
- `📈 [TRIGGER.DEV] Resultado: [X] sucessos, [Y] falhas`

### Estatísticas em Tempo Real
- Total de inscritos
- Quantos foram notificados
- Quantos estão pendentes
- Timestamp do lançamento

## 🔒 Segurança e Confiabilidade

- **Execução Única**: Previne envios duplicados
- **Tratamento de Erros**: Continua mesmo se algumas notificações falharem
- **Logs Detalhados**: Facilita debugging
- **Validação de Dados**: Garante integridade das informações
- **Fallback Manual**: Painel admin permite envio manual se necessário

## 🚀 Deploy

### Configuração de Produção
1. Configure a data real do lançamento em `app/page.tsx`
2. Configure sua Evolution API real
3. Remova o painel administrativo da página principal
4. Configure variáveis de ambiente na Vercel

### Variáveis de Ambiente Necessárias
```env
DATABASE_URL="postgresql://..."
EVOLUTION_API_URL="https://..."
EVOLUTION_API_KEY="..."
EVOLUTION_INSTANCE="..."
TRIGGER_SECRET_KEY="tr_dev_..."
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"
```

### Deploy dos Jobs
```bash
npx trigger.dev@latest deploy
```

## 📝 Próximos Passos

1. ✅ Configurar data real do lançamento
2. ✅ Configurar Evolution API
3. ✅ Testar sistema completo
4. ✅ Deploy em produção
5. 🆕 Monitorar logs durante o lançamento

## 🆘 Troubleshooting

### Notificações não dispararam automaticamente
1. Verifique o console do navegador
2. Confirme se há inscritos pendentes
3. Teste manualmente via painel admin
4. Verifique conectividade com banco de dados

### Cronômetro não está funcionando
1. Verifique a data configurada em `app/page.tsx`
2. Confirme se o JavaScript está habilitado
3. Teste em modo de desenvolvimento

### Evolution API falhando
1. Verifique as credenciais no `.env`
2. Confirme se a instância está conectada
3. Teste a API separadamente
4. Verifique logs de erro no console 