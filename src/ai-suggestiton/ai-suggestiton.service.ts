import { Injectable, NotFoundException } from '@nestjs/common';

import { langChainService } from './langChain.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AiSuggestitonService {
  constructor(
    private prisma: PrismaService,
    private langChainService: langChainService,
  ) {}

  async suggestFromLastOrder(userId: string) {
    const lastOrder = await this.prisma.order.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderedProducts: {
          omit: {
            orderId: true,
          },
        },
      },
    });

    if (!lastOrder) {
      throw new NotFoundException('No previous order found');
    }

    const warehouseStocks = await this.prisma.warehouseStocks.findMany({
      where: {
        warehouseId: lastOrder.warehouseId,
        quantity: {
          gt: 0,
        },
      },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            price: true,
            category: true,
            description: true,
          },
        },
      },
    });

    if (warehouseStocks.length === 0) {
      throw new NotFoundException('No warehouse products available');
    }

    const orderedProductIds = new Set(
      lastOrder.orderedProducts
        .map((product) => product.productId)
        .filter((productId): productId is string => Boolean(productId)),
    );
    const orderedBrands = new Set(
      lastOrder.orderedProducts.map((product) => product.brand.toLowerCase()),
    );

    const warehouseProducts = warehouseStocks.map((stock) => ({
      productId: stock.product.id,
      name: stock.product.name,
      brand: stock.product.brand,
      price: stock.product.price,
      category: stock.product.category,
      description: stock.product.description,
      quantity: stock.quantity,
    }));

    const fallbackSuggestions = warehouseProducts
      .filter((product) => !orderedProductIds.has(product.productId))
      .sort((first, second) => {
        const firstBrandMatch = orderedBrands.has(first.brand.toLowerCase())
          ? 1
          : 0;
        const secondBrandMatch = orderedBrands.has(second.brand.toLowerCase())
          ? 1
          : 0;

        if (firstBrandMatch !== secondBrandMatch) {
          return secondBrandMatch - firstBrandMatch;
        }

        return second.quantity - first.quantity;
      })
      .slice(0, 5)
      .map((product) => ({
        productId: product.productId,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: product.quantity,
        reason: orderedBrands.has(product.brand.toLowerCase())
          ? `Matches a brand from your last order: ${product.brand}`
          : `Available in the same warehouse as your last order`,
      }));

    let aiSuggestions: unknown = null;

    try {
      const aiResponse = await this.langChainService.suggestProducts({
        lastOrderProducts: lastOrder.orderedProducts.map((product) => ({
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity: product.quantity,
        })),
        warehouseProducts,
      });

      aiSuggestions = this.parseAiSuggestions(aiResponse);
    } catch {
      aiSuggestions = fallbackSuggestions;
    }

    return {
      success: true,
      lastOrder: {
        id: lastOrder.id,
        createdAt: lastOrder.createdAt,
        warehouseId: lastOrder.warehouseId,
        products: lastOrder.orderedProducts,
      },
      warehouse: warehouseStocks[0]?.warehouse,
      suggestions: aiSuggestions,
      fallbackSuggestions,
    };
  }

  private parseAiSuggestions(content: unknown) {
    if (typeof content !== 'string') {
      return content;
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const json = jsonMatch ? jsonMatch[0] : content;

    return JSON.parse(json);
  }
}
