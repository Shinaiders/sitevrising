# 🦇 V Rising Brasil - Site Oficial 🏰

Site oficial para divulgação dos servidores brasileiros de V Rising, desenvolvido com Next.js 15 e Tailwind CSS.

## 🎮 Sobre o Projeto

Este site foi criado para divulgar e promover os servidores brasileiros de V Rising, oferecendo:

- **Cronômetro de lançamento** para o dia 13 de junho de 2025
- **Informações detalhadas** dos servidores PVP e PVE
- **Design temático vampírico** com animações e efeitos visuais
- **Call-to-action** para entrada no Discord da comunidade
- **Responsivo** para todos os dispositivos

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **React Hooks** - Gerenciamento de estado
- **Google Fonts** - Fontes personalizadas (Inter, Creepster, Nosifer)

## 🎯 Funcionalidades

### ⏰ Cronômetro de Lançamento
- Contagem regressiva em tempo real
- Atualização automática a cada segundo
- Display de dias, horas, minutos e segundos

### 🎮 Servidores
- **Servidor PVP**: Configurações para batalhas intensas
- **Servidor PVE**: Ambiente cooperativo para exploração

### 🎨 Design
- Tema vampírico com cores vermelhas e pretas
- Animações CSS personalizadas
- Efeitos de hover e transições suaves
- Gradientes e efeitos de vidro (glass effect)

## 📋 Configurações dos Servidores

### 🔥 Servidor PVP
- **Modo**: PvP Intenso
- **Dificuldade**: Normal
- **Proteção PvP**: Longa
- **Máx. Clã**: 4 jogadores
- **Horários de Conflito**: 20h00 - 23h00
- **Loot**: 2x | **Crafting**: 1x

### 🛡️ Servidor PVE
- **Modo**: PvE Cooperativo
- **PvP**: Desabilitado
- **Máx. Clã**: 6 jogadores
- **Waypoint Global**: Desbloqueado
- **Loot**: 3x | **Crafting**: 1.5x

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do projeto
cd sitevrising

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:3000`

### Build para Produção
```bash
# Gerar build de produção
npm run build

# Executar em produção
npm start
```

## 📁 Estrutura do Projeto

```
sitevrising/
├── app/
│   ├── components/
│   │   └── ServerCard.tsx     # Componente dos cards de servidor
│   ├── globals.css            # Estilos globais e animações
│   ├── layout.tsx             # Layout principal com metadados
│   └── page.tsx               # Página principal
├── public/                    # Assets estáticos
├── package.json
└── README.md
```

## 🎨 Customizações CSS

O projeto inclui várias classes CSS personalizadas:

- **Animações**: `animate-pulse-red`, `animate-float`, `animate-blood-drip`
- **Fontes**: `font-creepster`, `font-nosifer`, `font-inter`
- **Efeitos**: `glass-effect`, `hover-glow`, `gradient-text`

## 📱 Responsividade

O site é totalmente responsivo, adaptando-se a:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🔧 Configurações Avançadas

### Metadados SEO
- Título otimizado para SEO
- Descrição detalhada
- Open Graph para redes sociais
- Twitter Cards
- Palavras-chave relevantes

### Performance
- Fontes otimizadas com preconnect
- Imagens otimizadas
- CSS minificado
- JavaScript otimizado

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Discord**: [Link do Discord da Comunidade]
- **Email**: [email-do-servidor]

---

**🦇 Desperte seu vampiro interior! 🦇**

*Feito com ❤️ para a comunidade brasileira de V Rising*
