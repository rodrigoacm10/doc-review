import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Res,
  Param,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Express, Response } from 'express';
import { join } from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = uuid() + extname(file.originalname);
          cb(null, unique);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const { userId } = req.user;

    return this.documentsService.processDocument({
      userId,
      imagePath: `uploads/${file.filename}`,
      imageUrl: `/uploads/${file.filename}`,
      originalFilename: file.originalname,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async listMyDocuments(@Req() req) {
    const { userId } = req.user;

    return this.documentsService.getUserDocuments(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response, @Req() req) {
    const { userId } = req.user;

    const document = await this.documentsService.getDocumentByIdAndUser(
      id,
      userId,
    );
    if (!document) {
      throw new NotFoundException('Documento não encontrado.');
    }

    const filePath = join(__dirname, '..', '..', document.imagePath);
    return res.download(filePath, document.originalFilename);
  }

  @Get(':id/conversations')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Param('id') id: string, @Req() req) {
    const { userId } = req.user;

    const document = await this.documentsService.getDocumentByIdAndUser(
      id,
      userId,
    );
    if (!document) throw new NotFoundException('Documento não encontrado');

    const conversations =
      await this.documentsService.getDocumentsConversations(id);

    return { conversations };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/ask')
  async askQuestion(
    @Param('id') documentId: string,
    @Body() body: { question: string },
    @Req() req,
  ) {
    const { userId } = req.user;
    const { question } = body;

    const document = await this.documentsService.getDocumentByIdAndUser(
      documentId,
      userId,
    );
    if (!document) throw new NotFoundException('Documento não encontrado');

    const answer = await this.documentsService.askAndSave(
      documentId,
      document.extractedText,
      question,
    );

    return { question, answer };
  }
}
