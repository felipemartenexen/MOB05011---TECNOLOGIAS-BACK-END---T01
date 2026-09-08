import express, { NextFunction, Request, Response } from "express";
import { productsRouter } from "./routes/products.routes";

export const app = express();

app.use(express.json());

// GET / -> status da API
app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/products", productsRouter);

// Rota inexistente
app.use((_req: Request, res: Response) => {
  return res.status(404).json({
    error: "Not Found",
    message: "Rota nao encontrada.",
  });
});

// Tratamento de erros
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  return res.status(500).json({
    error: "Internal Server Error",
    message: "Erro inesperado ao processar a requisicao.",
  });
});
