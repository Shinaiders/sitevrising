# 🔑 Guia de Chaves de API - Supabase

## 📋 **Ambientes Disponíveis (conforme sua imagem):**

### 🟡 **DEV Environment**
- **SERVER:** `••••••••••••••••••••••••••••••••`
- **PUBLIC:** `pk_dev_K0jySFsT4qk0kRfzzKx5`
- **Uso:** Desenvolvimento local e testes

### 🟠 **STAGING Environment** 
- **SERVER:** `••••••••••••••••••••••••••••••••`
- **PUBLIC:** `pk_stg_tD91Do0Aukuo19YPPrju`
- **Uso:** Testes de homologação

### 🟢 **PROD Environment** ⭐ **RECOMENDADO**
- **SERVER:** `••••••••••••••••••••••••••••••••`
- **PUBLIC:** `pk_prod_fZ5v9mRBMjn0GX2d6sGj`
- **Uso:** Produção (site final)

## 🎯 **Para o Trigger.dev - Use PROD:**

```env
# ✅ CORRETO: Use a chave do ambiente PROD
TRIGGER_SECRET_KEY="pk_prod_fZ5v9mRBMjn0GX2d6sGj"
```

## 🚨 **IMPORTANTE:**

### **Por que usar PROD?**
1. ✅ **Dados Reais:** Terá os usuários inscritos reais
2. ✅ **Estabilidade:** Ambiente mais estável
3. ✅ **Consistência:** Mesmo ambiente do site em produção
4. ✅ **Confiabilidade:** Menos chance de falhas

### **Quando usar outros ambientes?**
- **DEV:** Apenas para desenvolvimento local
- **STAGING:** Para testes antes de ir para produção

## 🔧 **Configuração Atual Recomendada:**

```env
# 🗄️ Database (PROD)
DATABASE_URL="sua_url_prod_do_supabase"

# 🚀 Trigger.dev (PROD)
TRIGGER_SECRET_KEY="pk_prod_fZ5v9mRBMjn0GX2d6sGj"
TRIGGER_PROJECT_ID="umbrellix-v-rising"
TRIGGER_API_URL="https://trigger.ricioconsultas.com.br"

# 📱 Evolution API
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua_api_key_aqui"
EVOLUTION_INSTANCE="sua_instancia_aqui"

# 📊 Microsoft Clarity
NEXT_PUBLIC_CLARITY_PROJECT_ID="seu_clarity_project_id_aqui"

# 🔐 NextAuth
NEXTAUTH_SECRET="Lucas102030"
NEXTAUTH_URL="https://sitevrising.com"
```

## 🧪 **Teste Após Configurar:**

1. **Atualize seu .env** com a chave PROD
2. **Reinicie o servidor:** `npm run dev`
3. **Teste o diagnóstico:** Clique em **🔍 Diagnóstico** no Centro de Testes
4. **Verifique os logs:** Deve mostrar status "Saudável"

## 🎯 **Resultado Esperado:**

```bash
✅ [HEALTH] Variáveis de Ambiente: OK
✅ [HEALTH] Trigger.dev Cloud: OK  
📊 [HEALTH] Verificação concluída: healthy
```

**Com a chave PROD, seu Trigger.dev funcionará perfeitamente! 🚀** 