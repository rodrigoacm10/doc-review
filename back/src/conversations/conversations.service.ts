import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../documents/llm/llm.service';

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    private llmService: LlmService,
  ) {}

  async checkDocumentOwner(documentId: string, userId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId },
    });
    return !!document;
  }

  async getDocumentByUser(documentId: string, userId: string) {
    return this.prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });
  }

  async getDocumentConversations(documentId: string) {
    return this.prisma.conversation.findMany({
      where: { documentId },
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
