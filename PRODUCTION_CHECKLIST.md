# ✅ Checklist de Produção - UMBRELLIX V Rising

## 🚀 **Preparação para Deploy**

### **🔧 Configuração de Produção:**

#### **1. ✅ Variáveis de Ambiente (.env.production)**
```env
# Database Production
DATABASE_URL="postgresql://username:password@host:5432/production_db"

# Evolution API (WhatsApp)
EVOLUTION_API_URL="https://sua-evolution-api-production.com"
EVOLUTION_API_KEY="sua_api_key_producao"
EVOLUTION_INSTANCE="umbrellix_production"

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_PROJECT_ID="seu_clarity_project_id_producao"

# Next.js
NEXTAUTH_SECRET="sua_secret_key_super_segura_producao"
NEXTAUTH_URL="https://seudominio.com"
```

#### **2. 🛡️ Segurança Implementada:**
- [x] Logs protegem números de telefone (***2224)
- [x] Centro de testes apenas no painel admin
- [x] Validação de user-agent nas APIs
- [x] Painel admin protegido por senha
- [x] Rate limiting entre envios (500ms)

#### **3. 🎯 Funcionalidades de Produção:**
- [x] Cronômetro automático funcional
- [x] Disparo automático de notificações
- [x] Sistema de fallback Evolution API
- [x] Logs de produção otimizados
- [x] Telemetria Microsoft Clarity

### **📱 Sistema de Notificações:**

#### **✅ Fluxo Principal:**
1. **Usuário se inscreve** → Dados salvos no banco
2. **Cronômetro zera** → Disparo automático 
3. **API verifica inscritos** → Busca não notificados
4. **Evolution API envia** → WhatsApp para usuários
5. **Marca como notificado** → Evita spam

#### **✅ Centro de Testes (Admin):**
- **📧 Teste Local** → Verifica sistema geral
- **💬 Teste WhatsApp** → Testa envio real (não marca como notificado)
- **⚙️ Config API** → Verifica credenciais Evolution

#### **✅ Painel Administrativo:**
- **🚀 Lançamento Manual** → Botão vermelho para lançar
- **📊 Estatísticas** → Total, notificados, pendentes
- **👥 Lista de Inscritos** → Visualização protegida
- **🧪 Centro de Testes** → Apenas para admin

## 🚨 **Verificações Antes do Deploy:**

### **1. 📅 Configurar Data do Lançamento**
```javascript
// Em app/page.tsx, linha ~25
// TROCAR PARA DATA REAL DO LANÇAMENTO:
const launchDate = new Date('2024-12-25T19:00:00'); // Natal às 19h
// REMOVER A LINHA DE TESTE:
// const launchDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
```

### **2. 🔐 Mudar Senha do Admin**
```javascript
// Em app/components/AdminPanel.tsx, linha ~50
const adminPassword = 'SUA_SENHA_SUPER_SEGURA_PRODUCAO'; // Trocar esta senha!
```

### **3. 🌐 Configurar Evolution API**
- [ ] API URL de produção configurada
- [ ] API Key válida e ativa
- [ ] Instância configurada e rodando
- [ ] Teste de envio funcionando

### **4. 📊 Configurar Microsoft Clarity**
- [ ] Project ID de produção no .env
- [ ] Eventos sendo rastreados
- [ ] Dashboard configurado

### **5. 🗄️ Banco de Dados**
- [ ] PostgreSQL em produção
- [ ] Migrations aplicadas
- [ ] Backup configurado
- [ ] Conexão testada

## 🧪 **Testes Finais:**

### **✅ Teste Completo:**
1. **Inscrever usuário teste** com seu próprio WhatsApp
2. **Verificar no banco** se foi salvo
3. **Acessar painel admin** (`/admin`)
4. **Testar Evolution API** (botão laranja)
5. **Fazer teste WhatsApp** (botão azul) 
6. **Verificar se recebeu** a mensagem de teste
7. **Ajustar cronômetro** para 30 segundos
8. **Aguardar disparo automático**
9. **Verificar logs** no console
10. **Confirmar recebimento** da notificação oficial

### **🔍 Logs Esperados:**
```
🚀 LANÇAMENTO! Disparando notificações automáticas...
📱 [TEST WHATSAPP] Enviando teste para Nome (***2224)
✅ [TEST WHATSAPP] Teste enviado para Nome
📊 1 notificações enviadas automaticamente!
```

## 📦 **Deploy Commands:**

### **Vercel (Recomendado):**
```bash
# Configurar variáveis de ambiente no dashboard Vercel
npm run build
vercel --prod
```

### **Netlify:**
```bash
npm run build
netlify deploy --prod --dir=.next
```

### **Servidor Próprio:**
```bash
npm run build
npm start
```

## 🔄 **Pós-Deploy:**

### **✅ Verificações Imediatas:**
- [ ] Site carregando normalmente
- [ ] Cronômetro funcionando
- [ ] Formulário de inscrição OK
- [ ] Painel admin acessível
- [ ] Evolution API conectada
- [ ] Logs sendo gerados

### **📊 Monitoramento:**
- [ ] Microsoft Clarity ativo
- [ ] Logs do servidor funcionando
- [ ] Banco de dados operacional
- [ ] Evolution API estável

### **🚨 Contingência:**
- [ ] Backup do banco atualizado
- [ ] Rollback preparado se necessário
- [ ] Monitoramento de erros ativo

---

## 🎉 **Pronto para Lançar!**

Quando todas as verificações estiverem ✅, o sistema estará pronto para produção!

**Lembre-se:**
- 📅 **Ajustar a data real** do lançamento
- 🔐 **Trocar a senha** do admin  
- 🧪 **Fazer teste final** com seu WhatsApp
- 📊 **Monitorar logs** após o deploy

**O sistema irá disparar automaticamente quando o cronômetro zerar! 🚀** 