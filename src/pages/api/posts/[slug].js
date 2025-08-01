export const prerender = false;

import fs from 'fs';
import path from 'path';

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

export async function PUT({ params, request }) {
	try {
		const { slug } = params;
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
		
		const filename = `${slug}.md`;
		const filePath = path.join(process.cwd(), 'src', 'content', 'blog', filename);
		
		// Verificar se arquivo existe
		if (!fs.existsSync(filePath)) {
			return new Response(JSON.stringify({
				message: 'Post não encontrado'
			}), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Criar conteúdo atualizado
		const markdownContent = createMarkdownContent(data);
		
		// Salvar arquivo
		fs.writeFileSync(filePath, markdownContent, 'utf-8');
		
		return new Response(JSON.stringify({
			message: 'Post atualizado com sucesso!',
			slug: slug
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Erro ao atualizar post:', error);
		return new Response(JSON.stringify({
			message: 'Erro interno do servidor'
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function DELETE({ params }) {
	try {
		const { slug } = params;
		const filename = `${slug}.md`;
		const filePath = path.join(process.cwd(), 'src', 'content', 'blog', filename);
		
		// Verificar se arquivo existe
		if (!fs.existsSync(filePath)) {
			return new Response(JSON.stringify({
				message: 'Post não encontrado'
			}), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Deletar arquivo
		fs.unlinkSync(filePath);
		
		return new Response(JSON.stringify({
			message: 'Post deletado com sucesso!',
			slug: slug
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Erro ao deletar post:', error);
		return new Response(JSON.stringify({
			message: 'Erro interno do servidor'
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}