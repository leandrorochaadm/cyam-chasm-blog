---
title: 'Guia Completo de Formatação Markdown'
description: 'Demonstração de todas as funcionalidades de formatação disponíveis no seu blog Astro'
pubDate: 'Jan 12, 2025'
updatedDate: 'Jul 29, 2025'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

# Título Principal H1

Este

**post**

1.  demonstra
    
2.  todas as
    

> funcionalidades de formatação **Markdown** disponíveis no seu blog Astro com estilos aprimorados.

Formatação 

# de Texto

### Texto em Destaque

*   **Texto em negrito** - usando `**texto**`
*   *Texto em itálico* - usando `*texto*`
*   ***Texto em negrito e itálico*** - usando `***texto***`
*   `Código inline` - usando `` `código` ``

### Links e Navegação

Você pode criar [links externos](https://astro.build) ou links internos para outras páginas do blog.

## Listas Organizadas

### Lista com Marcadores

*   Item principal
    *   Sub-item 1
    *   Sub-item 2
        *   Sub-sub-item
*   Outro item principal
*   Item com **texto em negrito**
*   Item com *texto em itálico*

### Lista Numerada

1.  Primeiro passo
2.  Segundo passo
    1.  Sub-passo A
    2.  Sub-passo B
3.  Terceiro passo
4.  Passo final

## Citações e Destaques

> Esta é uma citação importante que se destaca do texto principal.
> 
> Pode ter múltiplas linhas e fica visualmente diferenciada com uma borda colorida.

## Código de Programação

### Código Inline

Use `console.log("Hello World")` para imprimir no console.

### Blocos de Código

```javascript
// Exemplo de código JavaScript
function criarPost(titulo, conteudo) {
  return {
    titulo: titulo,
    conteudo: conteudo,
    dataPublicacao: new Date(),
    autor: 'Blog Admin'
  };
}

const meuPost = criarPost(
  'Novo Post', 
  'Conteúdo interessante aqui'
);
```

```css
/* Exemplo de CSS */
.minha-classe {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Tabelas Organizadas

Recurso

Disponível

Descrição

**Títulos**

✅

H1 até H6 com estilos diferenciados

**Listas**

✅

Marcadores e numeradas com sub-níveis

**Tabelas**

✅

Com hover e zebra stripes

**Código**

✅

Inline e blocos com syntax highlighting

**Links**

✅

Com efeitos hover personalizados

**Imagens**

✅

Responsive com sombras

## Separadores

Use três hífens para criar separadores visuais:

* * *

## Títulos de Diferentes Níveis

# H1 - Título Principal

## H2 - Título de Seção

### H3 - Subtítulo

#### H4 - Sub-subtítulo

##### H5 - Título Menor

###### H6 - Título Mínimo

## Elementos Avançados

### Combinações de Formatação

Você pode combinar **formatação em negrito** com *itálico* e até mesmo `código inline` no mesmo parágrafo.

### Listas Mistas

1.  Item numerado
    *   Sub-item com marcador
    *   Outro sub-item
2.  Segundo item numerado
    1.  Sub-item numerado
    2.  Outro sub-item numerado

### Citações Aninhadas

> Citação principal
> 
> > Citação dentro de outra citação
> > 
> > Muito útil para destacar diferentes fontes

## Dicas de Uso

### Para Títulos

*   Use `#` para H1, `##` para H2, etc.
*   H1 e H2 têm bordas inferiores automáticas

### Para Listas

*   Use `-` ou `*` para listas com marcadores
*   Use números `1.` para listas ordenadas
*   Indente com 2 espaços para sub-itens

### Para Código

*   Use `` ` `` para código inline
*   Use \`\`\` para blocos de código
*   Especifique a linguagem para highlight: \`\`\`javascript

### Para Tabelas

*   Use `|` para separar colunas
*   Segunda linha define o alinhamento
*   Primeira linha vira cabeçalho automaticamente

## Conclusão

O seu blog Astro agora possui formatação **completa e profissional** para conteúdo Markdown, incluindo:

✅ **Títulos estilizados** com bordas e hierarquia visual  
✅ **Listas personalizadas** com marcadores coloridos  
✅ **Código destacado** com syntax highlighting  
✅ **Tabelas responsivas** com efeitos hover  
✅ **Links interativos** com animações  
✅ **Citações elegantes** com aspas decorativas  
✅ **Design responsivo** para todos os dispositivos

Experimente escrever seus posts usando essas funcionalidades!