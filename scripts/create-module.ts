import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv[2];

if (!name) {
  console.error('Usage: pnpm gen:module <module-name>');
  console.error('Example: pnpm gen:module product');
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(
    'Module name must be lowercase, start with a letter, and use only letters, numbers, or hyphens.',
  );
  process.exit(1);
}

function pluralize(word: string): string {
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(word)) return `${word}es`;
  return `${word}s`;
}

const pascal = name
  .split('-')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');

const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
const plural = pluralize(name.split('-').at(-1) ?? name);
const pluralCamel = pluralize(camel);
const dir = join(process.cwd(), 'src', 'modules', name);

if (existsSync(dir)) {
  console.error(`Module "${name}" already exists at ${dir}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const files: Record<string, string> = {
  [`${name}.schema.ts`]: `\
import { z } from 'zod';

export const create${pascal}Schema = z.object({
  // TODO: define fields
});

export type Create${pascal}Input = z.infer<typeof create${pascal}Schema>;
`,

  [`${name}.errors.ts`]: `\
import { NotFoundError } from '@/lib/errors.js';

export class ${pascal}NotFoundError extends NotFoundError {
  constructor() {
    super('${pascal}');
  }
}
`,

  [`${name}.repository.ts`]: `\
import type { PrismaClient } from '@/generated/prisma/client.js';
import type { Create${pascal}Input } from './${name}.schema.js';

export class ${pascal}Repository {
  constructor(private prisma: PrismaClient) {}

  findById(id: string) {
    return this.prisma.${camel}.findUnique({ where: { id } });
  }

  findAll() {
    return this.prisma.${camel}.findMany();
  }

  create(data: Create${pascal}Input) {
    return this.prisma.${camel}.create({ data });
  }

  update(id: string, data: Partial<Create${pascal}Input>) {
    return this.prisma.${camel}.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.${camel}.delete({ where: { id } });
  }
}
`,

  [`${name}.service.ts`]: `\
import type { Create${pascal}Input } from './${name}.schema.js';
import type { ${pascal}Repository } from './${name}.repository.js';
import { ${pascal}NotFoundError } from './${name}.errors.js';

export class ${pascal}Service {
  constructor(private ${pluralCamel}: ${pascal}Repository) {}

  async getById(id: string) {
    const item = await this.${pluralCamel}.findById(id);
    if (!item) throw new ${pascal}NotFoundError();
    return item;
  }

  getAll() {
    return this.${pluralCamel}.findAll();
  }

  create(input: Create${pascal}Input) {
    return this.${pluralCamel}.create(input);
  }

  async update(id: string, input: Partial<Create${pascal}Input>) {
    await this.getById(id);
    return this.${pluralCamel}.update(id, input);
  }

  async delete(id: string) {
    await this.getById(id);
    return this.${pluralCamel}.delete(id);
  }
}
`,

  [`${name}.controller.ts`]: `\
import type { FastifyReply, FastifyRequest } from 'fastify';
import { parse } from '@/lib/validate.js';
import { create${pascal}Schema } from './${name}.schema.js';
import type { ${pascal}Service } from './${name}.service.js';

export class ${pascal}Controller {
  constructor(private ${pluralCamel}: ${pascal}Service) {}

  getAll = async (_req: FastifyRequest, reply: FastifyReply) => {
    const items = await this.${pluralCamel}.getAll();
    return reply.send(items);
  };

  getById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const item = await this.${pluralCamel}.getById(req.params.id);
    return reply.send(item);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const input = parse(create${pascal}Schema, req.body);
    const item = await this.${pluralCamel}.create(input);
    return reply.code(201).send(item);
  };

  update = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const input = parse(create${pascal}Schema.partial(), req.body);
    const item = await this.${pluralCamel}.update(req.params.id, input);
    return reply.send(item);
  };

  delete = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.${pluralCamel}.delete(req.params.id);
    return reply.code(204).send();
  };
}
`,

  [`${name}.routes.ts`]: `\
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ${pascal}Repository } from './${name}.repository.js';
import { ${pascal}Service } from './${name}.service.js';
import { ${pascal}Controller } from './${name}.controller.js';
import { create${pascal}Schema } from './${name}.schema.js';

const idParam = z.object({ id: z.string() });

export async function ${camel}Routes(app: FastifyInstance) {
  const repo = new ${pascal}Repository(app.prisma);
  const service = new ${pascal}Service(repo);
  const controller = new ${pascal}Controller(service);

  app.get('/${plural}', {
    schema: { tags: ['${name}'], summary: 'Listar ${plural}' },
    handler: controller.getAll,
  });

  app.get('/${plural}/:id', {
    schema: { tags: ['${name}'], summary: 'Buscar ${name} por id', params: idParam },
    handler: controller.getById,
  });

  app.post('/${plural}', {
    schema: {
      tags: ['${name}'],
      summary: 'Criar ${name}',
      body: create${pascal}Schema,
      response: { 201: z.any() },
    },
    handler: controller.create,
  });

  app.patch('/${plural}/:id', {
    schema: {
      tags: ['${name}'],
      summary: 'Atualizar ${name}',
      params: idParam,
      body: create${pascal}Schema.partial(),
    },
    handler: controller.update,
  });

  app.delete('/${plural}/:id', {
    schema: {
      tags: ['${name}'],
      summary: 'Deletar ${name}',
      params: idParam,
      response: { 204: z.null() },
    },
    handler: controller.delete,
  });
}
`,
};

for (const [filename, content] of Object.entries(files)) {
  writeFileSync(join(dir, filename), content, 'utf-8');
}

console.log(`\nModule "${name}" created at src/modules/${name}/\n`);
console.log('Files generated:');
for (const filename of Object.keys(files)) {
  console.log(`  src/modules/${name}/${filename}`);
}
console.log(`
Next steps:
  1. Add the Prisma model for "${camel}" in prisma/schema.prisma
  2. Run: pnpm prisma:migrate && pnpm prisma:generate
  3. Register the routes in src/app.ts:
       import { ${camel}Routes } from '@/modules/${name}/${name}.routes.js';
       await app.register(${camel}Routes);
`);
