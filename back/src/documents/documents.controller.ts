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
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { v4 as uuid } from 'uuid';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Express, Response } from 'express';
import { AuthenticatedRequest } from 'src/@types/auth';

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
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
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
  async listMyDocuments(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;

    return this.documentsService.getUserDocuments(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('download/:id')
  async download(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ) {
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

  @UseGuards(JwtAuthGuard)
  @Get('download/:id/full')
  async downloadWithContent(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ) {
    const { userId } = req.user;
    return this.documentsService.generateDocumentWithContent(id, userId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDocument(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { userId } = req.user;

    const deleted = await this.documentsService.deleteDocument(id, userId);
    if (!deleted) {
      throw new NotFoundException('Documento não encontrado ou sem permissão');
    }

    return { message: 'Documento deletado com sucesso' };
  }
}
