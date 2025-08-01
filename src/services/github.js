/**
 * Serviço para interação com GitHub API
 * Permite operações CRUD em arquivos do repositório
 */

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
	constructor() {
		this.token = process.env.GITHUB_TOKEN;
		this.owner = process.env.GITHUB_OWNER; // ex: "usuario"
		this.repo = process.env.GITHUB_REPO;   // ex: "cyan-chasm"
		this.branch = process.env.GITHUB_BRANCH || 'main';
		
		if (!this.token || !this.owner || !this.repo) {
			throw new Error('Variáveis de ambiente GitHub não configuradas');
		}
	}

	/**
	 * Headers padrão para requests da GitHub API
	 */
	get headers() {
		return {
			'Authorization': `token ${this.token}`,
			'Accept': 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'User-Agent': 'Cyan-Chasm-Blog/1.0'
		};
	}

	/**
	 * Buscar conteúdo de um arquivo
	 */
	async getFile(path) {
		try {
			const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`;
			const response = await fetch(url, {
				headers: this.headers
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
	async upsertFile(path, content, message, sha = null) {
		try {
			const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`;
			
			const body = {
				message,
				content: Buffer.from(content).toString('base64'),
				branch: this.branch
			};

			// Se SHA fornecido, é uma atualização
			if (sha) {
				body.sha = sha;
			}

			const response = await fetch(url, {
				method: 'PUT',
				headers: this.headers,
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
	async deleteFile(path, message, sha) {
		try {
			const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${path}`;
			
			const response = await fetch(url, {
				method: 'DELETE',
				headers: this.headers,
				body: JSON.stringify({
					message,
					sha,
					branch: this.branch
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
	async fileExists(path) {
		const file = await this.getFile(path);
		return file !== null;
	}

	/**
	 * Gerar slug baseado no título
	 */
	generateSlug(title) {
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
	formatDate(dateString) {
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
	createMarkdownContent(data) {
		const frontmatter = [];
		frontmatter.push('---');
		frontmatter.push(`title: '${data.title.replace(/'/g, "''")}'`);
		frontmatter.push(`description: '${data.description.replace(/'/g, "''")}'`);
		frontmatter.push(`pubDate: '${this.formatDate(data.pubDate)}'`);
		
		if (data.updatedDate) {
			frontmatter.push(`updatedDate: '${this.formatDate(data.updatedDate)}'`);
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
	async checkRateLimit() {
		try {
			const url = `${GITHUB_API_BASE}/rate_limit`;
			const response = await fetch(url, {
				headers: this.headers
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
}