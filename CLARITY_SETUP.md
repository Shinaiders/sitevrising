# 📊 Microsoft Clarity - Guia de Configuração

## 🎯 **O que é o Microsoft Clarity?**

O Microsoft Clarity é uma ferramenta gratuita de análise de comportamento do usuário que oferece:
- **Mapas de calor** - Veja onde os usuários clicam
- **Gravações de sessão** - Assista como os usuários navegam
- **Métricas de performance** - Analise velocidade e usabilidade
- **Insights automáticos** - Detecta problemas automaticamente

## 🚀 **Configuração Inicial**

### **1. Criar Conta no Microsoft Clarity**
1. Acesse [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Faça login com sua conta Microsoft
3. Clique em "Create new project"
4. Digite o nome do projeto: "UMBRELLIX V Rising"
5. Adicione a URL do site: `https://seudominio.com`

### **2. Obter o Project ID**
1. No dashboard do Clarity, clique no seu projeto
2. Vá em **Settings → Setup**
3. Copie o **Project ID** (formato: `abcd1234`)

### **3. Configurar Variável de Ambiente**
Adicione no seu arquivo `.env`:
```env
NEXT_PUBLIC_CLARITY_PROJECT_ID="seu_project_id_aqui"
```

**⚠️ Importante:** O prefixo `NEXT_PUBLIC_` é obrigatório para funcionar no cliente!

## 🔧 **Implementação no Projeto**

### **Estrutura Criada:**
```
app/
├── components/
│   └── analytics/
│       ├── MicrosoftClarity.tsx  # Componente do Clarity
│       ├── Analytics.tsx         # Agregador de analytics
│       └── index.ts             # Exports
├── hooks/
│   └── useClarity.ts            # Hook para eventos customizados
└── layout.tsx                   # Integração no layout
```

### **Integração Automática:**
- ✅ Script carregado automaticamente em todas as páginas
- ✅ Logs de debug em desenvolvimento
- ✅ Validação de configuração
- ✅ Não carrega se Project ID não estiver configurado

## 📊 **Eventos Rastreados Automaticamente**

### **Formulário de Notificações:**
- `notification_form_focused` - Usuário focou no formulário
- `notification_form_name_focused` - Focou no campo nome
- `notification_form_whatsapp_focused` - Focou no campo WhatsApp
- `notification_form_submit_button_clicked` - Clicou no botão enviar
- `notification_form_submit_attempt` - Tentativa de envio
- `notification_form_submit_success` - Envio bem-sucedido
- `notification_form_submit_error` - Erro no envio

### **Tags Customizadas:**
- `user_subscribed: true` - Usuário se inscreveu
- `error_message: "texto do erro"` - Detalhes de erros

## 🧪 **Como Usar Eventos Customizados**

### **No Componente:**
```typescript
import { useClarity } from '@/app/hooks/useClarity';

function MeuComponente() {
  const clarity = useClarity();

  const handleClick = () => {
    // Registrar evento
    clarity.event('botao_especial_clicado');
    
    // Definir tag
    clarity.set('user_type', 'premium');
    
    // Identificar usuário
    clarity.identify('user123', 'session456');
  };

  return <button onClick={handleClick}>Clique aqui</button>;
}
```

### **Eventos Disponíveis:**
```typescript
// Registrar evento
clarity.event('nome_do_evento');

// Definir tag personalizada
clarity.set('chave', 'valor');

// Identificar usuário
clarity.identify('userId', 'sessionId', 'pageId', 'userHint');

// Registrar consentimento
clarity.consent();

// Registrar upgrade
clarity.upgrade('motivo_do_upgrade');
```

## 📈 **Monitoramento e Análise**

### **Dashboard do Clarity:**
1. Acesse [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Selecione seu projeto "UMBRELLIX V Rising"
3. Visualize:
   - **Recordings** - Gravações de sessões
   - **Heatmaps** - Mapas de calor
   - **Insights** - Problemas detectados automaticamente

### **Métricas Importantes:**
- **Taxa de conversão** do formulário de notificações
- **Pontos de abandono** na página
- **Tempo de permanência** no site
- **Cliques em elementos** importantes
- **Erros de JavaScript** detectados

## 🔍 **Eventos Específicos do UMBRELLIX**

### **Sugestões de Eventos Adicionais:**
```typescript
// Cronômetro
clarity.event('countdown_viewed');
clarity.event('countdown_reached_zero');

// Discord
clarity.event('discord_link_clicked');

// Admin Panel
clarity.event('admin_panel_opened');
clarity.event('test_notification_sent');

// Lançamento
clarity.event('server_launched');
clarity.event('play_now_button_clicked');
```

## 🚨 **Troubleshooting**

### **Clarity não está funcionando:**
1. Verifique se `NEXT_PUBLIC_CLARITY_PROJECT_ID` está configurado
2. Confirme se o Project ID está correto
3. Verifique o console do navegador para logs
4. Teste em modo incógnito

### **Eventos não aparecem:**
1. Aguarde até 30 minutos (delay normal)
2. Verifique se o hook `useClarity` está sendo usado
3. Confirme se `clarity.isLoaded` é `true`
4. Teste eventos manualmente no console

### **Logs de Debug:**
```javascript
// No console do navegador
console.log('Clarity carregado:', !!window.clarity);
console.log('Project ID:', process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);

// Testar evento manualmente
window.clarity('event', 'teste_manual');
```

## 🌐 **Deploy em Produção**

### **Vercel:**
1. Vá em **Settings → Environment Variables**
2. Adicione `NEXT_PUBLIC_CLARITY_PROJECT_ID`
3. Defina o valor para todos os ambientes
4. Redeploy a aplicação

### **Outras Plataformas:**
Configure a variável de ambiente conforme a documentação da plataforma.

## 📋 **Checklist de Configuração**

- [ ] ✅ Conta criada no Microsoft Clarity
- [ ] ✅ Projeto configurado com URL do site
- [ ] ✅ Project ID copiado
- [ ] ✅ Variável `NEXT_PUBLIC_CLARITY_PROJECT_ID` configurada
- [ ] ✅ Site deployado e funcionando
- [ ] ✅ Clarity aparecendo no dashboard (aguardar até 30min)
- [ ] ✅ Eventos customizados sendo registrados
- [ ] ✅ Gravações de sessão disponíveis

## 🎯 **Próximos Passos**

1. **Configure o Project ID** no `.env`
2. **Deploy a aplicação** 
3. **Teste navegando** no site
4. **Aguarde 30 minutos** para dados aparecerem
5. **Analise os insights** no dashboard
6. **Otimize baseado** nos dados coletados

**Microsoft Clarity integrado e pronto para análise! 📊🚀** 