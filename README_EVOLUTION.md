# 🦇 UMBRELLIX V Rising - Sistema de Notificações

Sistema automático que envia notificações via WhatsApp quando o servidor for lançado.

## 🚀 **Configuração Rápida**

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Configurar Banco de Dados**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. **Configurar Variáveis (.env)**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sitevrising"

# Evolution API (WhatsApp)
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua_api_key_aqui"
EVOLUTION_INSTANCE="sua_instancia_aqui"

# Trigger.dev
TRIGGER_SECRET_KEY="tr_dev_sua_key"
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"
```

### 4. **Deploy Jobs do Trigger.dev**
```bash
npx trigger.dev@latest deploy
```

### 5. **Executar**
```bash
npm run dev
```

## 🎯 **Como Funciona**

1. **Usuários se inscrevem** no formulário da página
2. **Cronômetro conta regressiva** até o lançamento
3. **Quando zera**: automaticamente dispara notificações
4. **Trigger.dev**: executa job em background
5. **Evolution API**: envia WhatsApp para todos os inscritos
6. **Interface muda** para "SERVIDOR LANÇADO!"

## 🧪 **Testar**

### **Teste Rápido (30 segundos)**
Modifique em `app/page.tsx` linha ~20:
```javascript
const launchDate = new Date(now.getTime() + (30 * 1000)); // 30 segundos
```

### **Teste Manual**
1. Acesse a página
2. Clique em "🚀 TESTAR LANÇAMENTO AUTOMÁTICO"
3. Verifique logs no console (F12)

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

## 🔧 **Arquivos Principais**

- `app/page.tsx` - Página principal com cronômetro
- `app/api/notifications/trigger-launch/route.ts` - API que dispara o Trigger.dev
- `jobs/send-launch-notifications.ts` - Job que envia via Evolution API
- `app/components/NotificationForm.tsx` - Formulário de inscrição
- `app/components/AdminPanel.tsx` - Painel administrativo

## 🚀 **Deploy em Produção**

1. **Configure data real** em `app/page.tsx`:
```javascript
const launchDate = new Date('2024-12-25T19:00:00');
```

2. **Configure Evolution API real** no `.env`

3. **Deploy jobs**:
```bash
npx trigger.dev@latest deploy
```

4. **Remova painel admin** da página principal

## 🆘 **Problemas Comuns**

### **Evolution API não envia**
- Verifique se instância está conectada
- Confirme API key e URL
- Teste formato do número: `5511999999999`

### **Trigger.dev não dispara**
- Verifique `TRIGGER_SECRET_KEY`
- Confirme deploy dos jobs
- Teste via dashboard

### **Cronômetro não funciona**
- Verifique data configurada
- Abra console (F12) para logs
- Teste com 30 segundos

## 📊 **Monitoramento**

- **Console do navegador**: Logs em tempo real
- **Dashboard Trigger.dev**: https://trigger.ricioconsultas.com.br
- **Painel admin**: Estatísticas e testes

**100% automático com Evolution API!** 🚀 