/**
 * Serviço para interação com GitHub API
 * Funções para operações CRUD em arquivos do repositório
 */

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Verificar se as variáveis de ambiente estão configuradas
 */
export function isGitHubConfigured() {
	const token = process.env.GITHUB_TOKEN;
	const owner = process.env.GITHUB_OWNER;  
	const repo = process.env.GITHUB_REPO;
	
	return !!(token && owner && repo);
}

/**
 * Obter configuração do GitHub
 */
function getGitHubConfig() {
	if (!isGitHubConfigured()) {
		throw new Error('Variáveis de ambiente GitHub não configuradas. Configure GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO nas variáveis de ambiente.');
	}

	return {
		token: process.env.GITHUB_TOKEN,
		owner: process.env.GITHUB_OWNER,
		repo: process.env.GITHUB_REPO,
		branch: process.env.GITHUB_BRANCH || 'main'
	};
}

/**
 * Headers padrão para requests da GitHub API
 */
function getHeaders() {
	const { token } = getGitHubConfig();
	return {
		'Authorization': `token ${token}`,
		'Accept': 'application/vnd.github.v3+json',
		'Content-Type': 'application/json',
		'User-Agent': 'Cyan-Chasm-Blog/1.0'
	};
}

/**
 * Buscar conteúdo de um arquivo
 */
export async function getFile(path) {
	const { owner, repo } = getGitHubConfig();
	
	try {
		const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
		const response = await fetch(url, {
			headers: getHeaders()
		});

		if (response.status === 404) {
			return null; // Arquivo não existe
		}

		if (!response.ok) {
			throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		
		// Decodificar conteúdo base64
		const content = Buffer.from(data.content, 'base64').toString('utf-8');
		
		return {
			content,
			sha: data.sha,
			path: data.path,
			name: data.name
		};
	} catch (error) {
		console.error('Erro ao buscar arquivo:', error);
		throw error;
	}
}

/**
 * Criar ou atualizar um arquivo
 */
export async function upsertFile(path, content, message, sha = null) {
	const { owner, repo, branch } = getGitHubConfig();
	
	try {
		const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
		
		const body = {
			message,
			content: Buffer.from(content).toString('base64'),
			branch
		};

		// Se SHA fornecido, é uma atualização
		if (sha) {
			body.sha = sha;
		}

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
	} catch (error) {
		console.error('Erro ao salvar arquivo:', error);
		throw error;
	}
}

/**
 * Deletar um arquivo
 */
export async function deleteFile(path, message, sha) {
	const { owner, repo, branch } = getGitHubConfig();
	
	try {
		const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
		
		const response = await fetch(url, {
			method: 'DELETE',
			headers: getHeaders(),
			body: JSON.stringify({
				message,
				sha,
				branch
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
		}

		const data = await response.json();
		return {
			commitUrl: data.commit.html_url
		};
	} catch (error) {
		console.error('Erro ao deletar arquivo:', error);
		throw error;
	}
}

/**
 * Verificar se arquivo existe
 */
export async function fileExists(path) {
	const file = await getFile(path);
	return file !== null;
}

/**
 * Gerar slug baseado no título
 */
export function generateSlug(title) {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove acentos
		.replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
		.replace(/\s+/g, '-') // Substitui espaços por hífens
		.replace(/-+/g, '-') // Remove hífens duplos
		.trim('-'); // Remove hífens do início/fim
}

/**
 * Formatar data para frontmatter
 */
export function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { 
		month: 'short', 
		day: 'numeric', 
		year: 'numeric' 
	});
}

/**
 * Criar conteúdo markdown com frontmatter
 */
export function createMarkdownContent(data) {
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

/**
 * Verificar rate limits da API
 */
export async function checkRateLimit() {
	try {
		const url = `${GITHUB_API_BASE}/rate_limit`;
		const response = await fetch(url, {
			headers: getHeaders()
		});

		if (!response.ok) {
			throw new Error(`Erro ao verificar rate limit: ${response.status}`);
		}

		const data = await response.json();
		return {
			limit: data.rate.limit,
			remaining: data.rate.remaining,
			reset: new Date(data.rate.reset * 1000),
			resetIn: Math.ceil((data.rate.reset * 1000 - Date.now()) / 1000 / 60) // minutos
		};
	} catch (error) {
		console.error('Erro ao verificar rate limit:', error);
		return null;
	}
}