# Deploy na Vercel - Cyan Chasm Blog

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Repositório no GitHub/GitLab/Bitbucket
3. Node.js versão 18+ (recomendado: versão 22 para melhor compatibilidade com Vercel)

## 🚀 Instruções de Deploy

### Método 1: Deploy Automático via Git (Recomendado)

1. **Commit e push das alterações:**
   ```bash
   git add .
   git commit -m "Configurar projeto para deploy na Vercel"
   git push origin main
   ```

2. **Conectar à Vercel:**
   - Acesse [vercel.com](https://vercel.com) e faça login
   - Clique em "New Project"
   - Importe seu repositório
   - Configure as seguintes opções:
     - **Framework Preset:** Astro
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Deploy:**
   - Clique em "Deploy"
   - A Vercel detectará automaticamente as configurações do Astro
   - O deploy será finalizado em alguns minutos

### Método 2: Deploy via CLI da Vercel

1. **Instalar CLI da Vercel:**
   ```bash
   npm install -g vercel
   ```

2. **Login na Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy inicial:**
   ```bash
   vercel --prod
   ```

4. **Deploys subsequentes:**
   ```bash
   vercel --prod
   ```

## ⚙️ Configurações Aplicadas

### Arquivos de Configuração

- **`astro.config.mjs`:** Configurado com adapter Vercel e Web Analytics
- **`vercel.json`:** Configurações específicas de headers, cache e funções
- **`.vercelignore`:** Otimização de build excluindo arquivos desnecessários

### Recursos Habilitados

- ✅ **Server-Side Rendering (SSR)**
- ✅ **Web Analytics da Vercel**
- ✅ **Otimização automática de imagens**
- ✅ **Headers de segurança**
- ✅ **Cache otimizado para assets**
- ✅ **Suporte completo à área administrativa**
- ✅ **APIs funcionais**

## 🔧 Personalização do Domínio

Após o deploy, você pode:

1. Configurar domínio customizado nas configurações do projeto na Vercel
2. Atualizar o campo `site` no `astro.config.mjs` com seu domínio final:
   ```javascript
   site: 'https://seudominio.com'
   ```

## 📊 Monitoramento

- **Analytics:** Habilitado automaticamente via Vercel Web Analytics
- **Performance:** Métricas disponíveis no dashboard da Vercel
- **Logs:** Acessíveis via dashboard para debugging

## 🚨 Solução de Problemas

### Build Failures

Se o build falhar:

1. Verificar se todas as dependências estão no `package.json`
2. Executar `npm run build` localmente para identificar erros
3. Verificar logs detalhados no dashboard da Vercel

### Problemas com APIs

- As rotas de API estão configuradas em `/src/pages/api/`
- Timeout configurado para 30 segundos
- Verificar se as funções estão retornando responses válidos

### Área Administrativa

- Área admin acessível via `/admin`
- Upload de imagens configurado para funcionar na Vercel
- Editor TinyMCE com idioma português brasileiro

## 📈 Próximos Passos

1. Configurar variáveis de ambiente se necessário
2. Configurar domínio customizado
3. Monitorar performance via Web Analytics
4. Configurar alertas de uptime se desejado

## 🔗 Links Úteis

- [Documentação Astro + Vercel](https://docs.astro.build/en/guides/deploy/vercel/)
- [Dashboard Vercel](https://vercel.com/dashboard)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)