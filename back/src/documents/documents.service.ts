import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from './llm/llm.service';
import { OcrService } from './ocr/ocr.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private ocrService: OcrService,
    private llmService: LlmService,
  ) {}

  async processDocument({
    userId,
    imagePath,
    imageUrl,
    originalFilename,
  }: {
    userId: string;
    imagePath: string;
    imageUrl: string;
    originalFilename: string;
  }) {
    const extractedText = await this.ocrService.extractText(imagePath);
    const llmResponse = await this.llmService.explainText(extractedText);

    return this.prisma.document.create({
      data: {
        userId,
        imagePath,
        imageUrl,
        originalFilename,
        extractedText,
        llmResponse,
      },
    });
  }

  async getUserDocuments(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentByIdAndUser(documentId: string, userId: string) {
    return this.prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });
  }

  async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) return false;

    await this.prisma.document.delete({
      where: { id: documentId },
    });

    return true;
  }

  async generateDocumentWithContent(
    documentId: string,
    userId: string,
    res: Response,
  ) {
    const document = await this.getDocumentByIdAndUser(documentId, userId);
    if (!document) throw new NotFoundException('Documento não encontrado');

    const conversations = await this.prisma.conversation.findMany({
      where: { documentId: documentId },
      orderBy: { createdAt: 'asc' },
    });

    const doc = new PDFDocument({ autoFirstPage: false });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${document.originalFilename || 'documento'}.pdf"`,
    );
    doc.pipe(res);

    doc.addPage();
    doc
      .fontSize(20)
      .text(document.originalFilename || 'Documento', { align: 'center' });

    try {
      const imagePath = path.join(__dirname, '..', '..', document.imagePath);
      const imageBuffer = await fsp.readFile(imagePath);
      const format = document.imagePath.endsWith('.png') ? 'PNG' : 'JPEG';
      doc.image(imageBuffer, {
        fit: [400, 400],
        align: 'center',
        valign: 'center',
      });
    } catch (err) {
      console.error('Erro ao carregar imagem:', err);
      doc
        .fontSize(12)
        .fillColor('red')
        .text('Erro ao carregar imagem do documento.');
    }

    doc.addPage();
    doc
      .fontSize(16)
      .fillColor('black')
      .text('Texto Extraído:', { underline: true });
    doc
      .moveDown()
      .fontSize(12)
      .text(document.extractedText || 'Nenhum texto.', {
        align: 'left',
      });

    doc.addPage();
    doc.fontSize(16).text('Resumo LLM:', { underline: true });
    doc
      .moveDown()
      .fontSize(12)
      .text(document.llmResponse || 'Nenhuma resposta.');

    doc.addPage();
    doc.fontSize(16).text('Histórico de Perguntas e Respostas:', {
      underline: true,
    });
    doc.moveDown();

    conversations.forEach((c, index) => {
      doc.fontSize(12).fillColor('black');
      doc.text(`Pergunta ${index + 1}: ${c.question}`);
      doc.moveDown(0.5);
      doc.text(`Resposta ${index + 1}: ${c.answer}`);
      doc.moveDown();
    });

    doc.end();
  }
}
