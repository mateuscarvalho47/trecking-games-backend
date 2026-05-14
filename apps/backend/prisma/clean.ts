import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/config/env.js';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const deleted = await prisma.user.deleteMany();
  console.log(`deleted ${deleted.count} user(s)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
