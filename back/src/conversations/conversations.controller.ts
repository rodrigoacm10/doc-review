import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':documentId')
  async getHistory(@Param('documentId') documentId: string, @Req() req) {
    const { userId } = req.user;

    const documentExists = await this.conversationsService.checkDocumentOwner(
      documentId,
      userId,
    );
    if (!documentExists)
      throw new NotFoundException('Documento não encontrado');

    const conversations =
      await this.conversationsService.getDocumentConversations(documentId);

    return { conversations };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':documentId/ask')
  async ask(
    @Param('documentId') documentId: string,
    @Body() body: { question: string },
    @Req() req,
  ) {
    const { userId } = req.user;
    const { question } = body;

    const document = await this.conversationsService.getDocumentByUser(
      documentId,
      userId,
    );
    if (!document) throw new NotFoundException('Documento não encontrado');

    const answer = await this.conversationsService.askAndSave(
      documentId,
      document.extractedText,
      question,
    );

    return { question, answer };
  }
}
