# 🦇 UMBRELLIX PVP - Configurações Detalhadas do Servidor

## 🎯 **Visão Geral**

O servidor UMBRELLIX PVP foi configurado para oferecer uma experiência **Brutal** e competitiva de V Rising, com foco em combate entre jogadores e estratégia de clãs.

## ⚔️ **Configurações Principais**

### **🎮 Modo de Jogo**
- **Tipo:** PvP (Player vs Player)
- **Dificuldade:** Brutal (`GameDifficulty: 2`)
- **Localização:** Brasil 🇧🇷
- **Latência:** Baixa para jogadores brasileiros

### **🛡️ Sistema de Proteção**
- **Proteção PvP:** Longa duração
- **Equipamentos Vinculados ao Sangue:** ✅ Ativado
- **Danos ao Jogador:** Sempre permitidos
- **Danos ao Castelo:** Restritos por horário

## 🕒 **Horários de Conflito**

### **⚔️ Ataques ao Castelo Permitidos:**
- **📆 Dias de semana:** 20h00 - 23h00 (3 horas)
- **📆 Finais de semana:** 20h00 - 23h00 (3 horas)
- **🚫 Fora desses horários:** Castelos protegidos

### **🏹 Combate entre Jogadores:**
- **Sempre ativo** - Sem restrições de horário
- **Danos:** Configuração Brutal (140% de poder)

## 🏰 **Sistema de Clãs e Castelos**

### **👥 Configurações de Clã:**
- **Tamanho Máximo:** 4 jogadores por clã
- **Máximo de Castelos:** 2 por jogador
- **Estratégia:** Foco em pequenos grupos coordenados

### **🏗️ Construção de Castelos:**
- **Início:** 50 pisos disponíveis
- **Máximo:** 550 pisos (nível 5)
- **Crescimento:** Progressivo conforme evolução
- **Proteção pós-cerco:** 30 minutos
- **Tempo de Relocação:** 3 horas

## 🔥 **Recursos e Mecânicas Especiais**

### **🔮 Sistemas Ativados:**
- ✅ **Equipamentos Vinculados ao Sangue**
- ✅ **Itens Vinculados ao Teleporte**
- ✅ **Relíquias Únicas**
- ❌ **Waypoint Global** (Desabilitado)
- ❌ **Equipamento Inicial** (Desativado)
- ❌ **Recursos Iniciais** (Desativados)

### **🌙 Lua de Sangue:**
- **Frequência:** Entre 10 e 18 dias
- **Bônus:** +20% de benefícios
- **Impacto:** Eventos especiais e maior loot

### **💰 Modificadores de Loot:**
- **Loot Geral:** 2x (dobrado)
- **Conversão de Servos:** 1x (padrão)
- **Crafting:** 1x (padrão)
- **Refinamento:** 1x (padrão)
- **Pesquisa:** 1x (padrão)

## ⏳ **Sistema de Inatividade**

### **📅 Tempos de Eliminação:**
- **Inatividade Mínima:** 1 hora
- **Ausência Máxima:** 7 dias
- **Segurança Adicional:** +2 dias
- **Total Máximo:** 9 dias de proteção

### **💀 Consequências:**
- Personagens eliminados após o período
- Castelos podem ser atacados/saqueados
- Recursos liberados para outros jogadores

## 💀 **Sistema de Morte e Loot**

### **🎒 Contêineres de Morte:**
- **Acesso:** Qualquer jogador pode saquear
- **Risco:** Alto - proteja seus itens!
- **Estratégia:** Evite morrer com itens valiosos

### **⚡ Relíquias:**
- **Tipo:** Únicas (não duplicadas)
- **Competição:** Alta disputa entre jogadores
- **Valor:** Extremamente raros e poderosos

## 🛠️ **Configurações Técnicas Baseadas em Brutal**

### **📊 Modificadores de Unidade (Global):**
```json
{
  "MaxHealthModifier": 1.0,
  "PowerModifier": 1.4
}
```

### **🩸 Modificadores V-Blood (Bosses):**
```json
{
  "MaxHealthModifier": 1.25,
  "PowerModifier": 1.7,
  "LevelIncrease": 3
}
```

### **🌞 Outros Modificadores:**
- **SunDamageModifier:** 1.0 (dano solar padrão)
- **BloodDrainModifier:** 1.0 (drenagem padrão)
- **DurabilityDrainModifier:** 0.5 (durabilidade reduzida)
- **DropTableModifier_General:** 1.25 (25% mais loot)

## 🎯 **Estratégias Recomendadas**

### **👥 Para Clãs:**
1. **Coordenação:** Máximo 4 jogadores - comunicação essencial
2. **Horários:** Planeje ataques nos horários permitidos
3. **Defesa:** Prepare-se para cercos nos fins de semana
4. **Recursos:** Gerencie 2 castelos por jogador estrategicamente

### **⚔️ Para Combate:**
1. **Equipamentos:** Mantenha vinculados ao sangue
2. **Teleporte:** Use com itens quando necessário
3. **Timing:** Aproveite horários de conflito
4. **Loot:** Cuidado com contêineres de morte públicos

### **🏰 Para Construção:**
1. **Localização:** Escolha posições defensáveis
2. **Expansão:** Planeje crescimento até 550 pisos
3. **Proteção:** Use os 30 min pós-cerco sabiamente
4. **Relocação:** 3 horas para mudanças estratégicas

## 🚨 **Regras Importantes**

### **✅ Permitido:**
- Combate PvP a qualquer hora
- Ataques a castelos nos horários específicos
- Saque de contêineres de morte
- Formação de alianças temporárias
- Uso de todas as mecânicas do jogo

### **❌ Proibido:**
- Ataques a castelos fora do horário
- Exploits ou bugs
- Comportamento tóxico excessivo
- Uso de cheats ou hacks
- Griefing desnecessário

## 📈 **Progressão e Dificuldade**

### **👹 Inimigos:**
- **Poder:** +40% comparado ao Normal
- **Bosses V-Blood:** +70% poder, +25% vida, +3 níveis
- **Desafio:** Extremamente alto
- **Recompensa:** Loot 2x e relíquias únicas

### **🏆 Objetivos:**
1. Dominar territórios estratégicos
2. Controlar relíquias únicas
3. Construir castelos defensáveis
4. Formar clãs competitivos
5. Sobreviver à dificuldade Brutal

## 🌟 **Diferenciais do UMBRELLIX PVP**

- 🇧🇷 **Servidor Brasileiro** - Latência otimizada
- ⚔️ **Dificuldade Brutal** - Máximo desafio
- 🏰 **Sistema de Clãs Balanceado** - 4 jogadores máximo
- 🕒 **Horários Organizados** - Conflitos estruturados
- 💰 **Loot Aumentado** - 2x recompensas
- 🔮 **Mecânicas Avançadas** - Todas as features ativadas

**Prepare-se para a experiência PvP mais intensa de V Rising no Brasil! 🦇⚔️** 