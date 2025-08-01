export const prerender = false;

import { isGitHubConfigured, getFile, createMarkdownContent, upsertFile, deleteFile } from '../../services/github';

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

				// Verificar se GitHub está configurado
		if (!isGitHubConfigured()) {
			return new Response(JSON.stringify({
				message: 'GitHub API não configurado. Configure as variáveis GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO.',
				error: 'GITHUB_NOT_CONFIGURED'
			}), {
				status: 503,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const filename = `${slug}.md`;
		const filePath = `src/content/blog/${filename}`;
		
		// Buscar arquivo atual
		const currentFile = await getFile(filePath);
		if (!currentFile) {
			return new Response(JSON.stringify({
				message: 'Post não encontrado'
			}), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Adicionar updatedDate automaticamente
		data.updatedDate = new Date().toISOString();
		
		// Criar conteúdo atualizado
		const markdownContent = createMarkdownContent(data);
		
		// Salvar arquivo via GitHub API
		const result = await upsertFile(
			filePath,
			markdownContent,
			`Atualizar post: ${data.title}`,
			currentFile.sha
		);
		
		return new Response(JSON.stringify({
			message: 'Post atualizado com sucesso!',
			slug: slug,
			commitUrl: result.commitUrl
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Erro ao atualizar post:', error);

		// Erro específico do GitHub
		if (error.message.includes('GitHub API Error')) {
			return new Response(JSON.stringify({
				message: 'Erro ao comunicar com GitHub. Verifique as credenciais.',
				error: error.message
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({
			message: 'Erro interno do servidor',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}

export async function DELETE({ params }) {
	try {
		const { slug } = params;

				// Verificar se GitHub está configurado
		if (!isGitHubConfigured()) {
			return new Response(JSON.stringify({
				message: 'GitHub API não configurado. Configure as variáveis GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO.',
				error: 'GITHUB_NOT_CONFIGURED'
			}), {
				status: 503,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const filename = `${slug}.md`;
		const filePath = `src/content/blog/${filename}`;
		
		// Buscar arquivo atual
		const currentFile = await getFile(filePath);
		if (!currentFile) {
			return new Response(JSON.stringify({
				message: 'Post não encontrado'
			}), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Deletar arquivo via GitHub API
		const result = await deleteFile(
			filePath,
			`Deletar post: ${slug}`,
			currentFile.sha
		);
		
		return new Response(JSON.stringify({
			message: 'Post deletado com sucesso!',
			slug: slug,
			commitUrl: result.commitUrl
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Erro ao deletar post:', error);

		// Erro específico do GitHub
		if (error.message.includes('GitHub API Error')) {
			return new Response(JSON.stringify({
				message: 'Erro ao comunicar com GitHub. Verifique as credenciais.',
				error: error.message
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({
			message: 'Erro interno do servidor',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}