# Regras do Cursor para Projeto Astro Blog

## Contexto do Projeto
Este é um blog desenvolvido com Astro, TypeScript e componentes reutilizáveis. O projeto inclui:
- Sistema de blog com posts em Markdown/MDX
- Área administrativa para criação/edição de posts
- API para gerenciamento de conteúdo
- Componentes UI reutilizáveis
- Otimização para SEO

## Regras Gerais

### Linguagem
- Sempre responda em português brasileiro
- Comentários no código devem ser em português
- Nomes de variáveis, funções e componentes em inglês (padrão da indústria)
- Mensagens de commit em português

### Estrutura de Arquivos
- Mantenha a estrutura existente: `src/components/`, `src/pages/`, `src/layouts/`, `src/content/`
- Componentes UI ficam em `src/components/ui/`
- Layouts ficam em `src/layouts/`
- Conteúdo do blog fica em `src/content/blog/`
- Assets ficam em `src/assets/`

## Regras Específicas do Astro

### Componentes
- Use `.astro` para componentes com markup HTML
- Use TypeScript para lógica complexa
- Prefira componentes funcionais e reutilizáveis
- Mantenha a estrutura: script, markup, style
- Use `---` para delimitar o frontmatter dos componentes

### Páginas
- Páginas dinâmicas usam `[...slug].astro` ou `[slug].astro`
- API routes ficam em `src/pages/api/`
- Use `getStaticPaths()` para páginas dinâmicas
- Mantenha SEO meta tags em todas as páginas

### Conteúdo
- Posts do blog em Markdown/MDX em `src/content/blog/`
- Use frontmatter YAML para metadados dos posts
- Mantenha campos obrigatórios: title, description, pubDate, updatedDate
- Imagens devem ficar em `src/assets/`

## Regras de Código

### TypeScript
- Use TypeScript em todos os arquivos .ts e .astro
- Defina tipos explícitos quando necessário
- Use interfaces para objetos complexos
- Evite `any`, prefira tipos específicos

### Estilização
- CSS global em `src/styles/global.css`
- Tokens de design em `src/styles/tokens.css`
- Use CSS modules ou styled-components para estilos específicos
- Mantenha consistência com o design system existente

### Performance
- Otimize imagens automaticamente com Astro
- Use lazy loading para imagens
- Minimize JavaScript no cliente
- Prefira renderização estática sempre que possível

### SEO
- Inclua meta tags relevantes em todas as páginas
- Use títulos descritivos e únicos
- Implemente structured data quando apropriado
- Otimize para Core Web Vitals

## Regras de Desenvolvimento

### API
- Mantenha endpoints RESTful em `src/pages/api/`
- Use métodos HTTP apropriados (GET, POST, PUT, DELETE)
- Sempre valide dados de entrada
- Trate erros adequadamente com status codes corretos

### Admin
- Mantenha funcionalidades administrativas em `src/pages/admin/`
- Implemente validação de formulários
- Use feedback visual para ações do usuário
- Mantenha interface intuitiva

### Componentes UI
- Componentes reutilizáveis em `src/components/ui/`
- Use props tipadas
- Documente componentes complexos
- Mantenha acessibilidade (a11y)

## Regras de Qualidade

### Testes
- Teste funcionalidades críticas
- Valide formulários e APIs
- Teste responsividade
- Verifique acessibilidade

### Documentação
- Comente código complexo
- Mantenha README atualizado
- Documente APIs e componentes
- Use JSDoc quando apropriado

### Git
- Commits pequenos e focados
- Mensagens descritivas em português
- Use branches para features
- Mantenha histórico limpo

## Convenções de Nomenclatura

### Arquivos
- Componentes: PascalCase (ex: `BlogPost.astro`)
- Páginas: kebab-case (ex: `about.astro`)
- Utilitários: camelCase (ex: `formatDate.ts`)

### Código
- Variáveis e funções: camelCase
- Componentes: PascalCase
- Constantes: UPPER_SNAKE_CASE
- CSS classes: kebab-case

## Prioridades
1. Funcionalidade correta
2. Performance
3. SEO
4. Acessibilidade
5. Manutenibilidade
6. Experiência do usuário

## Evitar
- Uso excessivo de JavaScript no cliente
- CSS inline desnecessário
- Componentes muito grandes
- Código duplicado
- Hardcoding de valores
- Falta de tratamento de erros
- URLs não otimizadas para SEO

## Lembrar Sempre
- Este é um blog estático otimizado para performance
- SEO é fundamental para alcance
- Mantenha a simplicidade
- Priorize a experiência do usuário
- Código limpo e manutenível