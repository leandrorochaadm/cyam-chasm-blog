export const prerender = false;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para otimizar imagens
async function optimizeImage(buffer, originalName, originalType) {
    const maxWidth = 1920; // Largura máxima para imagens
    const maxHeight = 1080; // Altura máxima para imagens
    const quality = 85; // Qualidade para WebP (85% mantém boa qualidade visual)

    try {
        // Obter informações da imagem original
        const metadata = await sharp(buffer).metadata();

        // Determinar se precisa redimensionar
        const needsResize = metadata.width > maxWidth || metadata.height > maxHeight;

        // Configurar pipeline Sharp
        let pipeline = sharp(buffer);

        // Redimensionar se necessário (mantendo proporção)
        if (needsResize) {
            pipeline = pipeline.resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Converter para WebP com otimização
        const optimizedBuffer = await pipeline
            .webp({
                quality: quality,
                effort: 6, // Nível máximo de esforço para compressão
                lossless: false
            })
            .toBuffer();

        // Gerar nome do arquivo otimizado
        const nameWithoutExt = path.parse(originalName).name;
        const optimizedName = `${nameWithoutExt}.webp`;

        // Calcular redução de tamanho
        const originalSize = buffer.length;
        const optimizedSize = optimizedBuffer.length;
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

        return {
            buffer: optimizedBuffer,
            filename: optimizedName,
            originalSize,
            optimizedSize,
            reduction: `${reduction}%`,
            format: 'webp'
        };
    } catch (error) {
        console.error('Erro ao otimizar imagem:', error);
        throw new Error('Falha na otimização da imagem');
    }
}

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
                message: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP. A imagem será automaticamente otimizada e convertida para WebP.'
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

        // Converter o arquivo para buffer
        const arrayBuffer = await file.arrayBuffer();
        const originalBuffer = Buffer.from(arrayBuffer);

        // Otimizar a imagem
        const optimizedImage = await optimizeImage(originalBuffer, file.name, file.type);

        // Gerar nome único para o arquivo otimizado
		const timestamp = Date.now();
        const sanitizedName = optimizedImage.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const finalFileName = `${timestamp}-${sanitizedName}`;

		// Caminho para salvar a imagem
		const assetsPath = path.join(process.cwd(), 'src', 'assets');
        const filePath = path.join(assetsPath, finalFileName);

		// Garantir que a pasta assets existe
		if (!fs.existsSync(assetsPath)) {
			fs.mkdirSync(assetsPath, { recursive: true });
		}

        // Salvar a imagem otimizada
        fs.writeFileSync(filePath, optimizedImage.buffer);

		// Retornar o caminho relativo para usar no heroImage
        const relativePath = `../../assets/${finalFileName}`;

		return new Response(JSON.stringify({
			success: true,
            message: `Imagem otimizada com sucesso! Redução de ${optimizedImage.reduction} no tamanho.`,
            filename: finalFileName,
            path: relativePath,
            optimization: {
                originalSize: Math.round(optimizedImage.originalSize / 1024) + ' KB',
                optimizedSize: Math.round(optimizedImage.optimizedSize / 1024) + ' KB',
                reduction: optimizedImage.reduction,
                format: optimizedImage.format
            }
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