import { Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';

@Injectable()
export class langChainService {
  private model: ChatGroq;
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });
  }

  async suggestiton(query: string) {
    const response = await this.model.invoke([
      {
        role: 'system',
        content: 'You are Helpful Ai Assistant',
      },
      {
        role: 'user',
        content: query,
      },
    ]);

    console.log(response.content);
    return {
      success: true,
      response: response.content,
    };
  }

  async suggestProducts(context: {
    lastOrderProducts: Array<{
      name: string;
      brand: string;
      price: number;
      quantity: number;
    }>;
    warehouseProducts: Array<{
      productId: string;
      name: string;
      brand: string;
      price: number;
      category: string;
      description: string;
      quantity: number;
    }>;
  }) {
    const response = await this.model.invoke([
      {
        role: 'system',
        content:
          'You are an ecommerce recommendation assistant. Recommend useful products from the warehouse stock based on the user last order. Return only valid JSON with this shape: {"suggestions":[{"productId":"string","name":"string","reason":"string"}]}. Recommend at most 5 products.',
      },
      {
        role: 'user',
        content: JSON.stringify(context),
      },
    ]);

    return response.content;
  }
}
