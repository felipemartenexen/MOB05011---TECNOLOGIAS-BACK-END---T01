import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { serializeProduct } from "../serializers";

export const productsRouter = Router();

// GET /products -> lista todos os produtos
productsRouter.get("/", async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });

  return res.status(200).json({
    count: products.length,
    data: products.map(serializeProduct),
  });
});

// GET /products/:id -> retorna um produto pelo id (404 quando nao encontrado)
productsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: "O parametro 'id' deve ser um numero inteiro positivo.",
    });
  }

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return res.status(404).json({
      error: "Not Found",
      message: `Produto com id ${id} nao encontrado.`,
    });
  }

  return res.status(200).json({ data: serializeProduct(product) });
});
