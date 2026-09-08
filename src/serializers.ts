import { Product } from "@prisma/client";

/**
 * Converte o registro do Prisma em JSON.
 * O campo price e Decimal no banco e e devolvido como string
 * para nao perder precisao na serializacao.
 */
export function serializeProduct(product: Product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price.toFixed(2),
    stock: product.stock,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
