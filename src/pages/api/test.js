export const prerender = false;

/**
 * Endpoint de teste simples para verificar se as APIs estão funcionando
 * GET /api/test
 */
export async function GET() {
	return new Response(JSON.stringify({
		status: 'success',
		message: 'API funcionando corretamente!',
		timestamp: new Date().toISOString(),
		environment: {
			NODE_ENV: process.env.NODE_ENV,
			VERCEL: process.env.VERCEL,
			github_configured: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO)
		}
	}), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}