import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Express } from 'express';

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
    return this.documentsService.processDocument(file.path, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async listMyDocuments(@Req() req) {
    return this.documentsService.getUserDocuments(req.user.userId);
  }
}
