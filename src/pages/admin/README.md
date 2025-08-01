# Interface Administrativa do Blog

Esta é a interface administrativa completa para gerenciar posts do blog Astro.

## Funcionalidades

### 📝 Gerenciamento de Posts
- **Listar Posts**: Visualize todos os posts com informações básicas
- **Criar Posts**: Formulário completo para criar novos posts
- **Editar Posts**: Edite posts existentes com preview
- **Deletar Posts**: Remova posts com confirmação

### 🎨 Interface
- Design responsivo e moderno
- Formulários com validação
- Preview de posts antes de salvar
- Mensagens de feedback para usuário
- Estados de carregamento

### 🛠️ Tecnologia
- **Frontend**: Astro com JavaScript vanilla
- **Backend**: API endpoints em Node.js
- **Armazenamento**: Arquivos Markdown no sistema de arquivos
- **Validação**: Validação no frontend e backend

## Estrutura de Arquivos

```
src/pages/admin/
├── index.astro           # Página principal - lista posts
├── create.astro          # Criar novo post
├── edit/[...slug].astro  # Editar post existente
└── README.md            # Esta documentação

src/pages/api/posts/
├── index.js             # POST - criar posts
└── [slug].js           # PUT/DELETE - atualizar/deletar posts

src/styles/
└── admin.css           # Estilos da interface administrativa
```

## Como Usar

### Acessar Admin
1. Navegue para `/admin` no seu site
2. Ou clique no link "Admin" no header

### Criar Post
1. Clique em "Criar Novo Post"
2. Preencha o formulário:
   - **Título** (obrigatório)
   - **Descrição** (obrigatório) 
   - **Data de Publicação** (obrigatório)
   - **Imagem de Destaque** (opcional)
   - **Conteúdo** (obrigatório, Markdown)
3. Use "Visualizar" para preview
4. Clique "Criar Post"

### Editar Post
1. Na lista de posts, clique "Editar"
2. Modifique os campos desejados
3. Use "Visualizar" para preview
4. Clique "Salvar Alterações"

### Deletar Post
1. Na lista de posts, clique "Deletar"
2. Confirme a ação no diálogo

## Schema dos Posts

Os posts seguem este schema (definido em `src/content.config.ts`):

```typescript
{
  title: string;           // Título do post
  description: string;     // Descrição/resumo
  pubDate: Date;          // Data de publicação
  updatedDate?: Date;     // Data de atualização (opcional)
  heroImage?: string;     // Caminho da imagem (opcional)
}
```

## API Endpoints

### `POST /api/posts`
Cria um novo post.

**Body:**
```json
{
  "title": "Título do Post",
  "description": "Descrição do post",
  "pubDate": "2025-01-15",
  "heroImage": "../../assets/image.jpg",
  "content": "# Conteúdo\n\nTexto do post..."
}
```

### `PUT /api/posts/[slug]`
Atualiza um post existente.

**Body:** Mesmo formato do POST

### `DELETE /api/posts/[slug]`
Remove um post.

## Características Técnicas

### Geração de Slug
- Baseado no título do post
- Remove acentos e caracteres especiais
- Converte para lowercase
- Substitui espaços por hífens

### Armazenamento
- Posts salvos como arquivos `.md` em `src/content/blog/`
- Frontmatter YAML + conteúdo Markdown
- Integração nativa com sistema de conteúdo do Astro

### Segurança
- Validação de dados no frontend e backend
- Confirmação para ações destrutivas
- Sanitização de entrada de dados

### Performance
- Carregamento lazy de posts
- Estados de loading para feedback
- Otimização de imagens automática do Astro

## Personalizações

### Estilos
Edite `src/styles/admin.css` para personalizar a aparência.

### Funcionalidades
- Adicione novos campos no schema em `src/content.config.ts`
- Estenda os formulários nos arquivos `.astro`
- Modifique as APIs em `src/pages/api/posts/`

### Autenticação (Futuro)
Esta implementação não inclui autenticação. Para produção, considere:
- Middleware de autenticação
- Sessões de usuário
- Proteção de rotas administrativas

## Troubleshooting

### Post não aparece
- Verifique se o arquivo foi criado em `src/content/blog/`
- Confirme que o frontmatter está correto
- Reinicie o servidor de desenvolvimento

### Erro ao salvar
- Verifique permissões de escrita na pasta
- Confirme que todos os campos obrigatórios estão preenchidos
- Veja logs no console do navegador

### Problemas de layout
- Verifique se `admin.css` está sendo carregado
- Teste em diferentes navegadores
- Verifique console para erros CSS