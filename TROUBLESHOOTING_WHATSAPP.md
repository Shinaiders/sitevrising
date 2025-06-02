# 🔧 Troubleshooting WhatsApp

## ❌ **Erro: "exists": false**

### **Problema:**
```json
{
  "exists": false,
  "jid": "11942042224@s.whatsapp.net",
  "number": "11942042224"
}
```

### **Possíveis Causas:**

#### **1. 📱 Número não existe no WhatsApp**
- O número pode não ter WhatsApp ativo
- Conta pode estar desativada/banida
- Número pode estar incorreto

#### **2. 🌍 Formato do número incorreto**
- **❌ Errado:** `11942042224` (sem código do país)
- **✅ Correto:** `5511942042224` (com código 55 do Brasil)

#### **3. 📞 Dígitos insuficientes ou extras**
- **Brasil celular:** 13 dígitos (55 + DDD + 9 + 8 dígitos)
- **Exemplo:** `5511999887766`

## ✅ **Soluções:**

### **1. 🔍 Verificar Formato do Número**

#### **No Painel Admin:**
1. Acesse `/admin`
2. Clique em **"📊 Carregar Dados"**
3. Verifique a seção **"Lista de Inscritos"**
4. Compare o **"📱 Original"** com **"🌍 Formatado"**

#### **Formato Correto:**
```
📱 Original: (11) 9 4204-2224
🌍 Formatado: 5511942042224
📊 Dígitos: 13
```

### **2. 🧪 Testar Número Manualmente**

#### **Verificações:**
1. **WhatsApp Web:** Teste enviar mensagem manual
2. **Busca de contato:** Procure o número no WhatsApp
3. **Status do número:** Verifique se está ativo

### **3. 🔧 Corrigir Números no Banco**

Se o número estiver incorreto, você pode atualizar:

```sql
-- Exemplo: adicionar código do país
UPDATE "NotificationSubscriber" 
SET whatsapp = '55' || whatsapp 
WHERE LENGTH(REGEXP_REPLACE(whatsapp, '[^0-9]', '', 'g')) = 11;

-- Exemplo: corrigir número específico
UPDATE "NotificationSubscriber" 
SET whatsapp = '5511999887766' 
WHERE name = 'Nome do Usuario';
```

### **4. 📝 Validação no Frontend**

A validação atual aceita:
- `(11) 9 9999-9999`
- `11 99999-9999`
- `11999999999`
- `5511999999999`

## 🔍 **Verificação de Números:**

### **Padrões Válidos Brasil:**

| Tipo | Formato | Exemplo | Dígitos |
|------|---------|---------|---------|
| **Celular SP** | 55 11 9 XXXX-XXXX | 5511912345678 | 13 |
| **Celular RJ** | 55 21 9 XXXX-XXXX | 5521987654321 | 13 |
| **Fixo SP** | 55 11 XXXX-XXXX | 551133334444 | 12 |

### **Verificação Manual:**

```javascript
// No console do navegador
const numero = "11942042224";
const clean = numero.replace(/\D/g, '');
const formatted = clean.startsWith('55') ? clean : `55${clean}`;
console.log('Original:', numero);
console.log('Limpo:', clean);
console.log('Formatado:', formatted);
console.log('Dígitos:', formatted.length);
```

## 🧪 **Testes Recomendados:**

### **1. Teste com Número Conhecido**
- Use seu próprio número primeiro
- Verifique se recebe a mensagem
- Confirme formato no painel

### **2. Teste Evolution API**
- Use o botão **"⚙️ Config API"**
- Verifique se a conexão está OK
- Confirme credenciais

### **3. Logs Detalhados**
- Monitore o console do navegador
- Verifique logs do servidor
- Procure por erros específicos

## 📋 **Checklist de Depuração:**

- [ ] ✅ Número tem 11-13 dígitos
- [ ] ✅ Código do país (55) presente
- [ ] ✅ Número existe no WhatsApp
- [ ] ✅ Evolution API configurada
- [ ] ✅ Credenciais corretas
- [ ] ✅ Instância ativa
- [ ] ✅ Rede/conectividade OK

## 🚨 **Erros Comuns:**

### **400 Bad Request:**
- Campo `text` vs `message` ✅ (já corrigido)
- Número formato incorreto
- JSON malformado

### **401 Unauthorized:**
- API Key incorreta
- Instância inativa
- Credenciais expiradas

### **404 Not Found:**
- URL da Evolution API incorreta
- Instância não existe
- Endpoint incorreto

## 💡 **Dicas:**

1. **📱 Use números reais** para teste
2. **🕐 Aguarde entre envios** (500ms)
3. **📊 Monitore logs** constantemente
4. **🔄 Teste incrementalmente** (1 número por vez)
5. **📝 Documente** números que funcionam

## 🎯 **Próximos Passos:**

1. **Verifique o número** no painel admin
2. **Teste com seu próprio número** primeiro
3. **Use números conhecidos** que têm WhatsApp
4. **Monitore os logs** para detalhes específicos

---

**Se o problema persistir, verifique se o número realmente tem WhatsApp ativo! 📱✅** 