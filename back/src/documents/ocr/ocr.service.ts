import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractText(imagePath: string): Promise<string> {
    const result = await Tesseract.recognize(imagePath, 'eng');
    return result.data.text;
  }
}
