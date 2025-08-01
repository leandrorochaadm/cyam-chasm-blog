export const prerender = false;

// Funções inline para contornar problemas de importação
function isGitHubConfigured() {
	const token = process.env.GITHUB_TOKEN;
	const owner = process.env.GITHUB_OWNER;
	const repo = process.env.GITHUB_REPO;
	return !!(token && owner && repo);
}

function getGitHubConfig() {
	return {
		token: process.env.GITHUB_TOKEN,
		owner: process.env.GITHUB_OWNER,
		repo: process.env.GITHUB_REPO,
		branch: process.env.GITHUB_BRANCH || 'main'
	};
}

function getHeaders() {
	const { token } = getGitHubConfig();
	return {
		'Authorization': `token ${token}`,
		'Accept': 'application/vnd.github.v3+json',
		'Content-Type': 'application/json',
		'User-Agent': 'Cyan-Chasm-Blog/1.0'
	};
}

async function getFile(path) {
	const { owner, repo } = getGitHubConfig();
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
	const response = await fetch(url, { headers: getHeaders() });

	if (response.status === 404) return null;
	if (!response.ok) throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);

	const data = await response.json();
	const content = Buffer.from(data.content, 'base64').toString('utf-8');

	return { content, sha: data.sha, path: data.path, name: data.name };
}

async function upsertFile(path, content, message, sha = null) {
	const { owner, repo, branch } = getGitHubConfig();
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

	const body = {
		message,
		content: Buffer.from(content).toString('base64'),
		branch
	};

	if (sha) body.sha = sha;

	const response = await fetch(url, {
		method: 'PUT',
		headers: getHeaders(),
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
	}

	const data = await response.json();
	return {
		sha: data.content.sha,
		path: data.content.path,
		commitUrl: data.commit.html_url
	};
}

async function deleteFile(path, message, sha) {
	const { owner, repo, branch } = getGitHubConfig();
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

	const response = await fetch(url, {
		method: 'DELETE',
		headers: getHeaders(),
		body: JSON.stringify({ message, sha, branch })
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
	}

	const data = await response.json();
	return { commitUrl: data.commit.html_url };
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