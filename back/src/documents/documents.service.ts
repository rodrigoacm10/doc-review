import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from './llm/llm.service';
import { OcrService } from './ocr/ocr.service';

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

  async getDocumentsConversations(documentId: string) {
    return this.prisma.conversation.findMany({
      where: { documentId: documentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async askAndSave(documentId: string, documentText: string, question: string) {
    const answer = await this.llmService.askQuestion(documentText, question);

    await this.prisma.conversation.create({
      data: {
        documentId,
        question,
        answer,
      },
    });

    return answer;
  }
}
