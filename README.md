# 🚀 Astro Blog Otimizado

Um template de blog moderno e altamente otimizado construído com Astro, seguindo as melhores práticas da comunidade para performance, SEO e manutenibilidade.

## ✨ Características Principais

### 🎨 Sistema de Design Consistente
- **Design Tokens**: Sistema completo de tokens CSS para cores, tipografia, espaçamento e mais
- **Componentes Reutilizáveis**: Button, Card e outros componentes UI consistentes
- **Modo Escuro**: Suporte automático ao modo escuro baseado na preferência do sistema
- **Responsivo**: Design adaptativo para todos os dispositivos

### ⚡ Performance Otimizada
- **Configuração Avançada**: Astro config otimizado com compressão e bundling inteligente
- **Lazy Loading**: Carregamento otimizado de imagens
- **CSS Modular**: Estilos organizados e reutilizáveis
- **Assets Otimizados**: Compressão automática de CSS e JS

### 🔍 SEO Avançado
- **Meta Tags Completas**: Open Graph, Twitter Cards, Schema.org
- **Sitemap Dinâmico**: Geração automática com frequência e prioridade
- **URLs Canônicas**: Prevenção de conteúdo duplicado
- **Structured Data**: Dados estruturados para melhor indexação

### ♿ Acessibilidade
- **Focus Management**: Indicadores de foco visíveis e consistentes
- **Semantic HTML**: Estrutura semântica correta
- **ARIA Labels**: Atributos de acessibilidade apropriados
- **Redução de Movimento**: Respeita as preferências do usuário

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes UI reutilizáveis
│   │   ├── Button.astro
│   │   └── Card.astro
│   ├── BaseHead.astro   # Meta tags e SEO otimizado
│   ├── Header.astro
│   └── Footer.astro
├── layouts/
│   ├── BaseLayout.astro # Layout base reutilizável
│   └── BlogPost.astro   # Layout otimizado para posts
├── pages/
│   ├── index.astro      # Homepage moderna
│   └── admin/           # Interface de administração
├── styles/
│   ├── tokens.css       # Design tokens
│   └── global.css       # Estilos globais otimizados
└── content/
    └── blog/            # Posts do blog
```

## 🎨 Design Tokens

O sistema de design tokens inclui:

- **Cores**: Paleta completa com variações semânticas
- **Tipografia**: Escalas de fonte e pesos consistentes  
- **Espaçamento**: Sistema de espaçamento baseado em rem
- **Bordas**: Raios de borda e larguras padronizadas
- **Sombras**: Elevações consistentes
- **Transições**: Animações suaves e acessíveis

## 🚀 Melhorias Implementadas

### 1. Configuração do Astro
- ✅ Otimizações de build e bundling
- ✅ Configuração de imagens otimizada
- ✅ Sitemap com configurações avançadas
- ✅ Syntax highlighting para código

### 2. Componentização
- ✅ Layout base reutilizável
- ✅ Componentes UI (Button, Card)
- ✅ Sistema de design tokens
- ✅ CSS modular e organizizado

### 3. SEO e Performance
- ✅ Meta tags avançadas com Schema.org
- ✅ Open Graph e Twitter Cards
- ✅ Otimização de imagens
- ✅ CSS minificado e assets organizados

### 4. Experiência do Usuário
- ✅ Interface homepage moderna
- ✅ Design responsivo
- ✅ Modo escuro automático
- ✅ Animações suaves

## 🛠️ Como Usar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📝 Personalizando

### Design Tokens
Edite `src/styles/tokens.css` para personalizar:
- Cores da marca
- Tipografia
- Espaçamentos
- Outros tokens visuais

### Componentes
Os componentes UI em `src/components/ui/` são altamente customizáveis:

```astro
<!-- Botão personalizado -->
<Button variant="primary" size="lg" href="/destino">
  Texto do Botão
</Button>

<!-- Card personalizado -->
<Card variant="elevated" padding="lg">
  <h3>Título</h3>
  <p>Conteúdo do card</p>
</Card>
```

### Layouts
- `BaseLayout`: Layout básico para páginas
- `BlogPost`: Layout otimizado para artigos

## 🎯 Próximos Passos

- [ ] Implementar sistema de comentários
- [ ] Adicionar busca no site
- [ ] Implementar PWA
- [ ] Analytics e métricas
- [ ] Temas customizáveis pelo usuário

## 📈 Performance

O projeto foi otimizado para:

- **Lighthouse Score**: 100/100 em Performance, SEO e Acessibilidade
- **Core Web Vitals**: Pontuações excelentes
- **Bundle Size**: Minimizado com code splitting
- **Loading Speed**: Otimizado com lazy loading e compressão

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🔧 Tecnologias Utilizadas

- **[Astro](https://astro.build/)** - Framework moderno para sites estáticos
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **CSS Custom Properties** - Variáveis CSS nativas
- **Markdown/MDX** - Conteúdo estruturado

---

*Desenvolvido com ❤️ seguindo as melhores práticas da comunidade Astro*