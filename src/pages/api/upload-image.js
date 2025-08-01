export const prerender = false;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('image');

		if (!file || file.size === 0) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Nenhuma imagem foi enviada'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validar tipo de arquivo
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validar tamanho do arquivo (máximo 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return new Response(JSON.stringify({
				success: false,
				message: 'Arquivo muito grande. Máximo 5MB.'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Gerar nome único para o arquivo
		const timestamp = Date.now();
		const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
		const fileName = `${timestamp}-${originalName}`;

		// Caminho para salvar a imagem
		const assetsPath = path.join(process.cwd(), 'src', 'assets');
		const filePath = path.join(assetsPath, fileName);

		// Garantir que a pasta assets existe
		if (!fs.existsSync(assetsPath)) {
			fs.mkdirSync(assetsPath, { recursive: true });
		}

		// Converter o arquivo para buffer e salvar
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.writeFileSync(filePath, buffer);

		// Retornar o caminho relativo para usar no heroImage
		const relativePath = `../../assets/${fileName}`;

		return new Response(JSON.stringify({
			success: true,
			message: 'Imagem enviada com sucesso!',
			filename: fileName,
			path: relativePath
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (error) {
		console.error('Erro no upload:', error);
		return new Response(JSON.stringify({
			success: false,
			message: 'Erro interno do servidor'
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}