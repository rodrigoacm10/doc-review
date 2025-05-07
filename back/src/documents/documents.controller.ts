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
    const userId = req.user.userId;

    return this.documentsService.processDocument({
      userId,
      imagePath: `uploads/${file.filename}`, // <--- aqui!
      imageUrl: `/uploads/${file.filename}`,
      originalFilename: file.originalname,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async listMyDocuments(@Req() req) {
    return this.documentsService.getUserDocuments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response, @Req() req) {
    const document = await this.documentsService.getDocumentByIdAndUser(
      id,
      req.user.userId,
    );
    if (!document) {
      throw new NotFoundException('Documento não encontrado.');
    }

    const filePath = join(__dirname, '..', '..', document.imagePath);
    return res.download(filePath, document.originalFilename);
  }
}
