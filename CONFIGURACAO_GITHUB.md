# Configuração GitHub API

Este projeto agora usa a GitHub API para permitir edição de posts diretamente na produção (Vercel).

## 🚀 Como Funciona

- **Desenvolvimento Local**: Posts são editados diretamente nos arquivos
- **Produção (Vercel)**: Posts são editados via GitHub API com commits automáticos
- **Gratuito**: GitHub API permite 5.000 requests/hora (mais que suficiente)

## 📋 Pré-requisitos

1. Repositório GitHub (já existe)
2. Personal Access Token do GitHub
3. Variáveis de ambiente configuradas

## 🔧 Configuração

### 1. Criar GitHub Personal Access Token

1. Vá para: https://github.com/settings/tokens/new
2. **Token name**: `Cyan Chasm Blog Admin`
3. **Expiration**: `No expiration` (ou 1 ano)
4. **Scopes/Permissions**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `Contents` (Read and write access)
   - ✅ `Metadata` (Read access)

5. Clique em **Generate token**
6. **IMPORTANTE**: Copie o token (formato: `ghp_...`) e salve em local seguro

### 2. Configurar Variáveis de Ambiente

#### Local (.env.local)
```bash
# Criar arquivo .env.local na raiz do projeto
GITHUB_TOKEN=ghp_seu_token_aqui
GITHUB_OWNER=seu_usuario_github
GITHUB_REPO=cyan-chasm
GITHUB_BRANCH=main
```

#### Vercel (Produção)
1. Acesse https://vercel.com/dashboard
2. Vá para seu projeto `cyan-chasm`
3. Clique em **Settings** → **Environment Variables**
4. Adicione cada variável:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `GITHUB_TOKEN` | `ghp_seu_token_aqui` | Production |
| `GITHUB_OWNER` | `seu_usuario_github` | Production |
| `GITHUB_REPO` | `cyan-chasm` | Production |
| `GITHUB_BRANCH` | `main` | Production |

5. Clique **Save** para cada uma

### 3. Redeploy da Vercel

Após configurar as variáveis, force um novo deploy:
```bash
git commit --allow-empty -m "Trigger redeploy para GitHub API"
git push origin main
```

## ✅ Testando

1. **Local**: `npm run dev` → http://localhost:4321/admin
2. **Produção**: Seu domínio `/admin`

### Teste de Funcionalidade:
1. Criar um post de teste
2. Verificar se apareceu um commit no GitHub
3. Editar o post
4. Verificar novo commit
5. Deletar o post de teste

## 🔍 Verificação de Rate Limits

A API inclui verificação automática de rate limits. Se necessário, adicione este endpoint para monitoramento:

```javascript
// src/pages/api/github/rate-limit.js
export async function GET() {
  const github = new GitHubService();
  const rateLimit = await github.checkRateLimit();
  return new Response(JSON.stringify(rateLimit), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## 🚨 Segurança

### ⚠️ IMPORTANTE:
- **NUNCA** commitar o token no código
- Use `.env.local` (já no .gitignore)
- No Vercel, tokens ficam criptografados
- Revogue o token se comprometido

### Permissões Mínimas:
O token precisa apenas de:
- `repo` scope para repositórios privados
- `public_repo` scope se o repositório for público

## 🎯 Vantagens desta Solução

### ✅ Benefícios:
- **Gratuito**: GitHub API é grátis até 5.000 req/hora
- **Simples**: Não precisa de banco de dados
- **Versionado**: Cada alteração vira commit
- **Backup automático**: Histórico no Git
- **Deploy automático**: Vercel rebuilda automaticamente

### 📊 Limites:
- 5.000 requests/hora (autenticado)
- ~100 operações de blog por hora
- Perfeitamente adequado para blogs pessoais

## 🔧 Solução de Problemas

### Erro "GitHub API Error: 401"
- Token inválido ou expirado
- Verificar variável `GITHUB_TOKEN`

### Erro "GitHub API Error: 403"
- Rate limit excedido (muito raro)
- Permissions insuficientes no token

### Erro "GitHub API Error: 404"
- `GITHUB_OWNER` ou `GITHUB_REPO` incorretos
- Repositório não existe ou não tem acesso

### Posts não aparecem após edição
- Vercel pode levar 1-2 minutos para rebuild
- Verificar se commit foi criado no GitHub

## 📱 Monitoramento

### Logs úteis:
```bash
# Ver logs da Vercel
vercel logs

# Rate limit atual
curl https://seu-dominio.com/api/github/rate-limit
```

## 🔄 Workflow Completo

1. **Admin acessa** `/admin`
2. **Cria/edita post** via interface web
3. **API faz commit** no GitHub automaticamente
4. **GitHub webhook** dispara rebuild na Vercel
5. **Site atualiza** com novo conteúdo

**Resultado**: CMS funcional, gratuito e robusto! 🎉