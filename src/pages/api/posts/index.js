export const prerender = false;

import { isGitHubConfigured, generateSlug, fileExists, createMarkdownContent, upsertFile } from '../../services/github';

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

		// Gerar slug baseado no título
		const slug = generateSlug(data.title);
		const filename = `${slug}.md`;
		const filePath = `src/content/blog/${filename}`;
		
		// Verificar se arquivo já existe
		const exists = await fileExists(filePath);
		if (exists) {
			return new Response(JSON.stringify({
				message: 'Já existe um post com este título. Tente um título diferente.'
			}), {
				status: 409,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		// Criar conteúdo do arquivo
		const markdownContent = createMarkdownContent(data);
		
		// Salvar arquivo via GitHub API
		const result = await upsertFile(
			filePath,
			markdownContent,
			`Criar post: ${data.title}`
		);
		
		return new Response(JSON.stringify({
			message: 'Post criado com sucesso!',
			slug: slug,
			filename: filename,
			commitUrl: result.commitUrl
		}), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
		
	} catch (error) {
		console.error('Erro ao criar post:', error);

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