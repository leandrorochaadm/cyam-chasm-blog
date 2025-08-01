export const prerender = false;

/**
 * Endpoint simples para testar se a estrutura básica funciona
 * GET /api/github/simple-status
 */
export async function GET() {
	try {
		// Verificar variáveis de ambiente
		const envCheck = {
			GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
			GITHUB_OWNER: !!process.env.GITHUB_OWNER,
			GITHUB_REPO: !!process.env.GITHUB_REPO,
			GITHUB_BRANCH: !!process.env.GITHUB_BRANCH
		};

		const allEnvSet = Object.values(envCheck).every(Boolean);

		return new Response(JSON.stringify({
			status: allEnvSet ? 'configured' : 'not_configured',
			message: allEnvSet ? 'GitHub configurado' : 'GitHub não configurado',
			environment: envCheck,
			timestamp: new Date().toISOString()
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		return new Response(JSON.stringify({
			status: 'error',
			message: error.message,
			timestamp: new Date().toISOString()
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}