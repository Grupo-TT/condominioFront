import { NextRequest, NextResponse } from 'next/server';

interface GenerarReporteBody {
    html: string;
    nombreArchivo: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: GenerarReporteBody = await request.json();
        const { html, nombreArchivo } = body;

        // Validar que se recibieron los datos necesarios
        if (!html || !nombreArchivo) {
            return NextResponse.json(
                { error: 'Se requiere html y nombreArchivo' },
                { status: 400 }
            );
        }

        const apiKey = process.env.HTML2PDF_API_KEY;

        if (!apiKey) {
            console.error('HTML2PDF_API_KEY no está configurada');
            return NextResponse.json(
                { error: 'Error de configuración del servidor' },
                { status: 500 }
            );
        }

        // Llamar a la API de HTML2PDF.app
        const html2pdfResponse = await fetch('https://api.html2pdf.app/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: html,
                apiKey: apiKey,
                format: 'A4',
                marginTop: 20,
                marginRight: 20,
                marginBottom: 20,
                marginLeft: 20,
                media: 'print',
            }),
        });

        if (!html2pdfResponse.ok) {
            const errorText = await html2pdfResponse.text();
            console.error('Error de HTML2PDF.app:', errorText);
            return NextResponse.json(
                { error: 'Error al generar el PDF' },
                { status: html2pdfResponse.status }
            );
        }

        // Obtener el PDF como ArrayBuffer
        const pdfBuffer = await html2pdfResponse.arrayBuffer();

        // Retornar el PDF con los headers apropiados
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${nombreArchivo}.pdf"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('Error en la generación del reporte:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
