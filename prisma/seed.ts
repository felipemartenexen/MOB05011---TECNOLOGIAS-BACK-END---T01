import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const products: Prisma.ProductCreateInput[] = [
  {
    title: "Notebook Dell Inspiron 15 3520",
    description:
      "Notebook com processador Intel Core i5 de 12a geracao, 16 GB de RAM DDR4 e SSD NVMe de 512 GB. Tela de 15,6 polegadas Full HD antirreflexo.",
    price: new Prisma.Decimal("3799.90"),
    stock: 12,
  },
  {
    title: "Monitor LG UltraWide 29WP500",
    description:
      "Monitor ultrawide de 29 polegadas, painel IPS, resolucao 2560x1080, taxa de atualizacao de 75 Hz e suporte a HDR10.",
    price: new Prisma.Decimal("1249.00"),
    stock: 7,
  },
  {
    title: "Teclado Mecanico Keychron K8 Pro",
    description:
      "Teclado mecanico sem fio no layout tenkeyless, switches Gateron marrom hot-swappable, conexao Bluetooth 5.1 ou USB-C e retroiluminacao RGB.",
    price: new Prisma.Decimal("899.50"),
    stock: 21,
  },
  {
    title: "Mouse Logitech MX Master 3S",
    description:
      "Mouse sem fio para produtividade com sensor de 8000 DPI, clique silencioso, scroll MagSpeed e pareamento simultaneo com ate tres dispositivos.",
    price: new Prisma.Decimal("649.90"),
    stock: 15,
  },
  {
    title: "SSD Externo Samsung T7 1TB",
    description:
      "SSD portatil USB 3.2 Gen 2 com velocidade de leitura de ate 1.050 MB/s, corpo em aluminio e criptografia por senha via AES 256 bits.",
    price: new Prisma.Decimal("729.00"),
    stock: 30,
  },
  {
    title: "Fone Sony WH-1000XM5",
    description:
      "Headphone over-ear com cancelamento ativo de ruido, ate 30 horas de bateria, codec LDAC e microfones dedicados para chamadas.",
    price: new Prisma.Decimal("2199.00"),
    stock: 9,
  },
];

async function main() {
  console.log("Limpando a tabela products...");
  await prisma.product.deleteMany();

  console.log(`Inserindo ${products.length} produtos...`);
  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    console.log(`  #${created.id} - ${created.title}`);
  }

  console.log("Seed concluido com sucesso.");
}

main()
  .catch((error) => {
    console.error("Falha ao executar o seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
