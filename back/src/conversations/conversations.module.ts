import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../documents/llm/llm.service';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, PrismaService, LlmService],
})
export class ConversationsModule {}
