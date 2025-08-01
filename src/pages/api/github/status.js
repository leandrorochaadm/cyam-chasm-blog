export const prerender = false;

/**
 * Endpoint para verificar status da configuração GitHub
 * GET /api/github/status
 */
export async function GET() {
	try {
		// Verificar se variáveis de ambiente estão configuradas
		const envCheck = {
			GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
			GITHUB_OWNER: !!process.env.GITHUB_OWNER,
			GITHUB_REPO: !!process.env.GITHUB_REPO,
			GITHUB_BRANCH: !!process.env.GITHUB_BRANCH
		};

		const allEnvSet = Object.values(envCheck).every(Boolean);

		if (!allEnvSet) {
			return new Response(JSON.stringify({
				status: 'error',
				message: 'Variáveis de ambiente GitHub não configuradas',
				environment: envCheck,
				configured: false,
				nextSteps: [
					'1. Criar GitHub Personal Access Token: https://github.com/settings/tokens/new',
					'2. Permissões: repo (full control)',
					'3. Configurar variáveis GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO'
				]
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Se configurado, testar conectividade com GitHub API
		const token = process.env.GITHUB_TOKEN;
		const owner = process.env.GITHUB_OWNER;
		const repo = process.env.GITHUB_REPO;

		// Teste básico de rate limit
		try {
			const response = await fetch('https://api.github.com/rate_limit', {
				headers: {
					'Authorization': `token ${token}`,
					'Accept': 'application/vnd.github.v3+json',
					'User-Agent': 'Cyan-Chasm-Blog/1.0'
				}
			});

			if (!response.ok) {
				throw new Error(`GitHub API Error: ${response.status}`);
			}

			const data = await response.json();
			const rateLimit = {
				limit: data.rate.limit,
				remaining: data.rate.remaining,
				resetIn: Math.ceil((data.rate.reset * 1000 - Date.now()) / 1000 / 60) // minutos
			};

			// Teste de acesso ao repositório
			let canAccessRepo = false;
			try {
				const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
					headers: {
						'Authorization': `token ${token}`,
						'Accept': 'application/vnd.github.v3+json',
						'User-Agent': 'Cyan-Chasm-Blog/1.0'
					}
				});
				canAccessRepo = repoResponse.ok || repoResponse.status === 404; // 404 é ok, só significa que README não existe
			} catch (error) {
				console.log('Erro ao testar acesso ao repo:', error.message);
			}

			return new Response(JSON.stringify({
				status: 'success',
				message: 'GitHub API configurado e funcionando!',
				configured: true,
				repository: {
					owner,
					repo,
					branch: process.env.GITHUB_BRANCH || 'main',
					accessible: canAccessRepo
				},
				rateLimit,
				environment: envCheck,
				ready: true
			}), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});

		} catch (error) {
			return new Response(JSON.stringify({
				status: 'error',
				message: 'Falha ao conectar com GitHub API: ' + error.message,
				configured: true,
				environment: envCheck,
				error: 'GITHUB_CONNECTION_FAILED',
				suggestions: [
					'Verificar se o token GitHub está correto',
					'Verificar se o token tem permissões "repo"',
					'Verificar se GITHUB_OWNER e GITHUB_REPO estão corretos'
				]
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}

	} catch (error) {
		console.error('Erro ao verificar status GitHub:', error);

		return new Response(JSON.stringify({
			status: 'error',
			message: 'Erro interno: ' + error.message,
			configured: false,
			error: process.env.NODE_ENV === 'development' ? error.stack : undefined
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}