import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from './ocr/ocr.service';
import { LlmService } from './llm/llm.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, OcrService, LlmService, PrismaService],
  exports: [LlmService],
})
export class DocumentsModule {}
