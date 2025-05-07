import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async explainText(text: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Explique o conteúdo do seguinte documento:\n${text}`,
        },
      ],
    });

    return completion.choices[0]?.message?.content || '';
  }

  async askQuestion(documentText: string, question: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente que ajuda a entender documentos.',
        },
        {
          role: 'user',
          content: `Baseado nesse documento:\n\n${documentText}\n\nResponda a pergunta: ${question}`,
        },
      ],
    });

    return completion.choices[0].message?.content || '';
  }

  async explainTextStream(
    prompt: string,
    options: { onToken: (token: string) => void },
  ): Promise<void> {
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) options.onToken(token);
    }
  }
}
