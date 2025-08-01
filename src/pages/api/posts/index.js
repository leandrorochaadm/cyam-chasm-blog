export const prerender = false;

import fs from 'fs';
import path from 'path';

function generateSlug(title) {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove acentos
		.replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
		.replace(/\s+/g, '-') // Substitui espaços por hífens
		.replace(/-+/g, '-') // Remove hífens duplos
		.trim('-'); // Remove hífens do início/fim
}

function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { 
		month: 'short', 
		day: 'numeric', 
		year: 'numeric' 
	});
}

function createMarkdownContent(data) {
	const frontmatter = [];
	frontmatter.push('---');
	frontmatter.push(`title: '${data.title.replace(/'/g, "''")}'`);
	frontmatter.push(`description: '${data.description.replace(/'/g, "''")}'`);
	frontmatter.push(`pubDate: '${formatDate(data.pubDate)}'`);
	
	if (data.updatedDate) {
		frontmatter.push(`updatedDate: '${formatDate(data.updatedDate)}'`);
	}
	
	if (data.heroImage) {
		frontmatter.push(`heroImage: '${data.heroImage}'`);
	}
	
	frontmatter.push('---');
	
	return frontmatter.join('\n') + '\n\n' + data.content;
}

export async function POST({ request }) {
	try {
		const data = await request.json();
		
		// Validação básica
		if (!data.title || !data.description || !data.pubDate || !data.content) {
			return new Response(JSON.stringify({
				message: 'Título, descrição, data de publicação e conteúdo são obrigatórios'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Gerar slug baseado no título
		const slug = generateSlug(data.title);
		const filename = `${slug}.md`;
		const filePath = path.join(process.cwd(), 'src', 'content', 'blog', filename);
		
		// Verificar se arquivo já existe
		if (fs.existsSync(filePath)) {
			return new Response(JSON.stringify({
				message: 'Já existe um post com este título. Tente um título diferente.'
			}), {
				status: 409,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Criar conteúdo do arquivo
		const markdownContent = createMarkdownContent(data);
		
		// Criar diretório se não existir
		const blogDir = path.dirname(filePath);
		if (!fs.existsSync(blogDir)) {
			fs.mkdirSync(blogDir, { recursive: true });
		}
		
		// Salvar arquivo
		fs.writeFileSync(filePath, markdownContent, 'utf-8');
		
		return new Response(JSON.stringify({
			message: 'Post criado com sucesso!',
			slug: slug,
			filename: filename
		}), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Erro ao criar post:', error);
		return new Response(JSON.stringify({
			message: 'Erro interno do servidor'
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}