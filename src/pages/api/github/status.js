export const prerender = false;

import { GitHubService } from '../../services/github.js';

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
				configured: false
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Tentar inicializar o serviço
		const github = new GitHubService();
		
		// Verificar rate limits (teste de conectividade)
		const rateLimit = await github.checkRateLimit();
		
		if (!rateLimit) {
			return new Response(JSON.stringify({
				status: 'error',
				message: 'Falha ao conectar com GitHub API',
				configured: false
			}), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Verificar se consegue acessar o repositório
		const testPath = 'README.md';
		const canAccessRepo = await github.fileExists(testPath);

		return new Response(JSON.stringify({
			status: 'success',
			message: 'GitHub API configurado corretamente',
			configured: true,
			repository: {
				owner: process.env.GITHUB_OWNER,
				repo: process.env.GITHUB_REPO,
				branch: process.env.GITHUB_BRANCH,
				accessible: canAccessRepo
			},
			rateLimit: {
				limit: rateLimit.limit,
				remaining: rateLimit.remaining,
				resetIn: rateLimit.resetIn + ' minutos'
			}
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Erro ao verificar status GitHub:', error);

		return new Response(JSON.stringify({
			status: 'error',
			message: error.message,
			configured: false,
			error: process.env.NODE_ENV === 'development' ? error.stack : undefined
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}