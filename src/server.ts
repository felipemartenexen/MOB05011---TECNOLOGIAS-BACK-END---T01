import "dotenv/config";
import { app } from "./app";
import { prisma } from "./prisma";

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("Conectado ao PostgreSQL.");
  } catch (error) {
    console.error("Nao foi possivel conectar ao banco de dados:", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

bootstrap();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
