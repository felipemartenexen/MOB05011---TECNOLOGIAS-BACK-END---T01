# Catálogo de Produtos — API REST

API back-end em **Node.js + TypeScript + Express** que persiste produtos em um banco **PostgreSQL 15** rodando em container **Docker**, com **Prisma** para modelagem, migrations e seed.

Fluxo validado: `Express → Prisma → PostgreSQL (Docker) → requisições testadas no Insomnia`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Linguagem | TypeScript 5 |
| Servidor HTTP | Express 4 |
| ORM | Prisma 6 |
| Banco | PostgreSQL 15 (Docker Compose) |
| Testes de API | Insomnia |

---

## Estrutura de pastas

```
.
├── docker-compose.yml          # PostgreSQL 15 com volume e porta mapeada
├── .env.example                # modelo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma           # model Product
│   ├── seed.ts                 # popula o banco com 6 produtos reais
│   └── migrations/             # migration inicial versionada
├── src/
│   ├── server.ts               # bootstrap (conecta no banco e sobe o servidor)
│   ├── app.ts                  # instância do Express, rota GET / e handlers de erro
│   ├── prisma.ts               # instância única do PrismaClient
│   ├── serializers.ts          # serialização do Decimal como string
│   └── routes/
│       └── products.routes.ts  # GET /products e GET /products/:id
└── insomnia/
    └── insomnia-catalogo-produtos.json   # workspace do Insomnia para importar
```

---

## Como executar do zero

Pré-requisitos: **Node.js 20+**, **npm** e **Docker Desktop** (ou Docker Engine + Compose).

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd catalogo-produtos-api
npm install
```

### 2. Criar o arquivo de variáveis de ambiente

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Conteúdo esperado do `.env`:

```env
POSTGRES_USER=catalogo
POSTGRES_PASSWORD=catalogo123
POSTGRES_DB=catalogo
POSTGRES_PORT=5432

DATABASE_URL="postgresql://catalogo:catalogo123@localhost:5432/catalogo?schema=public"

PORT=3000
```

### 3. Subir o banco no Docker

```bash
docker compose up -d
```

Conferir se o container está de pé e saudável:

```bash
docker compose ps
```

### 4. Aplicar a migration

```bash
npx prisma migrate dev --name init
```

O comando cria a tabela `products` no PostgreSQL e gera o Prisma Client.
Se a migration já existir no repositório, o Prisma apenas a aplica.

### 5. Popular o banco (seed)

```bash
npm run seed
```

Saída esperada: 6 produtos inseridos, com id, título, descrição, preço (`Decimal`), estoque e timestamps.

### 6. Subir a API

```bash
npm run dev
```

Servidor disponível em `http://localhost:3000`.

### 7. Conferir os dados no Prisma Studio (opcional)

```bash
npx prisma studio
```

Abre em `http://localhost:5555` com a tabela `products` preenchida.

---

## Endpoints

### `GET /` — status da API

```json
{ "status": "ok" }
```

### `GET /products` — lista todos os produtos

```json
{
  "count": 6,
  "data": [
    {
      "id": 1,
      "title": "Notebook Dell Inspiron 15 3520",
      "description": "Notebook com processador Intel Core i5 de 12a geracao...",
      "price": "3799.90",
      "stock": 12,
      "createdAt": "2026-09-07T12:00:00.000Z",
      "updatedAt": "2026-09-07T12:00:00.000Z"
    }
  ]
}
```

### `GET /products/:id` — retorna um produto pelo id

Sucesso (`200`):

```json
{
  "data": {
    "id": 1,
    "title": "Notebook Dell Inspiron 15 3520",
    "description": "Notebook com processador Intel Core i5 de 12a geracao...",
    "price": "3799.90",
    "stock": 12,
    "createdAt": "2026-09-07T12:00:00.000Z",
    "updatedAt": "2026-09-07T12:00:00.000Z"
  }
}
```

Id inexistente (`404`):

```json
{
  "error": "Not Found",
  "message": "Produto com id 9999 nao encontrado."
}
```

Id inválido, como `/products/abc` (`400`):

```json
{
  "error": "Bad Request",
  "message": "O parametro 'id' deve ser um numero inteiro positivo."
}
```

---

## Modelo de dados

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  title       String   @map("title") @db.VarChar(120)
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("products")
}
```

O campo `price` usa `Decimal(10,2)` em vez de `float/double`, evitando erro de arredondamento em valores monetários. Na resposta JSON ele é serializado como string, preservando as duas casas decimais.

---

## Scripts do `package.json`

| Script | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor em modo watch (tsx) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Executa a versão compilada |
| `npm run seed` | Executa `prisma/seed.ts` via tsx |
| `npm run prisma:migrate` | Atalho para `prisma migrate dev` |
| `npm run prisma:deploy` | Aplica as migrations existentes (produção/CI) |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:studio` | Abre o Prisma Studio |

---

## Testes no Insomnia

1. Abrir o Insomnia.
2. `Application` → `Preferences` → `Data` → `Import Data` → `From File`.
3. Selecionar `insomnia/insomnia-catalogo-produtos.json`.
4. O workspace **Catalogo de Produtos API** traz quatro requisições prontas:
   - `GET /` (status da API)
   - `GET /products` (lista todos)
   - `GET /products/:id` (usa a variável `product_id`, padrão `1`)
   - `GET /products/9999` (valida o retorno 404)

As variáveis `base_url` e `product_id` ficam no *Base Environment* e podem ser ajustadas sem editar as requisições.

---

## Encerrar o ambiente

```bash
# para os containers, preservando os dados no volume
docker compose down

# para os containers e apaga o volume (recomeça do zero)
docker compose down -v
```

---

## Observações de implementação

- Sem frameworks adicionais além do Express, conforme o enunciado.
- Migration versionada no repositório, para que a API funcione do zero em outra máquina com os comandos acima.
- Volume `postgres_data` garante persistência dos dados entre reinicializações do container.
- Erros básicos tratados: id inválido (400), produto inexistente (404), rota inexistente (404) e falha inesperada (500), sempre com JSON informativo.
